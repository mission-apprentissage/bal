import { omit } from "lodash-es";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import path from "path";
import {
  TemplateName,
  TemplatePayloads,
  TemplateTitleFuncs,
} from "shared/mailer";

import { config } from "../../../../config/config";
import { generateHtml, getPublicUrl } from "../../../utils/emailsUtils";
import { __dirname } from "../../../utils/esmUtils";
import { sendStoredEmail } from "../../actions/emails.actions";

function createTransporter(smtp: SMTPTransport) {
  const needsAuthentication = !!smtp.auth.user;
  const transporter = nodemailer.createTransport(
    needsAuthentication ? smtp : omit(smtp, ["auth"])
  );
  transporter.use("compile", htmlToText());
  return transporter;
}

export function createMailerService(
  // @ts-ignore
  transporter = createTransporter({ ...config.smtp, secure: false })
) {
  async function sendEmailMessage(
    to: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    template: { subject: string; templateFile: string; data: any }
  ) {
    const { subject, data } = template;

    const { messageId } = (await transporter.sendMail({
      from: `${config.email_from} <${config.email}>`,
      to,
      subject,
      html: await generateHtml(to, template),
      list: {
        help: "https://mission-apprentissage.gitbook.io/general/les-services-en-devenir/accompagner-les-futurs-apprentis", // TODO [metier/tech]
        unsubscribe: getPublicUrl(`/api/emails/${data.token}/unsubscribe`),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    return messageId;
  }

  return {
    sendEmailMessage,
  };
}

export async function sendEmail<T extends TemplateName>(
  recipient: string,
  template: T,
  payload: TemplatePayloads[T]
): Promise<void> {
  // identifiant email car stocké en BDD et possibilité de le consulter via navigateur
  await sendStoredEmail(recipient, template, payload, {
    subject: templatesTitleFuncs[template](payload),
    templateFile: path.join(
      // @ts-ignore
      __dirname(import.meta.url),
      `../src/modules/services/mailer/emails/${template}.mjml.ejs`
    ),
    data: payload,
  });
}

export function getEmailInfos<T extends TemplateName>(
  template: T,
  payload: TemplatePayloads[T]
) {
  return {
    subject: templatesTitleFuncs[template](payload),
    templateFile: path.join(
      // @ts-ignore
      __dirname(import.meta.url),
      `../src/modules/services/mailer/emails/${template}.mjml.ejs`
    ),
    data: payload,
  };
}

const templatesTitleFuncs: TemplateTitleFuncs = {
  reset_password: () => "Réinitialisation du mot de passe",
};
