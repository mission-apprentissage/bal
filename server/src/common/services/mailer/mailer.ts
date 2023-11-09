import { internal } from "@hapi/boom";
import { omit } from "lodash-es";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { TemplateName, TemplatePayloads, TemplateTitleFuncs } from "shared/mailer";

import config from "@/config";

import { sendStoredEmail } from "../../../modules/actions/emails.actions";
import { generateHtml, getPublicUrl } from "../../utils/emailsUtils";
import { getStaticFilePath } from "../../utils/getStaticFilePath";

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

export function closeMailer() {
  transporter?.close?.();
  transporter = null;
}

export function initMailer() {
  const settings = { ...config.smtp, secure: false };
  const needsAuthentication = !!settings.auth.user;
  // @ts-expect-error
  transporter = nodemailer.createTransport(needsAuthentication ? settings : omit(settings, ["auth"]));
  transporter.use("compile", htmlToText());
}

export async function sendEmailMessage(
  to: string,
  template: { subject: string; templateFile: string; data: { token: string } }
) {
  const { subject, data } = template;

  if (!transporter) {
    throw internal("mailer not initialized");
  }

  const { messageId } = await transporter.sendMail({
    from: `${config.email_from} <${config.email}>`,
    to,
    subject,
    html: await generateHtml(to, template),
    list: {
      help: "https://mission-apprentissage.gitbook.io/general/les-services-en-devenir/accompagner-les-futurs-apprentis", // TODO [metier/tech]
      unsubscribe: getPublicUrl(`/api/emails/${data.token}/unsubscribe`),
    },
  });

  return messageId;
}

export async function sendEmail<T extends TemplateName>(
  person_id: string,
  template: T,
  payload: TemplatePayloads[T]
): Promise<void> {
  // identifiant email car stocké en BDD et possibilité de le consulter via navigateur
  await sendStoredEmail(person_id, template, payload, {
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
