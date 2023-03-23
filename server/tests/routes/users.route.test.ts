import assert from "node:assert";

import build from "../../src/app";

describe("Users routes", () => {
  const app = build();

  it("creates a user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: { name: "name", email: "email@exemple.fr" },
    });

    assert.equal(response.statusCode, 200);
  });
});
