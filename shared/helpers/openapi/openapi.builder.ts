import { randomUUID } from "crypto";
import { registry, safeParse, toJSONSchema } from "zod/v4-mini";
import { OpenApiBuilder } from "openapi3-ts/oas31";
import type { SecurityRequirementObject } from "openapi3-ts/oas30";
import type {
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  ResponsesObject,
  SchemaObject,
  SchemasObject,
} from "openapi3-ts/oas31";
import type { $ZodRegistry, $ZodType, JSONSchema } from "zod/v4/core";
import { extensions } from "../zodHelpers/zodPrimitives.js";
import { modelDescriptors } from "../../models/models.js";
import { zRoutes } from "../../routes/index.js";
import { ZResError } from "../../routes/common.routes.js";
import type { IRouteSchema } from "../../routes/common.routes";

type RegistryMeta = { id?: string | undefined; openapi?: Partial<SchemaObject> };

function getZodSchema(
  zod: $ZodType,
  registry: $ZodRegistry<RegistryMeta>,
  io: "input" | "output"
): SchemaObject | ReferenceObject {
  const meta = registry.get(zod) ?? null;

  if (meta?.id != null) {
    return { $ref: meta.id as string };
  }

  const id = randomUUID();
  registry.add(zod, { id, ...meta });

  const components = generateComponents(registry, io);

  // TODO: cache
  if (meta == null) {
    registry.remove(zod);
  } else {
    registry.add(zod, meta);
  }

  return components.schemas[id] as SchemaObject;
}

function generateOpenApiResponsesObject<R extends IRouteSchema["response"]>(
  response: R,
  registry: $ZodRegistry<RegistryMeta>
): ResponsesObject | null {
  const result = Object.entries(response).reduce<ResponsesObject>((acc, [code, main]) => {
    if (code in response) {
      acc[code] = {
        description: "",
        content: {
          "application/json": {
            schema: getZodSchema(main, registry, "output"),
          },
        },
      };
    }

    return acc;
  }, {});

  if (Object.keys(result).length === 0) {
    return null;
  }

  return result;
}

function isRequiredZod(schema: $ZodType): boolean {
  switch (schema._zod.def.type) {
    case "object":
    case "union":
    case "int":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "record":
    case "file":
    case "array":
    case "tuple":
    case "intersection":
    case "map":
    case "set":
    case "enum":
    case "literal":
    case "nullable":
    case "nonoptional":
    case "success":
    case "transform":
    case "catch":
    case "nan":
    case "readonly":
    case "template_literal":
    case "promise":
    case "lazy":
    case "custom":
    case "pipe":
      throw new Error(
        `Unexpected Zod type "${schema._zod.def.type}" in isRequiredZod. This is unsupported at the moment.`
      );
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
    case "date":
      return true;
    case "undefined":
    case "optional":
    case "default":
    case "prefault":
      return false;
  }
}

function isEmptyValueAllowedZod(zod: $ZodType): true | undefined {
  return safeParse(zod, "").success ? true : undefined;
}

function generateOpenApiRequest(
  route: IRouteSchema,
  registry: $ZodRegistry<RegistryMeta>
): Pick<OperationObject, "requestBody" | "parameters"> {
  const requestParams: Pick<OperationObject, "requestBody" | "parameters"> = {};
  const parameters: ParameterObject[] = [];

  if (route.method !== "get" && route.body) {
    requestParams.requestBody = {
      content: {
        "application/json": { schema: getZodSchema(route.body, registry, "input") },
      },
      required: true,
    };
  }

  if (route.params) {
    Object.entries(route.params._zod.def.shape).forEach(([name, schema]) => {
      const param: ParameterObject = {
        name: String(name),
        in: "path",
        required: isRequiredZod(schema),
        schema: getZodSchema(schema, registry, "input"),
      };
      if (isEmptyValueAllowedZod(schema)) {
        param.allowEmptyValue = true;
      }
      parameters.push(param);
    });
  }

  const qsZod = route.querystring;
  if (qsZod) {
    switch (qsZod._zod.def.type) {
      case "object":
        Object.entries(qsZod._zod.def.shape).forEach(([name, schema]) => {
          const param: ParameterObject = {
            name: String(name),
            in: "query",
            required: isRequiredZod(schema),
            schema: getZodSchema(schema, registry, "input"),
          };
          if (isEmptyValueAllowedZod(schema)) {
            param.allowEmptyValue = true;
          }
          parameters.push(param);
        });
        break;
      // case "unknown":
      //   break;
      // case "pipe":
      //   Object.entries(qsZod._zod.def.in._zod.def.shape).forEach(([name, schema]) => {
      //     const param: ParameterObject = {
      //       name: String(name),
      //       in: "query",
      //       required: isRequiredZod(schema),
      //       schema: getZodSchema(schema, registry, "input"),
      //     };
      //     parameters.push(param);
      //   });
      //   break;
    }
  }

  if (route.headers) {
    Object.entries(route.headers._zod.def.shape).forEach(([name, schema]) => {
      const param: ParameterObject = {
        name: String(name),
        in: "header",
        required: isRequiredZod(schema),
        schema: getZodSchema(schema, registry, "input"),
      };
      parameters.push(param);
    });
  }

  if (parameters.length > 0) {
    requestParams.parameters = parameters;
  }

  return requestParams;
}

function getSecurityRequirementObject(route: IRouteSchema): SecurityRequirementObject[] {
  if (route.securityScheme === null) {
    return [];
  }

  return [{ [route.securityScheme.auth]: [] }];
}

