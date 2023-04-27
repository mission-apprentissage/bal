import { preValidationHookHandler } from "fastify";

/**
 * À utiliser après avoir authentifié l'utilisateur
 */
export const ensureUserIsAdmin: preValidationHookHandler = async (
  request,
  reply,
  done
) => {
  const { user } = request;

  if (!user?.is_admin) {
    return reply.status(401).send("Non autorisé");
  }

  done();
};
