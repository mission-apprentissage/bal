import type { ResponseConfig, RouteConfig } from "@asteasolutions/zod-to-openapi";
import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { formatParamUrl } from "@fastify/swagger";
import type { oas30 } from "openapi3-ts";
import type { ZodType } from "zod";

import { zRoutes } from "../../index";
import type { IRouteSchema } from "../../routes/common.routes";
import { ZResError } from "../../routes/common.routes";

function generateOpenApiResponseObject(schema: ZodType, description: string | null = null): ResponseConfig {
  return {
    description: description ?? schema._def.openapi?.metadata?.description ?? schema.description ?? "",
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

const commonResponses: { [statusCode: string]: ResponseConfig | { $ref: string } } = {
  400: { $ref: "#/components/responses/BadRequest" },
  401: { $ref: "#/components/responses/Unauthorized" },
  403: { $ref: "#/components/responses/Forbidden" },
  404: { $ref: "#/components/responses/NotFound" },
  429: { $ref: "#/components/responses/TooManyRequests" },
  500: { $ref: "#/components/responses/InternalServerError" },
  503: { $ref: "#/components/responses/ServiceUnavailable" },
};

function registerResponseError(id: string, description: string, registry: OpenAPIRegistry) {
  registry.registerComponent("responses", id, {
    description,
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  });
}

function registerResponsesError(registry: OpenAPIRegistry) {
  registry.register("Error", ZResError);
  registerResponseError("BadRequest", "La requete ne respecte pas les reglès de validations.", registry);
  registerResponseError("Unauthorized", "L'authentification est requise.", registry);
  registerResponseError("Forbidden", "L'utilisateur n'a pas les droits d'effectuer l'opération demandée", registry);
  registerResponseError("NotFound", "Le serveur n'a pas trouvé la ressource demandée.", registry);
  registerResponseError(
    "TooManyRequests",
    "L'utilisateur a émis trop de requêtes dans un laps de temps donné.",
    registry
  );
  registerResponseError(
    "InternalServerError",
    "Le serveur a rencontré une situation qu'il ne sait pas traiter.",
    registry
  );
  registerResponseError("ServiceUnavailable", "Le serveur n'est pas prêt pour traiter la requête", registry);
}

function generateOpenApiResponsesObject<R extends IRouteSchema["response"]>(
  response: R
): { [statusCode: string]: ResponseConfig | { $ref: string } } {
  const codes = Object.keys(response) as Array<keyof R>;

  return codes.reduce((acc, code: keyof R) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: ZodType = response[code] as any;
    acc[code as string] = generateOpenApiResponseObject(code in acc ? schema.or(ZResError) : schema);

    return acc;
  }, commonResponses);
}

function generateOpenApiRequest(route: IRouteSchema): RouteConfig["request"] {
  const requestParams: RouteConfig["request"] = {};

  if (route.method !== "get" && route.body) {
    requestParams.body = {
      content: {
        "application/json": { schema: route.body },
      },
      required: true,
    };
  }
  if (route.params) {
    requestParams.params = route.params;
  }
  if (route.querystring) {
    requestParams.query = route.querystring;
  }
  if (route.headers) {
    requestParams.headers = route.headers;
  }

  return requestParams;
}

function getSecurityRequirementObject(route: IRouteSchema): oas30.SecurityRequirementObject[] {
  if (route.securityScheme === null) {
    return [];
  }

  if (route.securityScheme.auth !== "api-key") {
    throw new Error("getSecurityRequirementObject: securityScheme not supported");
  }

  return [{ "api-key": [] }];
}

function addOpenApiOperation(
  path: string,
  method: "get" | "put" | "post" | "delete",
  route: IRouteSchema,
  registry: OpenAPIRegistry
) {
  if (!route.openapi) {
    return;
  }

  const config: RouteConfig = {
    ...route.openapi,
    method,
    path: formatParamUrl(path),
    responses: generateOpenApiResponsesObject(route.response),
  };

  const request = generateOpenApiRequest(route);
  if (request) {
    config.request = request;
  }
  const security = getSecurityRequirementObject(route);
  if (security) {
    config.security = security;
  }

  registry.registerPath(config);
}

export function generateOpenApiSchema(version: string, env: string, publicUrl: string) {
  const registry = new OpenAPIRegistry();

  registry.registerComponent("securitySchemes", "api-key", {
    type: "apiKey",
    name: "authorization",
    in: "header",
  });
  registerResponsesError(registry);

  for (const [method, pathRoutes] of Object.entries(zRoutes)) {
    for (const [path, route] of Object.entries(pathRoutes)) {
      addOpenApiOperation(path, method as "get" | "put" | "post" | "delete", route, registry);
    }
  }

  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    info: {
      title: "API documentation BAL",
      version,
      license: {
        name: "MIT",
      },
    },
    openapi: "3.1.0",
    servers: [
      {
        url: publicUrl,
        description: env,
      },
    ],
  });
}
