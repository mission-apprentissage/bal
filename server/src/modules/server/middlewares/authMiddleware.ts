import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyRequest,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  preHandlerHookHandler,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
} from "fastify";
import type { IRouteSchema, SecurityScheme, WithSecurityScheme } from "shared/routes/common.routes";

import { authenticationMiddleware } from "@/security/authenticationService";
import { authorizationnMiddleware } from "@/security/authorisationService";

const symbol: unique symbol = Symbol("authStrategy");

type AuthMiddleware = {
  (req: FastifyRequest): Promise<void>;
  [symbol]?: Readonly<SecurityScheme>;
};

export function auth<S extends IRouteSchema & WithSecurityScheme>(schema: S) {
  const authMiddleware: AuthMiddleware = async (req: FastifyRequest) => {
    await authenticationMiddleware(schema, req);
    await authorizationnMiddleware(schema, req);
  };

  authMiddleware[symbol] = schema.securityScheme;

  return authMiddleware;
}

export function describeAuthMiddleware(fn: AuthMiddleware): SecurityScheme | null {
  return fn[symbol] ?? null;
}

declare module "fastify" {
  interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  > {
    auth<
      RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
      ContextConfig = ContextConfigDefault,
      SchemaCompiler extends FastifySchema = FastifySchema,
    >(
      scheme: IRouteSchema & WithSecurityScheme
    ): preHandlerHookHandler<
      RawServer,
      RawRequest,
      RawReply,
      RouteGeneric,
      ContextConfig,
      SchemaCompiler,
      TypeProvider,
      Logger
    >;
  }
}
