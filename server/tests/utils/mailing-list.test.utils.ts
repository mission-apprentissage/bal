import { ObjectId } from "mongodb"
import type { BouncerEmail, BouncerPingResult } from "shared/models/bouncer.email.model"
import type { IMailingListComputedDatum } from "shared/models/mailingList.computed.model"
import type { IMailingListV2 } from "shared/models/mailingListV2.model"

export const fixtureNow = new Date("2026-08-24T00:00:00.000Z")
export const fixtureTtl = new Date("2026-09-24T00:00:00.000Z")

export function buildMailingListFixture(overrides: Partial<IMailingListV2> = {}): IMailingListV2 {
  return {
    _id: new ObjectId(),
    name: "Liste de test",
    source: {
      file: { hash_fichier: "hash", delimiter: ",", size: 100, encoding: "utf8" },
      lines: 5,
      columns: ["email", "nom"],
    },
    config: {
      email_column: "email",
      output_columns: [{ input: { type: "source", name: "nom" }, output: "nom", simple: true }],
      lba_columns: null,
    },
    status: "export:success",
    error: null,
    eta: null,
    generation_started_at: null,
    generation_ended_at: null,
    bounce_refresh_notified_at: null,
    progress: { parse: 100, generate: 100, export: 100 },
    output: { lines: 0, empty_source_lines: 0, blacklisted_email_count: 0, invalid_email_count: 0, duplicate_email_count: 0 },
    job_id: null,
    ttl: fixtureTtl,
    encode_key: "encode-key",
    added_by: new ObjectId(),
    updated_at: fixtureNow,
    created_at: fixtureNow,
    ...overrides,
  }
}

export function buildBouncerPing(status: BouncerPingResult["status"], responseMessage: string | null = null): BouncerPingResult {
  return { status, message: "test", responseCode: null, responseMessage }
}

export function buildBouncerEmailFixture(email: string, ping: BouncerPingResult): BouncerEmail {
  return {
    _id: new ObjectId(),
    email,
    domain: email.split("@")[1],
    smtp: "mx1.exemple.fr",
    ping,
    created_at: fixtureNow,
    ttl: ping.status === "invalid" ? null : new Date("2026-08-25T00:00:00.000Z"),
  }
}

export function buildComputedLineFixture(params: {
  mailingListId: ObjectId
  lineNumber: number
  email: string
  emailStatus: IMailingListComputedDatum["email_status"]
  bounceStatus?: string
}): IMailingListComputedDatum {
  const { mailingListId, lineNumber, email, emailStatus, bounceStatus } = params

  return {
    _id: new ObjectId(),
    mailing_list_id: mailingListId,
    line_number: lineNumber,
    email,
    data: {
      nom: `nom-${lineNumber}`,
      ...(bounceStatus === undefined
        ? {}
        : {
            bounce_status: bounceStatus,
            bounce_message: "message initial",
            bounce_response_code: "",
            bounce_response_message: "",
          }),
    },
    email_status: emailStatus,
    ttl: fixtureTtl,
  }
}
