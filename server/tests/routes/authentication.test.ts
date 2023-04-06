import assert from "node:assert";

import { createUser } from "../../src/modules/actions/users.actions";
import { build } from "../../src/modules/server";
const app = build();

type Cookie = {
  name: string;
  value: string;
  path: string;
  httpOnly: boolean;
};

describe("Authentication", () => {
  it("should sign user in with valid credentials", async () => {
    const user = await createUser({
      email: "email@exemple.fr",
      password: "my-password",
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: user?.email,
        password: "my-password",
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, user?.email);
    assert.ok(response.json().password);
    assert.ok(response.json().token);
  });

  it("should not sign user in with invalid credentials", async () => {
    const user = await createUser({
      email: "email@exemple.fr",
      password: "my-password",
    });

    const responseIncorrectEmail = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "another-email@exemple.fr",
        password: "my-password",
      },
    });

    assert.equal(responseIncorrectEmail.statusCode, 401);

    const responseIncorrectPassword = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: user?.email,
        password: "incorrect-password",
      },
    });

    assert.equal(responseIncorrectPassword.statusCode, 401);
  });

  it("should identify user using session after signing in", async () => {
    const user = await createUser({
      email: "email@exemple.fr",
      password: "my-password",
    });

    const responseLogin = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: user?.email,
        password: "my-password",
      },
    });

    const cookies = responseLogin.cookies as Cookie[];

    const sessionCookie = cookies.find((cookie) => cookie.name === "session");

    const response = await app.inject({
      method: "GET",
      url: "/api/user",
      cookies: {
        session: sessionCookie?.value as string,
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, user?.email);
    assert.ok(response.json().password);
    assert.ok(response.json().token);
  });
});
