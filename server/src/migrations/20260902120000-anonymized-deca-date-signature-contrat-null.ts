import { getDbCollection } from "../common/utils/mongodbUtils"

export const up = async () => {
  console.log("starting 20260902120000-anonymized-deca-date-signature-contrat-null")

  // BAL-API-CE65CCX : des documents anonymized.deca antérieurs à l'ajout du champ
  // date_signature_contrat sur deca en sont dépourvus, ce qui viole le required
  // du schéma de validation (date_signature_contrat est nullable mais pas optionnel).
  await getDbCollection("anonymized.deca").updateMany(
    { date_signature_contrat: { $exists: false } },
    { $set: { date_signature_contrat: null } },
    { bypassDocumentValidation: true }
  )

  console.log("ended 20260902120000-anonymized-deca-date-signature-contrat-null")
}

export const requireShutdown: boolean = false
