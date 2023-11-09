import { internal } from "@hapi/boom";
import { captureException } from "@sentry/node";
import ejs from "ejs";
import { omit } from "lodash-es";
import mjml from "mjml";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { TemplateName, TemplatePayloads } from "shared/mailer";
import { IEvent } from "shared/models/events/event.model";
import { v4 as uuidv4 } from "uuid";

import config from "@/config";

import { addEmail, addEmailError, addEmailMessageId } from "../../../modules/actions/emails.actions";
import logger from "../../logger";
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

async function sendEmailMessage<T extends TemplateName>(
  to: string,
  templateName: T,
  data: TemplatePayloads[T],
  emailToken: string
) {
  if (!transporter) {
    throw internal("mailer is not initialised");
  }

  const { messageId } = await transporter.sendMail({
    from: `${config.email_from} <${config.email}>`,
    to,
    subject: getEmailSubject(templateName),
    html: await generateHtml(to, templateName, { ...data, token: emailToken }),
    list: {
      help: "https://mission-apprentissage.gitbook.io/general/les-services-en-devenir/accompagner-les-futurs-apprentis", // TODO [metier/tech]
      unsubscribe: getPublicUrl(`/api/emails/${emailToken}/unsubscribe`),
    },
  });

  return messageId;
}

export async function sendEmail<T extends TemplateName>(
  person_id: string,
  templateName: T,
  payload: TemplatePayloads[T]
): Promise<void> {
  const emailToken = uuidv4();
  try {
    await addEmail(person_id, emailToken, templateName, payload);
    const messageId = await sendEmailMessage(payload.recipient.email, templateName, payload, emailToken);
    await addEmailMessageId(emailToken, messageId);
  } catch (err) {
    captureException(err);
    logger.error({ err, template: templateName }, "error sending email");
    await addEmailError(emailToken, err);
  }
}

function assertUnreachable(_x: never): never {
  throw internal("Didn't expect to get here");
}

export function getEmailSubject<T extends TemplateName>(name: T): string {
  switch (name) {
    case "reset_password":
      return "Réinitialisation du mot de passe";
    default:
      // @ts-expect-error
      assertUnreachable(name);
  }
}

export function getPublicUrl(path: string) {
  return `${config.publicUrl}${path}`;
}

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
  return generateHtml(payload.recipient.email, templateName as TemplateName, payload);
}

export async function generateHtml<T extends TemplateName>(to: string, templateName: T, data: unknown) {
  const subject = getEmailSubject(templateName);
  const templateFile = getStaticFilePath(`./emails/${templateName}.mjml.ejs`);
  const buffer = await ejs.renderFile(templateFile, {
    to,
    subject,
    data,
    utils: { getPublicUrl },
  });

  const { html } = mjml(buffer.toString(), { minify: true });
  return html;
}
