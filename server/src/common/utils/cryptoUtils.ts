import crypto from "crypto";
import { internal } from "@hapi/boom";
import checksumStream from "checksum-stream";

import config from "@/config";

const KEY = config.ovhStorage.encryptionKey;

export function isCipherAvailable() {
  return !!KEY;
}

export function cipher(iv: string) {
  if (!KEY || !iv) {
    throw new Error("Impossible chiffrer la donnée");
  }

  //See https://crypto.stackexchange.com/a/3970/60417 for more informations about vector
  return crypto.createCipheriv("aes-256-cbc", KEY, iv.slice(0, 16));
}

export function decipher(iv: string) {
  return crypto.createDecipheriv("aes-256-cbc", KEY, iv.slice(0, 16));
}

export function checksum() {
  const stream = checksumStream({
    algorithm: "md5",
  });

  const promise: Promise<string> = new Promise((resolve, reject) => {
    stream.on("digest", resolve);
    stream.on("error", reject);
  });

  return {
    hashStream: stream,
    getHash: async () => promise,
  };
}

export function generateKey(size = 32, format: BufferEncoding = "base64") {
  const buffer = crypto.randomBytes(size);
  return buffer.toString(format);
}

export function generateSecretHash(key: string) {
  const salt = crypto.randomBytes(8).toString("hex");
  const buffer = crypto.scryptSync(key, salt, 64);
  return `${buffer.toString("hex")}.${salt}`;
}

export function compareKeys(storedKey: string, suppliedKey: string) {
  const [hashedPassword, salt] = storedKey.split(".");

  if (!hashedPassword || !salt) {
    throw internal("compareKeys: invalid storedKey");
  }

  const buffer = crypto.scryptSync(suppliedKey, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hashedPassword, "hex"), buffer);
}

// USAGE
// const key = generateKey(); // send to user: Jj0fmQUis7xKJ6oge4r1fN4em7xJ+hILrgubKlG6PLA=
// const secretHash = generateSecretHash(key); // save in db: c10c7e79fc496144ee245d9dcbe52d9d3910c2a514af1cfe8afda9ea655815efed5bd2a793b31bf923fe47d212bab7896cd527c720849678077e34cdd6fec0a2.2f717b397644fdcc
// VERIF => compareKeys(secretHash, key)
