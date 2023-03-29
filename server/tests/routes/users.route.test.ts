import assert from "node:assert";

import { IUser } from "shared/models/user.model";

import build from "../../src/app";
import { getDbCollection } from "../../src/db/mongodb";

const app = build();

describe("Users routes", () => {
  it("creates a user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: { email: "email@exemple.fr" },
    });

    const user = await getDbCollection("users").findOne<IUser>({
      email: "email@exemple.fr",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, "email@exemple.fr");
    assert.notEqual(response.json().token, null);
  });
});
