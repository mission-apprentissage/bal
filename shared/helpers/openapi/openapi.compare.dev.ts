import { dereference } from "@readme/openapi-parser";
import type { OpenapiOperation } from "api-alternance-sdk/internal";
import { compareOperationObjectsStructure, getOpenapiOperations } from "api-alternance-sdk/internal";
import type { OpenAPIObject } from "openapi3-ts/oas31";
import { buildOpenApiSchema } from "./openapi.builder";

async function dereferenceOpenapiSchema(data: OpenAPIObject): Promise<OpenAPIObject> {
  if (data.openapi !== "3.1.0") {
    throw new Error("Unsupported OpenAPI version");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await dereference(data as any)) as any;
}
async function fetchDistOperations(): Promise<Record<string, OpenapiOperation>> {
  const response = await fetch("https://bal.apprentissage.beta.gouv.fr/api/documentation/json");
  const data = await response.json();

  const doc = await dereferenceOpenapiSchema(data as OpenAPIObject);

  if (doc.openapi !== "3.1.0") {
    throw new Error("Unsupported OpenAPI version");
  }

  return getOpenapiOperations(doc.paths);
}

async function buildLocalOpenapiPathItems(): Promise<Record<string, OpenapiOperation>> {
  const data = buildOpenApiSchema("", "", "");

  const doc = await dereferenceOpenapiSchema(data);

  if (doc.openapi !== "3.1.0") {
    throw new Error("Unsupported OpenAPI version");
  }

  return getOpenapiOperations(doc.paths);
}

export async function checkDocumentationSync() {
  const [distOperations, localOperations] = await Promise.all([fetchDistOperations(), buildLocalOpenapiPathItems()]);

  const errors = [];

  for (const id of Object.keys(localOperations)) {
    const localOperation = localOperations[id];
    const distOperation = distOperations[id];

    const d = compareOperationObjectsStructure(
      { name: "dist", op: distOperation?.operation },
      { name: "local", op: localOperation?.operation }
    );

    if (d !== null) {
      errors.push({
        id,
        distOperation,
        localOperation,
        diff: d,
      });
    }
  }

  for (const id of Object.keys(distOperations)) {
    if (!localOperations[id]) {
      errors.push({
        id,
        distOperation: distOperations[id],
        localOperation: null,
        diff: null,
      });
    }
  }

  return errors;
}
