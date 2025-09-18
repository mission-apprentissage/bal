import assert from "node:assert";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createUserTokenSimple } from "../../src/common/utils/jwtUtils";
import { createSession, createSessionToken } from "../../src/modules/actions/sessions.actions";
import { createUser } from "../../src/modules/actions/users.actions";
import type { Server } from "../../src/modules/server/server";
import createServer from "../../src/modules/server/server";
import { useMongo } from "../utils/mongo.utils";
import { getDbCollection } from "../../src/common/utils/mongodbUtils";

describe("Users routes", () => {
  const mongo = useMongo();
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await Promise.all([app.ready(), mongo.beforeAll()]);
  }, 15_000);

  beforeEach(async () => {
    await mongo.beforeEach();
  });

  afterAll(async () => {
    await Promise.all([mongo.afterAll(), app.close()]);
  });

  it("should get the current user with authorization token", async () => {
    const user = await createUser({
      email: "connected@exemple.fr",
      password: "my-password",
    });

    const token = createSessionToken(user.email);
    await createSession({ token });

    const userWithToken = await getDbCollection("users").findOne({ _id: user._id });

    assert.equal(userWithToken?.api_key_used_at, undefined);

    const response = await app.inject({
      method: "GET",
      url: "/api/auth/session",
      headers: {
        ["Cookie"]: `bal_session=${token}`,
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, "connected@exemple.fr");
    assert.equal(response.json().password, undefined);
    assert.equal(response.json().api_key, undefined);
  });

  it("should allow admin to create a user", async () => {
    const admin = await createUser({
      email: "admin@exemple.fr",
      password: "my-password",
      is_admin: true,
    });

    const token = createUserTokenSimple({ payload: { email: admin.email } });

    await createSession({
      token,
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/user",
      payload: {
        email: "email@exemple.fr",
        password: "my-password",
      },
      headers: {
        ["Cookie"]: `bal_session=${token}`,
      },
    });

    const user = await getDbCollection("users").findOne({
      email: "email@exemple.fr",
    });

    expect.soft(response.statusCode).toBe(200);
    expect.soft(response.json()).toEqual({
      _id: user?._id.toString(),
      email: "email@exemple.fr",
      api_key_used_at: null,
      is_admin: false,
      is_support: false,
      created_at: user?.created_at.toJSON(),
      updated_at: user?.updated_at.toJSON(),
    });
  });

  it("should not allow non-admin to create a user", async () => {
    const user = await createUser({
      email: "user@exemple.fr",
      password: "my-password",
    });

    const token = createUserTokenSimple({ payload: { email: user.email } });

    await createSession({
      token,
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/user",
      payload: {
        email: "email@exemple.fr",
        password: "my-password",
      },
      headers: {
        ["Cookie"]: `bal_session=${token}`,
      },
    });

    assert.equal(response.statusCode, 403);
  });
});
