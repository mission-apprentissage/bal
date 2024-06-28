import { randomUUID } from "node:crypto";

import { captureException } from "@sentry/node";
import { ObjectId } from "mongodb";
import { BouncerPingResult } from "shared/models/bouncer.email.model";

import logger from "../../logger";
import { sleep } from "../../utils/asyncUtils";
import { getDbCollection } from "../../utils/mongodbUtils";
import { createSmtpConnection, getSmtpServer, quit, sayEhlo, vrfy, vrfyWorkaround } from "./smtpConnection";

type SmtpSupportMap = Map<string, BouncerPingResult | null>;

async function tryVerifyEmail(email: string, retryCount = 0): Promise<BouncerPingResult> {
  const smtp = await getSmtpServer(email);

  const retry = async (r: BouncerPingResult): Promise<BouncerPingResult> => {
    if (r.status === "error" && r.responseCode?.startsWith("4") && retryCount < 3) {
      // Exponential backoff (10s, 60s, 360s)
      await sleep(10_000 * 6 ** retryCount);
      return tryVerifyEmail(email, retryCount + 1);
    }

    return r;
  };

  if (!smtp) {
    return {
      status: "invalid",
      message: "No SMTP server found for domain",
      responseCode: null,
      responseMessage: null,
    };
  }

  const smtpConnection = createSmtpConnection({
    port: 25, // Default SMTP port
    fqdn: "apprentissage.beta.gouv.fr", // Fully Qualified Domain Name of your SMTP server
    sender: "nepasrepondre@apprentissage.beta.gouv.fr", // Email address to use as the sender in SMTP checks,
    email,
    smtp,
  });

  try {
    const elhoResult = await sayEhlo(smtpConnection);
    if (!elhoResult.success) {
      await quit(smtpConnection);

      return retry({
        status: "error",
        message: "Connection to SMTP server failed",
        responseCode: elhoResult.code,
        responseMessage: elhoResult.message,
      });
    }

    const vrfyResult = await vrfy(smtpConnection, elhoResult.extensions);

    if (!vrfyResult.success) {
      await quit(smtpConnection);

      return retry({
        status: "error",
        message: "VRFY command failed",
        responseCode: vrfyResult.code,
        responseMessage: vrfyResult.message,
      });
    }

    // Try to detect softbounce
    if (vrfyResult.status !== "not_supported" && vrfyResult.status !== "valid") {
      await quit(smtpConnection);

      return retry({
        status: vrfyResult.status,
        message: "VRFY validation succeeded",
        responseCode: vrfyResult.code,
        responseMessage: vrfyResult.message,
      });
    }

    const workaroundResult = await vrfyWorkaround(smtpConnection, elhoResult.extensions);
    await quit(smtpConnection);

    if (!workaroundResult.success) {
      return retry({
        status: "not_supported",
        message: "VRFY workaround command failed",
        responseCode: workaroundResult.code,
        responseMessage: workaroundResult.message,
      });
    }

    return {
      status: workaroundResult.status,
      message: "VRFY workaround validation succeeded",
      responseCode: workaroundResult.code,
      responseMessage: workaroundResult.message,
    };
  } catch (err) {
    await smtpConnection.throw(err);
    captureException(err);
    logger.error(err, { email });

    return {
      status: "error",
      message: "Unknown error occurred",
      responseCode: null,
      responseMessage: null,
    };
  }
}

async function tryWithRandomEmail(smtp: string, email: string): Promise<BouncerPingResult | null> {
  const randomEmail = `${randomUUID()}@${email.split("@")[1]}`;
  const randomResult = await tryVerifyEmail(randomEmail);

  if (randomResult.status === "error") {
    return {
      ...randomResult,
      message: "Random email verification failed",
    };
  }

  if (randomResult.status === "valid" || randomResult.status === "not_supported") {
    return {
      ...randomResult,
      status: "not_supported",
      message: "Detection not supported",
    };
  }

  return null;
}

async function verifyDomain(
  smtp: string,
  email: string,
  smtpSupportMap: SmtpSupportMap
): Promise<BouncerPingResult | null> {
  if (!smtpSupportMap.has(smtp)) {
    const domain = email.split("@")[1];
    const randomResult = await tryWithRandomEmail(smtp, email);

    const now = new Date();
    await getDbCollection("bouncer.domain").updateOne(
      { domain, smtp },
      {
        $set: {
          ping: randomResult,
          updated_at: now,
        },
        $setOnInsert: {
          domain,
          smtp,
          created_at: now,
        },
      },
      { upsert: true }
    );

    smtpSupportMap.set(smtp, randomResult);
  }

  return null;
}

async function persistPingResultCache(email: string, ping: BouncerPingResult): Promise<BouncerPingResult> {
  if (ping.status !== "error") {
    await getDbCollection("bouncer.email").insertOne({
      _id: new ObjectId(),
      email,
      domain: email.split("@")[1],
      smtp: null,
      ping,
      created_at: new Date(),
    });
  }

  return ping;
}

export async function verifyEmail(email: string, domainMap: SmtpSupportMap): Promise<BouncerPingResult> {
  try {
    const cached = await getDbCollection("bouncer.email").findOne({ email });

    if (cached) {
      return cached.ping;
    }

    const smtp = await getSmtpServer(email);

    if (!smtp) {
      return persistPingResultCache(email, {
        status: "invalid",
        message: "No SMTP server found for domain",
        responseCode: null,
        responseMessage: null,
      });
    }

    const domainResult = await verifyDomain(smtp, email, domainMap);

    if (domainResult) {
      return domainResult;
    }

    return persistPingResultCache(email, await tryVerifyEmail(email));
  } catch (err) {
    captureException(err);
    logger.error(err, { email });

    return {
      status: "error",
      message: "Unknown error occurred",
      responseCode: null,
      responseMessage: null,
    };
  }
}

export async function verifyEmails(emails: string[]): Promise<BouncerPingResult[]> {
  const knownDomains = await getDbCollection("bouncer.domain")
    .find({
      "ping.status": { $ne: "error" },
    })
    .toArray();

  const domainMap: Map<string, BouncerPingResult | null> = new Map(knownDomains.map((d) => [d.smtp, d.ping]));

  const result = [];

  for (const email of emails) {
    result.push(await verifyEmail(email, domainMap));
  }

  return result;
}
