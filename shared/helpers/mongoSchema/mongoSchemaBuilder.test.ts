import { describe, expect, it } from "vitest";
import { zodToMongoSchema } from "zod-mongodb-schema";

import { modelDescriptors } from "../../models/models";

describe("zodToMongoSchema", () => {
  modelDescriptors.forEach((descriptor) => {
    it(`should convert ${descriptor.collectionName} schema`, () => {
      expect(zodToMongoSchema(descriptor.zod)).toMatchSnapshot();
    });
  });
});
