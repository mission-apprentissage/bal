import { omit } from "lodash-es";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { TemplateName, TemplatePayloads, TemplateTitleFuncs } from "shared/mailer";

import config from "@/config";
import { mailer } from "@/services";

import { generateHtml } from "../../utils/emailsUtils";
import { getStaticFilePath } from "../../utils/getStaticFilePath";

function createTransporter(smtp: SMTPTransport) {
  const needsAuthentication = !!smtp.auth.user;
  const transporter = nodemailer.createTransport(needsAuthentication ? smtp : omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText());
  return transporter;
}

export function createMailerService(
  // @ts-ignore
  transporter = createTransporter({ ...config.smtp, secure: false })
) {
  async function sendEmailMessage(to: string, template: { subject: string; templateFile: string; data: unknown }) {
    const { subject } = template;

    const { messageId } = await transporter.sendMail({
      from: `${config.email_from} <${config.email}>`,
      to,
      subject,
      html: await generateHtml(to, template),
      list: {
        help: "https://mission-apprentissage.gitbook.io/general/les-services-en-devenir/accompagner-les-futurs-apprentis", // TODO [metier/tech]
      },
    });

    return messageId;
  }

  return {
    sendEmailMessage,
  };
}

export async function sendEmail<T extends TemplateName>(template: T, payload: TemplatePayloads[T]): Promise<void> {
  await mailer.sendEmailMessage(payload.recipient.email, {
    subject: templatesTitleFuncs[template](payload),
    templateFile: getStaticFilePath(`./emails/${template}.mjml.ejs`),
    data: payload,
  });
}

export function getEmailInfos<T extends TemplateName>(template: T, payload: TemplatePayloads[T]) {
  return {
    subject: templatesTitleFuncs[template](payload),
    templateFile: getStaticFilePath(`./emails/${template}.mjml.ejs`),
    data: payload,
  };
}

const templatesTitleFuncs: TemplateTitleFuncs = {
  reset_password: () => "Réinitialisation du mot de passe",
};
