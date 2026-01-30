import { Transform } from "stream";
import { pipeline } from "stream/promises";

import type { ColumnOption } from "csv-stringify/sync";

import brevo from "@getbrevo/brevo";
import { stringify } from "csv-stringify/sync";
import { EmailStatus } from "shared/models/data/lba.mailingList.model";
import logger from "@/common/logger";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import { groupStreamData } from "@/common/utils/streamUtils";
import config from "@/config";

/**
 * Initialise les webhooks Brevo au démarrage du docker server. Echoue sans conséquences s'ils existent déjà
 */

export const uploadContactListToBrevo = async (
  contacts: IBrevoContact[],
  contactMapper: ColumnOption[],
  listId: string
) => {
  const fileBody = stringify(contacts, {
    delimiter: ";",
    header: true,
    columns: contactMapper,
    cast: {
      number: (value) => "" + value || "0",
      string: (value) => value ?? "",
    },
  });

  const clientBrevo = new brevo.ContactsApi();
  clientBrevo.setApiKey(brevo.ContactsApiApiKeys.apiKey, config.brevo.apiKey);

  const requestContactImport = new brevo.RequestContactImport();

  requestContactImport.fileBody = fileBody;
  requestContactImport.updateExistingContacts = true;
  requestContactImport.emptyContactsAttributes = true;

  requestContactImport.listIds = [parseInt(listId)];

  const maxRetries = 5;
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    try {
      await clientBrevo.importContacts(requestContactImport);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      lastError = error;
      const statusCode = error?.response?.statusCode || error?.response?.status;

      if (statusCode === 429) {
        attempt++;
        if (attempt < maxRetries) {
          const headers = error?.response?.headers || {};
          const rateLimitReset = headers["x-sib-ratelimit-reset"];
          const rateLimitRemaining = headers["x-sib-ratelimit-remaining"];

          // Use Brevo's x-sib-ratelimit-reset header (time in ms until reset) or fallback to exponential backoff
          // Brevo rate limit: 10 RPS, so wait at least 100ms between retries
          // Exponential backoff: 100ms, 200ms, 500ms, 1s, 2s
          const delayMs = rateLimitReset ? parseInt(rateLimitReset) : Math.min(100 * Math.pow(2, attempt - 1), 2000);

          logger.warn(
            `Brevo API rate limit reached (429). Remaining: ${rateLimitRemaining || "unknown"}. Retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          logger.error(`Brevo API rate limit reached. Max retries (${maxRetries}) exceeded`);
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  throw lastError;
};

type IBrevoContact = {
  email: string;
  siret: string;
  activitePrincipaleEtablissement: string;
  nbContrats: number;
  nbSocietesMemeNaf: number;
  //nafLabel: 1,  // TODO: à changer quand disponible
  raisonsociale: string;
};

let contactCount = 0;

const contactMapper: ColumnOption[] = [
  { key: "email", header: "EMAIL" },
  {
    key: "raisonsociale",
    header: "ENTREPRISE_RAISON_SOCIALE",
  },
  { key: "siret", header: "ENTREPRISE_SIRET" },
  {
    key: "nbContrats",
    header: "NB_CONTRATS_DECA",
  },
  {
    key: "nbSocietesMemeNaf",
    header: "NOMBRE_ENTREPRISES_RECRUTENT_MEME_NAF",
  },
  {
    key: "activitePrincipaleEtablissement", // TODO: à changer quand disponible
    header: "NAF_LABEL",
  },
];

const postToBrevo = async (contacts: IBrevoContact[]) => {
  contactCount += contacts.length;

  await uploadContactListToBrevo(contacts, contactMapper, config.brevo.contactListId.toString());
};

const sendContacts = async () => {
  const cursor = await getDbCollection("lba.mailingLists")
    .find(
      { emailStatus: EmailStatus.VALID },
      {
        projection: {
          email: 1,
          siret: 1,
          activitePrincipaleEtablissement: 1,
          nbContrats: 1,
          nbSocietesMemeNaf: 1,
          //nafLabel: 1,  TODO:
          raisonsociale: 1,
        },
      }
    )
    .stream();

  const postingTransform = new Transform({
    objectMode: true,
    async transform(contacts, _, callback) {
      await postToBrevo(contacts as IBrevoContact[]);
      callback();
    },
  });

  await pipeline(cursor, groupStreamData({ size: 2000 }), postingTransform);
};

export const sendContactsToBrevo = async () => {
  logger.info("Sending contacts to Brevo ...");

  try {
    await sendContacts();

    logger.info(`${contactCount} Contacts successfully sent to Brevo.`);
  } catch (err) {
    logger.error(`Error sending contacts to Brevo.`);
    throw err;
  }
};
