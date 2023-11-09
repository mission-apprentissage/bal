import { internal } from "@hapi/boom";
import { captureException } from "@sentry/node";
import { omit } from "lodash-es";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { TemplateName, TemplatePayloads, TemplateTitleFuncs } from "shared/mailer";
import { IEvent } from "shared/models/events/event.model";
import { v4 as uuidv4 } from "uuid";

import config from "@/config";

import { addEmail, addEmailError, addEmailMessageId } from "../../../modules/actions/emails.actions";
import logger from "../../logger";
import { generateHtml, getPublicUrl } from "../../utils/emailsUtils";
import { getStaticFilePath } from "../../utils/getStaticFilePath";
import { getDbCollection } from "../../utils/mongodbUtils";

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

async function sendEmailMessage(
  to: string,
  template: { subject: string; templateFile: string; data: { token: string } }
) {
  const { subject, data } = template;

  if (!transporter) {
    throw internal("mailer is not initialised");
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

// version intermédiaire qui prend le template en paramètre (constuit et vérifié au préalable avec TS)
export async function sendStoredEmail<T extends TemplateName>(
  person_id: string,
  templateName: T,
  payload: TemplatePayloads[T],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: any
): Promise<void> {
  const emailToken = uuidv4();
  try {
    template.data.token = emailToken;
    await addEmail(person_id, emailToken, templateName, payload);
    const messageId = await sendEmailMessage(payload.recipient.email, template);
    await addEmailMessageId(emailToken, messageId);
  } catch (err) {
    captureException(err);
    logger.error({ err, template: templateName }, "error sending email");
    await addEmailError(emailToken, err);
  }
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

export async function renderEmail(token: string) {
  const event = await getDbCollection("events").findOne<IEvent>({
    "payload.emails.token": token,
    name: "bal_emails",
  });
  if (!event) {
    return;
  }
  const email = event.payload.emails.find((e) => e.token === token);
  if (!email) {
    return;
  }
  const { templateName, payload } = email;
  return generateHtml(
    payload.recipient.email,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEmailInfos(templateName as TemplateName, payload as any)
  );
}
