import assert from "node:assert";

import { ObjectId } from "mongodb";
import { describe, it } from "vitest";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import {
  getDecaVerification,
  parseContentLine,
} from "../../src/modules/actions/deca.actions";
import { createDocumentContent } from "../../src/modules/actions/documentContent.actions";
import { useMongo } from "../utils/mongo.utils";

describe("DECA file", () => {
  it("should parse correct line", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,email2@test.dev}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev", "email2@test.dev"],
      }
    );
  });
  it("should remove incorrect emails", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );

    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,NULL}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,not-email1@test.}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{}",
      }),
      undefined
    );
  });
  it("should remove duplicate emails", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,email2@test.dev,email1@test.dev}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev", "email2@test.dev"],
      }
    );
  });

  it("should not parse line with incorrect siret", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "notsiret",
        EMAIL: "{email1@test.dev}",
      }),
      undefined
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "(6 rows);;",
        EMAIL: "{email1@test.dev}",
      }),
      undefined
    );
  });
});

describe("DECA verification", () => {
  useMongo();

  it("should be valid SIRET email", async () => {
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@company.com", "test2@company.com"],
      },
    });
    assert.deepEqual(
      await getDecaVerification("12345678901234", "test1@company.com"),
      {
        is_valid: true,
        on: "email",
      }
    );

    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@gmail.com", "test2@company.com"],
      },
    });
    assert.deepEqual(
      await getDecaVerification("12345678901234", "test1@gmail.com"),
      {
        is_valid: true,
        on: "email",
      }
    );
  });

  it("should be valid SIRET domain", async () => {
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@company.com", "test2@company.com"],
      },
    });

    assert.deepEqual(
      await getDecaVerification("12345678901234", "test3@company.com"),
      {
        is_valid: true,
        on: "domain",
      }
    );
  });

  it("should be valid SIREN email", async () => {
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@company.com", "test2@company.com"],
      },
    });

    assert.deepEqual(
      await getDecaVerification("12345678999999", "test2@company.com"),
      {
        is_valid: true,
        on: "email",
      }
    );
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@gmail.com", "test2@company.com"],
      },
    });

    assert.deepEqual(
      await getDecaVerification("12345678999999", "test1@gmail.com"),
      {
        is_valid: true,
        on: "email",
      }
    );
  });

  it("should be valid SIREN domain", async () => {
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@company.com", "test2@company.com"],
      },
    });

    assert.deepEqual(
      await getDecaVerification("12345678999999", "test3@company.com"),
      {
        is_valid: true,
        on: "domain",
      }
    );
  });

  it("should not be valid SIRET domain if blacklisted", async () => {
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@gmail.com", "test2@company.com"],
      },
    });

    assert.deepEqual(
      await getDecaVerification("12345678901234", "test3@gmail.com"),
      {
        is_valid: false,
      }
    );
  });

  it("should not be valid SIREN domain if blacklisted", async () => {
    await createDocumentContent({
      document_id: new ObjectId(),
      type_document: DOCUMENT_TYPES.DECA,
      content: {
        siret: "12345678901234",
        emails: ["test1@gmail.com", "test2@company.com"],
      },
    });

    assert.deepEqual(
      await getDecaVerification("12345678999999", "test3@gmail.com"),
      {
        is_valid: false,
      }
    );
  });
});
