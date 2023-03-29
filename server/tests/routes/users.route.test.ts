import assert from "node:assert";

import { createUser, findUser } from "../../src/modules/actions/users.actions";
import { build } from "../../src/modules/server";

const app = build();

describe("Users routes", () => {
  it("should get the current user", async () => {
    const user = await createUser({ email: "connected@exemple.fr" });

    const response = await app.inject({
      method: "GET",
      url: "/api/user",
      headers: {
        ["access-token"]: user?.token,
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, "connected@exemple.fr");
    assert.ok(response.json().token);
  });

  it("should create a user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: { email: "email@exemple.fr" },
    });

    const user = await findUser({
      email: "email@exemple.fr",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, "email@exemple.fr");
    assert.ok(response.json().token);
  });
});
