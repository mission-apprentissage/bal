import { describe, expect, it } from "vitest";

import { buildOpenApiSchema } from "./openapi.builder";
import { checkDocumentationSync } from "./openapi.compare.dev";

describe("generateOpenApiSchema", () => {
  it("should generate proper schema", async () => {
    const s = buildOpenApiSchema("V1.0", "Production", "https://bal.apprentissage.beta.gouv.fr");
    expect(s).toMatchSnapshot();
  });

  it.skip("should be backward compatible", async () => {
    const errors = await checkDocumentationSync();
    console.log(errors);
    expect(errors).toHaveLength(0);
  });
});
