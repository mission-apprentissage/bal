import { addDays } from "date-fns"
import type { AnyBulkWriteOperation } from "mongodb"
import type { IOrganisation } from "shared/models/organisation.model"
import type { IPerson } from "shared/models/person.model"
import parentLogger from "@/common/logger"
import { getDbCollection } from "../../../common/utils/mongodbUtils"
import { bulkWriteOrganisations, getImportOrganisationBulkOp } from "../../actions/organisations.actions"
import { bulkWritePersons, getImportPersonBulkOp } from "../../actions/persons.actions"

const logger = parentLogger.child({ module: "job:validation:hydrate_from_deca" })

export async function importPersonFromDeca(signal: AbortSignal) {
  logger.info("counting documents")
  const totalCount = await getDbCollection("deca").countDocuments()

  const progress = {
    done: 0,
    total: totalCount,
    start: Date.now(),
  }

  const ttl = addDays(new Date(), 30)

  const printProgress = () => {
    const now = Date.now()
    const elapsed = now - progress.start
    const speed = elapsed === 0 ? 0 : progress.done / elapsed
    const todo = progress.total - progress.done
    const eta = speed === 0 ? "n/a" : new Date(now + todo / speed).toISOString()
    logger.info(`${String(progress.done).padStart(7)} / ${progress.total}: ETA ${eta}`)
  }

  printProgress()

  logger.info("starting cursor")
  const cursor = getDbCollection("deca").find({}, { signal })

  let buffer: { personOps: AnyBulkWriteOperation<IPerson>[]; organisationOps: AnyBulkWriteOperation<IOrganisation>[] } = {
    personOps: [],
    organisationOps: [],
  }

  for await (const docDeca of cursor) {
    signal.throwIfAborted()

    const input = {
      email: docDeca.employeur.courriel,
      siret: docDeca.employeur.siret,
      source: "DECA",
      ttl,
    }

    const personOps = getImportPersonBulkOp(input)
    const organisationOps = getImportOrganisationBulkOp(input)

    if (personOps.length > 0) {
      buffer.personOps.push(...personOps)
    }
    if (organisationOps.length > 0) {
      buffer.organisationOps.push(...organisationOps)
    }
    if (buffer.personOps.length > 1000 || buffer.organisationOps.length > 1000) {
      await Promise.all([bulkWritePersons(buffer.personOps), bulkWriteOrganisations(buffer.organisationOps)])
      buffer = { personOps: [], organisationOps: [] }
      printProgress()
    }
    progress.done++
  }
  await Promise.all([bulkWritePersons(buffer.personOps), bulkWriteOrganisations(buffer.organisationOps)])

  printProgress()
}
