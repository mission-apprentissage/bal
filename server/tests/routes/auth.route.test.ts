import assert from "node:assert";

import { config } from "../../config/config";
import { getSession } from "../../src/modules/actions/sessions.actions";
import { createUser, findUser } from "../../src/modules/actions/users.actions";
import { build } from "../../src/modules/server";
import { verifyPassword } from "../../src/modules/server/utils/password.utils";
import { createResetPasswordToken } from "../../src/utils/jwtUtils";
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

  it("should identify user and create session in db after signing in", async () => {
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
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === config.session.cookieName
    ) as Cookie;

    const session = await getSession({ token: sessionCookie.value });
    assert.equal(session?.token, sessionCookie.value);

    const response = await app.inject({
      method: "GET",
      url: "/api/auth/session",
      cookies: {
        [sessionCookie.name]: sessionCookie.value,
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json()._id, user?._id);
    assert.equal(response.json().email, user?.email);
    assert.ok(response.json().password);
    assert.ok(response.json().token);
  });

  it("should not identify user using session and delete in database after signing out", async () => {
    const user = await createUser({
      email: "email@example.fr",
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

    let cookies = responseLogin.cookies as Cookie[];
    let sessionCookie = cookies.find(
      (cookie) => cookie.name === config.session.cookieName
    ) as Cookie;

    const responseLogout = await app.inject({
      method: "GET",
      url: "/api/auth/logout",
      cookies: {
        [sessionCookie.name]: sessionCookie.value,
      },
    });

    cookies = responseLogout.cookies as Cookie[];
    sessionCookie = cookies.find(
      (cookie) => cookie.name === config.session.cookieName
    ) as Cookie;

    assert.equal(responseLogout.statusCode, 200);
    assert.equal(sessionCookie.value, "");

    const session = await getSession({ token: sessionCookie.value });
    assert.equal(session, null);

    const response = await app.inject({
      method: "GET",
      url: "/api/auth/session",
      cookies: {
        [sessionCookie.name]: sessionCookie?.value as string,
      },
    });

    assert.equal(response.statusCode, 401);
  });

  it("should send reset password email", async () => {
    const user = await createUser({
      email: "email@exemple.fr",
      password: "my-password",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/auth/reset-password",
      query: {
        email: user?.email as string,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  it("should reset user password", async () => {
    const user = await createUser({
      email: "email@exemple.fr",
      password: "my-password",
    });

    const token = createResetPasswordToken(user?.email as string);
    const newPassword = "new-password";
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: {
        password: newPassword,
        token,
      },
    });

    assert.equal(response.statusCode, 200);

    const updatedPasswordUser = await findUser({ _id: user?._id });

    const match = verifyPassword(
      newPassword,
      updatedPasswordUser?.password as string
    );

    assert.notEqual(updatedPasswordUser?.password, user?.password);
    assert.equal(match, true);
  });
});
