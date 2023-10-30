import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { getDatabase } from "../../../../src/common/utils/mongodbUtils";
import { countInvalidDocuments, validateDocuments } from "../../../../src/modules/jobs/db/schemaValidation";
import { useMongo } from "../../../utils/mongo.utils";

const mongo = useMongo();

beforeAll(async () => {
  await mongo.beforeAll();
  await getDatabase().createCollection("shipping", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Shipping Country Validation",
        properties: {
          country: {
            enum: ["France", "United Kingdom", "United States"],
            description: "Must be either France, United Kingdom, or United States",
          },
        },
      },
    },
  });
});

beforeEach(async () => {
  await mongo.beforeEach();
});

afterAll(async () => {
  await getDatabase().dropCollection("shipping");
  await mongo.afterAll();
});

describe("countInvalidDocuments", () => {
  it("should return invalid documents count", async () => {
    await getDatabase()
      .collection("shipping")
      .insertMany(
        [
          {
            item: "sweater",
            size: "medium",
            country: "Germany", // Invalid
          },
          {
            item: "sweater",
            size: "medium",
            country: "France", // Valid
          },
          {
            item: "pants",
            size: "medium",
            country: "Japan", // Invalid
          },
        ],
        {
          bypassDocumentValidation: true,
        }
      );

    await expect(countInvalidDocuments("shipping")).resolves.toBe(2);
  });

  it("should return 0 when documents are valid", async () => {
    await getDatabase()
      .collection("shipping")
      .insertMany(
        [
          {
            item: "sweater",
            size: "medium",
            country: "United States",
          },
          {
            item: "sweater",
            size: "medium",
            country: "France",
          },
          {
            item: "pants",
            size: "medium",
            country: "United Kingdom",
          },
        ],
        {
          bypassDocumentValidation: true,
        }
      );

    await expect(countInvalidDocuments("shipping")).resolves.toBe(0);
  });
});

describe("validateDocuments", () => {
  it("should reject when at least one document is invalid", async () => {
    await getDatabase()
      .collection("shipping")
      .insertMany(
        [
          {
            item: "sweater",
            size: "medium",
            country: "Germany", // Invalid
          },
          {
            item: "sweater",
            size: "medium",
            country: "France", // Valid
          },
          {
            item: "pants",
            size: "medium",
            country: "Japan", // Invalid
          },
        ],
        {
          bypassDocumentValidation: true,
        }
      );

    await expect(validateDocuments("shipping")).rejects.toThrowError(
      "Collection shipping contains 2 invalid documents"
    );
  });

  it("should resolves when all documents are valid", async () => {
    await getDatabase()
      .collection("shipping")
      .insertMany(
        [
          {
            item: "sweater",
            size: "medium",
            country: "United States",
          },
          {
            item: "sweater",
            size: "medium",
            country: "France",
          },
          {
            item: "pants",
            size: "medium",
            country: "United Kingdom",
          },
        ],
        {
          bypassDocumentValidation: true,
        }
      );

    await expect(validateDocuments("shipping")).resolves.toBeUndefined();
  });
});
