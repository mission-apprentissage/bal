import { verify } from "jsonwebtoken";

import { config } from "../../../config/config";
import { createResetPasswordToken } from "../../utils/jwtUtils";
import logger from "../../utils/logger";
import { hashPassword, verifyPassword } from "../server/utils/password.utils";
import { sendEmail } from "../services/mailer/mailer";
import { findPerson } from "./persons.actions";
import { findUser, updateUser } from "./users.actions";

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

  const token = createResetPasswordToken(user.email);

  await sendEmail(user.email, "reset_password", {
    recipient: {
      civility: person.civility,
      prenom: person.prenom,
      nom: person.nom,
      email: user.email,
    },
    resetPasswordToken: token,
  });
};

export const resetPassword = async (password: string, token: string) => {
  const decoded = verify(token, config.auth.resetPasswordToken.jwtSecret);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  const user = await findUser({ email: decoded.sub });

  if (!user) {
    throw new Error("Invalid token");
  }

  const hashedPassword = hashPassword(password);

  await updateUser(user, { password: hashedPassword });
};
