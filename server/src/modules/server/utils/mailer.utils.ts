import nodemailer from "nodemailer";

import config from "@/config";

export const getMailer = () => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: config.smtp.host,
    secure: config.smtp.secure,
    port: config.smtp.port,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
  });

  return transporter;
};
