import crypto from "crypto";

import { config } from "../../../../config/config";

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const hashPassword = (
  password: crypto.BinaryLike,
  salt?: crypto.BinaryLike
) => {
  const iterations = config.auth.hashRounds;
  const keylen = 64;
  const digest = "sha512";

  if (!salt) {
    salt = generateSalt();
  }

  const hashedPassword = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keylen,
    digest
  );

  return `${hashedPassword.toString("hex")}$${iterations}$${salt}`;
};

export const verifyPassword = (
  password: crypto.BinaryLike,
  storedHash: string
) => {
  const [hashedStoredPassword, _iterations, salt] = storedHash.split("$");

  const hashedPasswordWithSalt = hashPassword(password, salt);
  const [hashedPassword] = hashedPasswordWithSalt.split("$");

  return crypto.timingSafeEqual(
    Buffer.from(hashedPassword),
    Buffer.from(hashedStoredPassword)
  );
};
