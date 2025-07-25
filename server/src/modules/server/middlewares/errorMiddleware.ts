import { badRequest, Boom, internal, isBoom } from "@hapi/boom";
import { captureException } from "@sentry/node";
import type { FastifyError } from "fastify";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";
import type { IResError } from "shared/routes/common.routes";
import { $ZodError, treeifyError } from "zod/v4/core";

import type { Server } from "../server";
import config from "@/config";

function boomify(rawError: FastifyError | Boom<unknown> | Error | $ZodError): Boom<unknown> {
  if (isBoom(rawError)) {
    return rawError;
  }

  if (isResponseSerializationError(rawError)) {
    if (config.env === "local") {
      const zodError = rawError.cause;
      return internal(rawError.message, {
        validationError: treeifyError(zodError),
      });
    }

    return internal();
  }

  if (hasZodFastifySchemaValidationErrors(rawError)) {
    return badRequest("Request validation failed", {
      validationError: rawError.validation,
    });
  }

  if ((rawError as FastifyError).statusCode) {
    return new Boom(rawError.message, {
      statusCode: (rawError as FastifyError).statusCode ?? 500,
      data: { rawError },
    });
  }

  if (config.env === "local") {
    return internal(rawError.message, { rawError, cause: rawError });
  }

  return internal();
}

function formatResponseError(rawError: FastifyError | Boom<unknown> | Error | $ZodError): IResError {
  const error = boomify(rawError);

  const result: IResError = {
    statusCode: error.output.statusCode,
    name: error.output.payload.error,
    message: "The server was unable to complete your request",
  };

  if (error.output.statusCode >= 500) {
    return result;
  }

  result.message = error.message;

  if (error.data) {
    result.data = error.data;
  }

  return result;
}

export function errorMiddleware(server: Server) {
  server.setErrorHandler<FastifyError | Boom<unknown> | Error | $ZodError, { Reply: IResError }>(
    (rawError, request, reply) => {
      const payload: IResError = formatResponseError(rawError);

      if (payload.statusCode >= 500 || (request.url.startsWith("/api/v1/webhooks") && payload.statusCode >= 400)) {
        server.log.error(rawError instanceof $ZodError ? treeifyError(rawError) : rawError);
        captureException(rawError);
      }

      return reply.status(payload.statusCode).send(payload);
    }
  );
}
