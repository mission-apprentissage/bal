import { internal } from "@hapi/boom";
import { captureException } from "@sentry/node";
import ejs from "ejs";
import { omit } from "lodash-es";
import mjml from "mjml";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { ITemplate } from "shared/mailer";
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

async function sendEmailMessage(template: ITemplate, emailToken: string) {
  if (!transporter) {
    throw internal("mailer is not initialised");
  }

  const { messageId } = await transporter.sendMail({
    from: `${config.email_from} <${config.email}>`,
    to: template.recipient.email,
    subject: getEmailSubject(template),
    html: await generateHtml(template, emailToken),
    list: {
      help: "https://mission-apprentissage.gitbook.io/general/les-services-en-devenir/accompagner-les-futurs-apprentis", // TODO [metier/tech]
      unsubscribe: getPublicUrl(`/api/emails/${emailToken}/unsubscribe`),
    },
  });

  return messageId;
}

export async function sendEmail(person_id: string, template: ITemplate): Promise<void> {
  const emailToken = uuidv4();
  try {
    await addEmail(person_id, emailToken, template);
    const messageId = await sendEmailMessage(template, emailToken);
    await addEmailMessageId(emailToken, messageId);
  } catch (err) {
    captureException(err);
    logger.error({ err, template: template.name }, "error sending email");
    await addEmailError(emailToken, err);
  }
}

function assertUnreachable(_x: never): never {
  throw internal("Didn't expect to get here");
}

export function getEmailSubject(template: ITemplate): string {
  switch (template.name) {
    case "reset_password":
      return "Réinitialisation du mot de passe";
    default:
      assertUnreachable(template.name);
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
  const { payload } = email;
  return generateHtml(payload as ITemplate, token);
}

export async function generateHtml(template: ITemplate, emailToken: string) {
  const subject = getEmailSubject(template);
  const templateFile = getStaticFilePath(`./emails/${template.name}.mjml.ejs`);
  const buffer = await ejs.renderFile(templateFile, {
    to: template.recipient.email,
    subject,
    data: {
      template,
      actions: {
        unsubscribe: getPublicUrl(`/api/emails/${emailToken}/unsubscribe`),
        preview: getPublicUrl(`/api/emails/${emailToken}/preview`),
        markAsOpened: getPublicUrl(`/api/emails/${emailToken}/markAsOpened`),
      },
    },
    utils: { getPublicUrl },
  });

  const { html } = mjml(buffer.toString(), { minify: true });
  return html;
}
