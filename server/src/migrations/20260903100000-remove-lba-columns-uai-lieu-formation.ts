import { getDbCollection } from "../common/utils/mongodbUtils"

// Le champ uai_lieu_formation n'a jamais été exploité par l'API traininglinks de LBA (seuls
// uai_formateur et uai_formateur_responsable servent à la recherche). Il est retiré du modèle et
// du formulaire : les validateurs Mongo interdisant les propriétés inconnues, il faut le purger des
// listes existantes pour que leurs prochaines mises à jour passent.
export const up = async () => {
  console.log("starting 20260903100000-remove-lba-columns-uai-lieu-formation")

  await getDbCollection("mailingListsV2").updateMany(
    { "config.lba_columns.uai_lieu_formation": { $exists: true } },
    { $unset: { "config.lba_columns.uai_lieu_formation": "" } },
    { bypassDocumentValidation: true }
  )

  console.log("ended 20260903100000-remove-lba-columns-uai-lieu-formation")
}

export const requireShutdown: boolean = false
