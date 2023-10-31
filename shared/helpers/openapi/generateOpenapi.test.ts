import { describe, expect, it } from "vitest";

import { generateOpenApiSchema } from "./generateOpenapi";

describe("generateOpenApiSchema", () => {
  it("should generate proper schema", async () => {
    const s = generateOpenApiSchema("V1.0", "Production", "https://bal.apprentissage.beta.gouv.fr");
    expect(s).toMatchSnapshot();
  });
});
