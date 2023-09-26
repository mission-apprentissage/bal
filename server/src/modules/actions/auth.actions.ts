import jwt from "jsonwebtoken";

import logger from "@/common/logger";
import { sendEmail } from "@/common/services/mailer/mailer";
import { createResetPasswordToken } from "@/common/utils/jwtUtils";
import config from "@/config";

import { hashPassword, verifyPassword } from "../server/utils/password.utils";
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

  const token = createResetPasswordToken(user.email);

  await sendEmail("reset_password", {
    recipient: {
      email: user.email,
    },
    resetPasswordToken: token,
  });
};

export const resetPassword = async (password: string, token: string) => {
  const decoded = jwt.verify(token, config.auth.resetPasswordToken.jwtSecret);

  if (!decoded || !decoded.sub) {
    throw new Error("Invalid token");
  }

  const user = await findUser({ email: decoded.sub });

  if (!user) {
    throw new Error("Invalid token");
  }

  const hashedPassword = hashPassword(password);

  await updateUser(user, { password: hashedPassword });
};
