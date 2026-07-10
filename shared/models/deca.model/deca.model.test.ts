import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import { ZDeca } from "./deca.model";

describe("ZDeca", () => {
  const baseContrat = {
    _id: new ObjectId(),
    no_contrat: "123456789",
    date_debut_contrat: new Date("2023-09-01T00:00:00.000Z"),
    date_fin_contrat: new Date("2025-09-01T00:00:00.000Z"),
    date_signature_contrat: new Date("2023-08-15T00:00:00.000Z"),
    alternant: { nom: "Dupont", date_naissance: new Date("1995-05-20T00:00:00.000Z") },
    formation: {},
    employeur: {},
    updated_at: new Date(),
    created_at: new Date(),
  };

  it("should coerce a numeric code_motif_rupture to a string", () => {
    const result = ZDeca.parse({ ...baseContrat, code_motif_rupture: 1 });

    expect(result.code_motif_rupture).toBe("1");
  });

  it("should keep a string code_motif_rupture as-is", () => {
    const result = ZDeca.parse({ ...baseContrat, code_motif_rupture: "01" });

    expect(result.code_motif_rupture).toBe("01");
  });

  it("should allow code_motif_rupture to be absent", () => {
    const result = ZDeca.parse(baseContrat);

    expect(result.code_motif_rupture).toBeUndefined();
  });
});
