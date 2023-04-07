import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";

import { config } from "../../../config/config";
import { createResetPasswordToken } from "../../utils/jwtUtils";
import { findUser, updateUser } from "./users.actions";

export const verifyEmailPassword = async (email: string, password: string) => {
  const user = await findUser({ email });

  if (!user) {
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return;
  }

  return user;
};

export const sendResetPasswordEmail = async (email: string) => {
  const user = await findUser({ email });

  if (!user) {
    return;
  }

  const token = createResetPasswordToken(user.email);

  // TODO: use a template
  //   await getMailer().sendMail({
  //     to: email,
  //     subject: "Réinitialisation de votre mot de passe",
  //     text: "Réinitialisation de votre mot de passe",
  //     html: `<a href="/modifier-mot-de-passe?token=${token}">Réinitialise</a>`,
  //   });

  return token;
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

  const hashedPassword = await bcrypt.hash(password, config.auth.hashRounds);

  await updateUser(user, { password: hashedPassword });
};
