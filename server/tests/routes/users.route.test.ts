import assert from "node:assert";

import { IUser } from "shared/models/user.model";

import {
  createUser,
  findUser,
  generateApiKey,
} from "../../src/modules/actions/users.actions";
import { build } from "../../src/modules/server";

const app = build();

describe("Users routes", () => {
  it("should get the current user with authorization token", async () => {
    const user = (await createUser({
      email: "connected@exemple.fr",
      password: "my-password",
    })) as IUser;

    const token = await generateApiKey(user);

    const userWithToken = await findUser({ _id: user._id });

    assert.equal(userWithToken?.api_key_used_at, undefined);

    const response = await app.inject({
      method: "GET",
      url: "/api/auth/session",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, "connected@exemple.fr");
    assert.equal(response.json().password, undefined);
    assert.equal(response.json().api_key, undefined);
    assert.ok(response.json().api_key_used_at);
  });

  it("should create a user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/admin/user",
      payload: { email: "email@exemple.fr", password: "my-password" },
    });

    const user = await findUser({
      email: "email@exemple.fr",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, "email@exemple.fr");
    assert.equal(response.json().password, undefined);
  });
});
