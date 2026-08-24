import { getDbCollection } from "../common/utils/mongodbUtils"

// Aplati \r\n, \r et \n en " | " via trois $replaceAll imbriqués (même règle que bouncer-columns.ts)
function buildSanitizePipelineExpression(field: string) {
  const replaceAll = (input: unknown, find: string) => ({ $replaceAll: { input, find, replacement: " | " } })
  return replaceAll(replaceAll(replaceAll(`$${field}`, "\r\n"), "\r"), "\n")
}

export const up = async () => {
  console.log("starting 20260824090000-mailing-list-output-refinements")

  await getDbCollection("mailingListsV2").updateMany(
    { "output.duplicate_email_count": { $exists: false } },
    { $set: { "output.duplicate_email_count": 0 } },
    { bypassDocumentValidation: true }
  )
  await getDbCollection("mailingListsV2").updateMany(
    { bounce_refresh_notified_at: { $exists: false } },
    { $set: { bounce_refresh_notified_at: null } },
    { bypassDocumentValidation: true }
  )

  // Sanitise le stock existant : les listes générées avant ce déploiement gardaient des messages
  // SMTP multi-lignes dans leurs colonnes bounce — un re-export produirait encore des lignes
  // fantômes dans les tableurs (le refresh au re-export ne touche que les erreurs résolues)
  for (const field of ["data.bounce_message", "data.bounce_response_message"]) {
    await getDbCollection("mailingList.computed").updateMany({ [field]: /[\r\n]/ }, [{ $set: { [field]: buildSanitizePipelineExpression(field) } }], {
      bypassDocumentValidation: true,
    })
  }

  console.log("ended 20260824090000-mailing-list-output-refinements")
}

export const requireShutdown: boolean = true
