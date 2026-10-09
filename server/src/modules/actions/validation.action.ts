import { captureException } from "@sentry/node"
import { isCompanyEmail } from "company-email-validator"
import { addDays } from "date-fns"
import type { IPostRoutes, IResponse } from "shared"
import { getSirenFromSiret } from "shared/helpers/common"
import type { IValidationExternalSource } from "shared/routes/v1/organisation.routes"
import { getAktoVerification } from "../../common/apis/akto"
import { getOpcoEpVerification, OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE, OPCO_EP_CODE_RETOUR_EMAIL_TROUVE } from "../../common/apis/opcoEp"
import { getDbCollection } from "../../common/utils/mongodbUtils"
import config from "../../config"
import { importOrganisation } from "./organisations.actions"
import { importPerson } from "./persons.actions"
import type { IExternalVerification, IValidationMatch } from "./validationProviders"
import { callValidationProvider } from "./validationProviders"

type IValidationResponse = IResponse<IPostRoutes["/v1/organisation/validation"]>

// Valeur stockée dans `persons.source` et `organisations.source`, partagée avec les jobs d'import.
const DB_SOURCE: Record<IValidationExternalSource, string> = {
  akto: "AKTO",
  opco_ep: "OPCO_EP",
}

// cf. `sources` dans le schéma de réponse : les valeurs stockées sont renvoyées en minuscules.
const toResponseSources = (sources: string[]): string[] => Array.from(new Set(sources.map((source) => source.toLowerCase())))

async function getDbVerification(siret: string, rawEmail: string): Promise<Extract<IValidationResponse, { status: "valid" | "invalid" }>> {
  // TODO: parse email
  const email = rawEmail.toLowerCase()
  const [_user, domain] = email.split("@")
  const siren = getSirenFromSiret(siret)

  // check siren / email
  const personsFromEmail = await getDbCollection("persons")
    .find({
      email: email,
      siret: { $regex: `^${siren}` },
    })
    .toArray()

  if (personsFromEmail.length > 0) {
    return {
      status: "valid",
      is_valid: true,
      on: "email",
      sources: toResponseSources(personsFromEmail.map((p) => p.source)),
    }
  }

  // check siren / domain
  if (isCompanyEmail(email)) {
    const organisationsFromDomain = await getDbCollection("organisations")
      .find({
        email_domain: domain,
        siren,
      })
      .toArray()

    if (organisationsFromDomain.length > 0) {
      return {
        status: "valid",
        is_valid: true,
        on: "domain",
        sources: toResponseSources(organisationsFromDomain.map((o) => o.source)),
      }
    }

    return { status: "invalid", is_valid: false, is_company_email: true }
  }

  return { status: "invalid", is_valid: false, is_company_email: false }
}

async function verifyWithAkto(siret: string, email: string, deadline: number): Promise<IExternalVerification> {
  return (await getAktoVerification(getSirenFromSiret(siret), email, deadline)) ? "email" : "no_match"
}

async function verifyWithOpcoEp(siret: string, email: string, deadline: number): Promise<IExternalVerification> {
  const { codeRetour } = await getOpcoEpVerification(siret, email, deadline)
  if (codeRetour === OPCO_EP_CODE_RETOUR_EMAIL_TROUVE) return "email"
  if (codeRetour === OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE) return "domain"
  return "no_match"
}

const EXTERNAL_VERIFICATIONS: Array<[IValidationExternalSource, (siret: string, email: string, deadline: number) => Promise<IExternalVerification>]> = [
  ["akto", verifyWithAkto],
  ["opco_ep", verifyWithOpcoEp],
]

// Un échec d'écriture du cache ne doit pas faire perdre la réponse positive du fournisseur.
async function cacheExternalMatch(source: IValidationExternalSource, on: IValidationMatch, email: string, siret: string) {
  const data = { email, siret, source: DB_SOURCE[source], ttl: addDays(new Date(), 30) }
  try {
    await Promise.all(on === "email" ? [importPerson(data), importOrganisation(data)] : [importOrganisation(data)])
  } catch (error) {
    captureException(error, { tags: { module: "validation" } })
  }
}

export const validation = async ({ email, siret }: { email: string; siret: string }): Promise<IValidationResponse> => {
  const deadline = Date.now() + config.validation.budgetMs
  const testDb = await getDbVerification(siret, email)
  if (testDb.is_valid) {
    return testDb
  }

  const unavailableSources: IValidationExternalSource[] = []

  for (const [source, verify] of EXTERNAL_VERIFICATIONS) {
    const result = await callValidationProvider(source, () => verify(siret, email, deadline), deadline)

    if (result === "unavailable") {
      unavailableSources.push(source)
    } else if (result !== "no_match") {
      await cacheExternalMatch(source, result, email, siret)
      return { status: "valid", is_valid: true, on: result, sources: [source] }
    }
  }

  if (unavailableSources.length > 0) {
    return { status: "indeterminate", is_valid: false, is_company_email: testDb.is_company_email, unavailable_sources: unavailableSources }
  }

  return testDb
}
