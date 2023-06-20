import assert from "node:assert";

import { IUser } from "shared/models/user.model";
import { afterAll, describe, it } from "vitest";

import {
  createUser,
  findUser,
  generateApiKey,
} from "../../src/modules/actions/users.actions";
import { build } from "../../src/modules/server/server";
import { useMongo } from "../utils/mongo.utils";

const app = build();

describe("Users routes", () => {
  useMongo();

  afterAll(async () => {
    await app.close();
  });

  it("should get the current user with authorization token", async () => {
    const user = (await createUser({
      email: "connected@exemple.fr",
      password: "my-password",
      organisation_id: "64520f65d7726475fd54b3b7",
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

  it.skip("should allow admin to create a user", async () => {
    const admin = (await createUser({
      email: "admin@exemple.fr",
      password: "my-password",
      organisation_id: "64520f65d7726475fd54b3b7",
      is_admin: true,
    })) as IUser;

    const token = await generateApiKey(admin);

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/user",
      payload: {
        email: "email@exemple.fr",
        password: "my-password",
        organisation_id: "64520f65d7726475fd54b3b7",
      },
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });

    const user = await findUser({
      email: "email@exemple.fr",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id.toString());
    assert.equal(response.json().email, "email@exemple.fr");
    assert.equal(response.json().password, undefined);
  });

  it("should not allow non-admin to create a user", async () => {
    const user = (await createUser({
      email: "user@exemple.fr",
      password: "my-password",
      organisation_id: "64520f65d7726475fd54b3b7",
    })) as IUser;

    const token = await generateApiKey(user);

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/user",
      payload: {
        email: "email@exemple.fr",
        password: "my-password",
        organisation_id: "64520f65d7726475fd54b3b7",
      },
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });

    assert.equal(response.statusCode, 401);
  });
});
