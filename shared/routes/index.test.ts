import assert from "node:assert";

import { describe, it } from "vitest";

import type { IRouteSchema, IRouteSchemaGet, IRouteSchemaWrite, IRoutesDef } from "./common.routes";
import { ZResError } from "./common.routes";
import { zRoutes } from ".";

describe("zRoutes", () => {
  it("should define error schema compatible with default one from error middleware", () => {
    for (const [method, zMethodRoutes] of Object.entries(zRoutes)) {
      for (const [path, def] of Object.entries(zMethodRoutes)) {
        for (const [statusCode, response] of Object.entries((def as IRouteSchema).response)) {
          if (`${statusCode}`.startsWith("4") || `${statusCode}`.startsWith("5")) {
            if (response === ZResError) {
              continue;
            }
            // @ts-expect-error
            assert.equal(response._def.typeName, "ZodUnion", `${method} ${path}: doesn't satisfies ZResError`);
            assert.equal(
              // @ts-expect-error
              response._def.options.includes(ZResError),
              true,
              `${method} ${path}: doesn't satisfies ZResError`
            );
          }
        }
      }
    }
  });

  it("should method & path be defined correctly", () => {
    for (const [method, zMethodRoutes] of Object.entries(zRoutes)) {
      for (const [path, def] of Object.entries(zMethodRoutes)) {
        assert.equal(def.method, method, `${method} ${path}: have invalid method`);
        assert.equal(def.path, path, `${method} ${path}: have invalid path`);
      }
    }
  });

  it("should access ressources be defined correctly", () => {
    for (const [method, zMethodRoutes] of Object.entries(zRoutes as IRoutesDef)) {
      for (const [path, def] of Object.entries(zMethodRoutes)) {
        const typedDef = def as IRouteSchemaWrite | IRouteSchemaGet;
        if (typedDef.securityScheme) {
          for (const [resourceType, resourceAccesses] of Object.entries(typedDef.securityScheme.ressources)) {
            for (const resourceAccess of resourceAccesses) {
              for (const [, access] of Object.entries(resourceAccess)) {
                const zodInputShape = access.type === "params" ? typedDef.params : typedDef.querystring;
                assert.notEqual(
                  zodInputShape?._zod.def.shape?.[access.key],
                  undefined,
                  `${method} ${path} ${resourceType}.${access.type}.${access.key}: does not exists`
                );
              }
            }
          }
        }
      }
    }
  });
});
