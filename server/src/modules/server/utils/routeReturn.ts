import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifySchema,
  FastifyTypeProviderDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
} from "fastify";
import { ResolveFastifyReplyReturnType } from "fastify/types/type-provider";

// catch errors and return the result of the request handler
export function routeReturn(
  serviceFunc: RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGenericInterface,
    ContextConfigDefault,
    FastifySchema,
    FastifyTypeProviderDefault,
    FastifyBaseLogger
  >
): //   : RequestHandler<TParams, any, TBody, TQuery, TLocals>
ResolveFastifyReplyReturnType<
  FastifyTypeProviderDefault,
  FastifySchema,
  RouteGenericInterface
> {
  return async (request, reply) => {
    // @ts-ignore
    const result = (await serviceFunc(request, reply)) as any;
    // le résultat est à renvoyer en JSON par défaut
    if (!reply.getHeader("Content-Type")) {
      reply.set("Content-Type", "application/json");
    }
    reply.send(
      result ?? {
        message: "success",
      }
    );
  };
}
