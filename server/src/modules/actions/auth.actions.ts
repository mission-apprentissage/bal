import type { IUser } from "shared/models/user.model";
import type { IAccessToken } from "../../security/accessTokenService";
import { hashPassword, verifyPassword } from "../server/utils/password.utils";
import { getDbCollection } from "../../common/utils/mongodbUtils";
import { updateUser } from "./users.actions";
import { createResetPasswordToken } from "@/common/utils/jwtUtils";
import { sendEmail } from "@/common/services/mailer/mailer";
import logger from "@/common/logger";

export const verifyEmailPassword = async (email: string, password: string): Promise<IUser | undefined> => {
  const user = await getDbCollection("users").findOne({ email });

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
  const user = await getDbCollection("users").findOne({ email });

  if (!user) {
    logger.warn({ email }, "forgot-password: missing user");
    return;
  }

  const token = createResetPasswordToken(user);

  await sendEmail({
    name: "reset_password",
    to: email,
    resetPasswordToken: token,
  });
};

export const resetPassword = async (token: IAccessToken, password: string) => {
  const hashedPassword = hashPassword(password);

  await updateUser(token.identity.email, { password: hashedPassword });
};
