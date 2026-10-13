import * as Sentry from "@sentry/node"
import type { FastifyRequest } from "fastify"
import type { Server } from "../../../modules/server/server"

// Le compte appelant n'est remonté que par son identifiant, jamais par son e-mail.
function extractUserData(request: FastifyRequest): Sentry.User {
  const user = request.user

  if (!user) {
    return { segment: "anonymous" }
  }
  if (user.type === "token") {
    return { segment: "access-token" }
  }
  if (user.type === "brevo") {
    return { segment: "brevo" }
  }
  return {
    segment: "user",
    id: user.value._id.toString(),
    type: user.value.is_admin ? "admin" : "standard",
  }
}

export function initSentryFastify(app: Server) {
  app.addHook("onRequest", async (request, _reply) => {
    Sentry.getIsolationScope()
      .setExtra("headers", request.headers)
      .setExtra("method", request.method)
      .setExtra("protocol", request.protocol)
      // Les valeurs de la query peuvent être des données personnelles (cf. scrubCommonEventData) : seuls les noms de paramètres sont gardés.
      .setExtra("query_keys", Object.keys((request.query as Record<string, unknown> | undefined) ?? {}))
  })

  // Les routes s'authentifient dans leur propre `onRequest`, exécuté après les hooks globaux : l'utilisateur n'est connu qu'ici.
  app.addHook("preHandler", async (request, _reply) => {
    Sentry.getIsolationScope().setUser(extractUserData(request))
  })
}
