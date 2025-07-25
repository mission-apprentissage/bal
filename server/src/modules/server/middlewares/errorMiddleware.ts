import Boom from "@hapi/boom";
import { captureException } from "@sentry/node";
import type { FastifyError } from "fastify";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";
import type { IResError } from "shared/routes/common.routes";
import type { ZodError } from "zod";

import type { Server } from "../server";
import config from "@/config";

function getZodMessageError(error: ZodError, context: string): string {
  const normalizedContext = context ? `${context}.` : "";
  return error.issues.reduce((acc, issue, i) => {
    const path = issue.path.length === 0 ? "" : issue.path.join(".");
    const delimiter = i === 0 ? "" : ", ";
    return acc + `${delimiter}${normalizedContext}${path}: ${issue.message}`;
  }, "");
}

export function boomify(rawError: FastifyError | Boom.Boom<unknown> | Error | ZodError): Boom.Boom<unknown> {
  if (Boom.isBoom(rawError)) {
    return rawError;
  }

  if (isResponseSerializationError(rawError)) {
    if (config.env === "local") {
      return Boom.internal(getZodMessageError(rawError.cause, "response"), {
        rawError,
      });
    }

    return Boom.internal("Une erreur est survenue");
  }

  if (hasZodFastifySchemaValidationErrors(rawError)) {
    return Boom.badRequest("Request validation failed", {
      validationError: rawError.validation,
    });
  }

  if ((rawError as FastifyError).statusCode) {
    return new Boom.Boom(rawError.message, {
      statusCode: (rawError as FastifyError).statusCode ?? 500,
      data: { rawError },
    });
  }

  if (config.env === "local") {
    return Boom.internal(rawError.message, { rawError, cause: rawError });
  }

  return Boom.internal("Une erreur est survenue");
}

export function errorMiddleware(server: Server) {
  server.setErrorHandler<FastifyError | Boom.Boom<unknown> | Error | ZodError, { Reply: IResError }>(
    (rawError, request, reply) => {
      const error = boomify(rawError);

      const payload: IResError = {
        statusCode: error.output.statusCode,
        name: error.output.payload.error,
        message: error.message,
        ...(error.data ? { data: error.data } : {}),
      };

      if (
        error.output.statusCode >= 500 ||
        (request.url.startsWith("/api/v1/webhooks") && error.output.statusCode >= 400)
      ) {
        server.log.error(rawError);
        captureException(rawError);
      }

      return reply.status(payload.statusCode).send(payload);
    }
  );
}
