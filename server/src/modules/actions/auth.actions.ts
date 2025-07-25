import type { IAccessToken } from "../../security/accessTokenService";
import { hashPassword, verifyPassword } from "../server/utils/password.utils";
import { findPerson } from "./persons.actions";
import { findUser, updateUser } from "./users.actions";
import { createResetPasswordToken } from "@/common/utils/jwtUtils";
import { sendEmail } from "@/common/services/mailer/mailer";
import logger from "@/common/logger";

export const verifyEmailPassword = async (email: string, password: string) => {
  const user = await findUser({ email });

  if (!user) {
    return;
  }

  const match = verifyPassword(password, user.password);

  if (!match) {
    return;
  }

  return user;
};

export const sendResetPasswordEmail = async (email: string) => {
  const user = await findUser({ email });

  if (!user) {
    logger.warn({ email }, "forgot-password: missing user");
    return;
  }

  const person = await findPerson({ email });

  if (!person) {
    logger.warn({ email }, "forgot-password: missing Person");
    return;
  }

  const token = createResetPasswordToken(user);

  await sendEmail(person._id.toString(), {
    name: "reset_password",
    to: email,
    civility: person.civility,
    prenom: person.prenom,
    nom: person.nom,
    resetPasswordToken: token,
  });
};

export const resetPassword = async (token: IAccessToken, password: string) => {
  const hashedPassword = hashPassword(password);

  await updateUser(token.identity.email, { password: hashedPassword });
};