function generateOpenApiOperationObjectFromZod(
  route: IRouteSchema | undefined,
  registry: $ZodRegistry<RegistryMeta>,
  path: string,
  method: string,
  tag: string
): OperationObject {
  try {
    if (!route) {
      throw new Error(`Invalid route or method: ${method} ${path}`);
    }

    const responses = generateOpenApiResponsesObject(route.response, registry);

    if (!responses) {
      throw new Error(`No response defined for route ${route.method.toUpperCase()} ${route.path}`);
    }

    return {
      tags: [tag],
      operationId: `${method}${path.replaceAll(/[^\w\s]/gi, "_")}`,
      ...generateOpenApiRequest(route, registry),
      responses: {
        ...responses,
        "400": { $ref: "#/components/responses/ErrorResponse" },
        "401": { $ref: "#/components/responses/ErrorResponse" },
        "403": { $ref: "#/components/responses/ErrorResponse" },
        "404": { $ref: "#/components/responses/ErrorResponse" },
        "409": { $ref: "#/components/responses/ErrorResponse" },
        "419": { $ref: "#/components/responses/ErrorResponse" },
        "500": { $ref: "#/components/responses/ErrorResponse" },
        "502": { $ref: "#/components/responses/ErrorResponse" },
        "503": { $ref: "#/components/responses/ErrorResponse" },
      },
      security: getSecurityRequirementObject(route),
    };
  } catch (e) {
    const message = `Error while generating OpenAPI for route ${method.toUpperCase()} ${path}`;
    console.error(message, e);
    throw new Error(message, { cause: e });
  }
}

function generateComponents(
  registry: $ZodRegistry<RegistryMeta>,
  io: "input" | "output"
): { schemas: Record<string, SchemasObject> } {
  const { schemas } = toJSONSchema(registry, {
    unrepresentable: "any",
    uri: (id: string) => id,
    io,
    override: (ctx: { zodSchema: $ZodType; jsonSchema: JSONSchema.BaseSchema }): void => {
      const meta = registry.get(ctx.zodSchema);

      if (meta?.openapi) {
        Object.assign(ctx.jsonSchema, meta?.openapi);
      }

      if (ctx.zodSchema._zod.def.type === "string" && ctx.zodSchema._zod.bag.format === "email") {
        ctx.jsonSchema.format = "email";
      }

      if (ctx.zodSchema._zod.def.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
      }

      if ("maximum" in ctx.jsonSchema && ctx.jsonSchema.maximum === Number.MAX_SAFE_INTEGER) {
        delete ctx.jsonSchema.maximum;
      }

      if ("minimum" in ctx.jsonSchema && ctx.jsonSchema.minimum === Number.MIN_SAFE_INTEGER) {
        delete ctx.jsonSchema.minimum;
      }
    },
  });

  Object.keys(schemas).forEach((key) => {
    const schema = schemas[key];
    if ("$id" in schema) delete schema.$id; // OpenAPI does not use $id
    if ("$schema" in schema) delete schema.$schema; // OpenAPI does not use $schema
  });

  return { schemas } as { schemas: Record<string, SchemasObject> };
}

export function buildOpenApiSchema(version: string, env: string, publicUrl: string): OpenAPIObject {
  const zodRegistry = registry<RegistryMeta>();
  const references = new Set<string>();

  for (const { collectionName, zod } of modelDescriptors) {
    zodRegistry.add(zod, {
      id: `#/components/schemas/${collectionName}`,
    });
    references.add(collectionName);
  }

  zodRegistry.add(ZResError, { id: "#/components/schemas/ErrorObject" });
  references.add("ErrorObject");

  zodRegistry.add(extensions.email, { openapi: { type: "string", format: "email" } });
  zodRegistry.add(extensions.siret, { openapi: { type: "string", pattern: "^\\d{14}$" } });
  zodRegistry.add(extensions.uai, { openapi: { type: "string", pattern: "^\\d{7}[A-Z]$" } });

  const components = generateComponents(zodRegistry, "output");

  const builder = new OpenApiBuilder({
    openapi: "3.1.0",
    info: {
      title: "Documentation technique",
      version,
      license: {
        name: "Etalab-2.0",
        url: "https://github.com/etalab/licence-ouverte/blob/master/LO.md",
      },
      termsOfService: "https://bal.apprentissage.beta.gouv.fr/cgu",
      contact: {
        name: "La bonne alternance",
        email: "labonnealternance@apprentissage.beta.gouv.fr",
      },
    },
    servers: [
      {
        url: publicUrl,
        description: env,
      },
    ],
  });

  for (const name of references) {
    builder.addSchema(name, components.schemas[`#/components/schemas/${name}`]);
  }

  builder.addSecurityScheme("api-key", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "Bearer",
  });

  const VERSION_REGEX = /^\/(v\d)\//;

  const pathItemObjects: Map<string, PathItemObject> = new Map();

  for (const [method, mRoutes] of Object.entries(zRoutes)) {
    for (const [path, operation] of Object.entries(mRoutes)) {
      if (VERSION_REGEX.test(path) || path === "/healthcheck") {
        if (!pathItemObjects.has(path)) {
          pathItemObjects.set(path, {});
        }

        const tag = VERSION_REGEX.exec(path)?.[1] ?? "system";
        const item: PathItemObject = pathItemObjects.get(path) ?? {};

        item[method as keyof PathItemObject] = generateOpenApiOperationObjectFromZod(
          operation,
          zodRegistry,
          path,
          method,
          tag
        );

        pathItemObjects.set(path, item);
      }
    }
  }

  for (const [path, item] of pathItemObjects.entries()) {
    builder.addPath(path, item);
  }

  builder.addResponse("ErrorResponse", {
    description: "Error response",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorObject",
        },
      },
    },
  });

  return builder.getSpec();
}
