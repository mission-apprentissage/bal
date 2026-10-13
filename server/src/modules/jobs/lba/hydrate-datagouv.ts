import { Readable, Transform } from "node:stream"
import { parse } from "csv-parse"
import { addYears } from "date-fns"
import { ObjectId } from "mongodb"
import { getSirenFromSiret } from "shared/helpers/common"
import type { IOrganisation } from "shared/models/organisation.model"
import { pipeline } from "stream/promises"
import { z } from "zod/v4-mini"
import parentLogger from "@/common/logger"
import { sleep } from "../../../common/utils/asyncUtils"
import { getDbCollection } from "../../../common/utils/mongodbUtils"

const logger = parentLogger.child({ module: "job:hydrate:datagouv" })

const DATAGOUV_URL = "https://www.data.gouv.fr/fr/datasets/r/4208f064-e655-4bad-93c9-9a3977f3f8cc"
const RETRY_DELAYS_MS = [30_000, 120_000]

interface DataGouvRecord {
  siret: string
  domain_email: string
  data_source: "moncomptepro" | "trackdechets_postal_mail" | "alternance_job_contracted"
}

class DataGouvHttpError extends Error {
  constructor(
    readonly status: number,
    statusText: string
  ) {
    super(`Failed to fetch data: ${status} ${statusText}`)
  }
}

// undici lève un TypeError "fetch failed" quand la connexion échoue et "terminated" quand le flux est coupé
// en cours de lecture. Les autres TypeError sont des bugs : les rejouer ne sert à rien.
function isRetryableError(error: unknown): boolean {
  if (error instanceof DataGouvHttpError) {
    return error.status >= 500 || error.status === 429
  }

  return error instanceof TypeError && (error.message === "fetch failed" || error.message === "terminated")
}

// Rejouer tout l'import est sans risque : chaque ligne est un upsert sur l'index unique (siren, email_domain, source).
export const hydrateDataGouv = async (signal: AbortSignal | null = null): Promise<void> => {
  for (let attempt = 0; ; attempt++) {
    try {
      await importDataGouv(signal)
      return
    } catch (error) {
      if (signal?.aborted || attempt >= RETRY_DELAYS_MS.length || !isRetryableError(error)) {
        throw error
      }
      logger.warn({ err: error, attempt: attempt + 1 }, "import datagouv interrompu, nouvelle tentative")
      await sleep(RETRY_DELAYS_MS[attempt], signal)
    }
  }
}

const importDataGouv = async (signal: AbortSignal | null): Promise<void> => {
  const response = await fetch(DATAGOUV_URL, { signal })
  if (!response.ok) {
    await response.body?.cancel()
    throw new DataGouvHttpError(response.status, response.statusText)
  }

  if (!response.body) {
    throw new Error("No response body")
  }

  const now = new Date()
  const ttl = addYears(new Date(), 1)

  const filterTransform = new Transform({
    objectMode: true,
    transform(chunk: DataGouvRecord, _, callback) {
      if (chunk.data_source !== "alternance_job_contracted") {
        callback(null, chunk)
      } else {
        callback()
      }
    },
  })

  const saveRecord = async (chunk: DataGouvRecord): Promise<void> => {
    const siretParsed = z.string().safeParse(chunk.siret)
    if (!siretParsed.success) {
      return
    }

    const siren = getSirenFromSiret(siretParsed.data)

    const input: Omit<IOrganisation, "updated_at" | "ttl"> = {
      _id: new ObjectId(),
      siren,
      email_domain: chunk.domain_email.toLowerCase(),
      source: chunk.data_source,
      created_at: now,
    }

    await getDbCollection("organisations").updateOne(
      { siren, email_domain: chunk.domain_email.toLowerCase(), source: chunk.data_source },
      {
        $setOnInsert: input,
        $set: { updated_at: now, ttl },
      },
      {
        upsert: true,
      }
    )
  }

  // Transform ignore la promesse renvoyée par transform() : sans callback(error), une erreur d'écriture bloque le pipeline.
  const saveTransform = new Transform({
    objectMode: true,
    transform(chunk: DataGouvRecord, _, callback) {
      saveRecord(chunk).then(() => callback(), callback)
    },
  })

  await pipeline(Readable.fromWeb(response.body), parse({ columns: true, skip_empty_lines: true }), filterTransform, saveTransform, { signal: signal ?? undefined })
}
