import brevo, { ContactsApiApiKeys } from "@getbrevo/brevo";
import Boom from "@hapi/boom";
import { captureException } from "@sentry/node";

import config from "@/config";

export type IBrevoWebhookEvent = {
  event: BrevoEventStatus;
  email: string;
  id: number;
  date: string;
  "message-id": string;
  reason: string | undefined;
  subject: string | undefined;
  tag: string;
  sending_ip: string;
  ts_epoch: number;
  template_id: number;
};

export const enum BrevoEventStatus {
  HARD_BOUNCE = "hard_bounce",
  HARDBOUNCE_WEBHOOK_INIT = "hardBounce",
  BLOCKED = "blocked",
  SPAM = "spam",
  UNSUBSCRIBED = "unsubscribed",
  DELIVRE = "delivered",
  ENVOYE = "requete",
  UNIQUE_OPENED = "unique_opened",
  CLIQUE = "click",
}

const initContactApi = () => {
  const apiInstance = new brevo.ContactsApi();

  const apiKey = config.brevo.apiKey;

  if (!apiKey) {
    throw Boom.internal("Brevo API key not set");
  }

  apiInstance.setApiKey(ContactsApiApiKeys.apiKey, apiKey);
  return apiInstance;
};

const ContactInstance: brevo.ContactsApi | null = initContactApi();

export const importContacts = async (
  listeId: number,
  contacts: Array<{
    email: string;
    prenom: string;
    nom: string;
    urls?: Record<string, string> | null;
    telephone?: string | null;
    nom_organisme?: string | null;
    mission_locale_id: string;
  }>
) => {
  if (!ContactInstance) {
    throw Boom.internal("Brevo instance not initialized");
  }

  const contactImport = new brevo.RequestContactImport();
  contactImport.listIds = [listeId];

  const contactList = contacts.map((contact) => {
    const contactData = new brevo.RequestContactImportJsonBodyInner();
    contactData.email = contact.email;
    contactData.attributes = {
      PRENOM: contact.prenom,
      NOM: contact.nom,
      ...contact.urls,
      TELEPHONE: contact.telephone,
      NOM_ORGANISME: contact.nom_organisme,
      MISSION_LOCALE_ID: contact.mission_locale_id,
    };
    return contactData;
  });
  contactImport.jsonBody = contactList;

  try {
    return await ContactInstance.importContacts(contactImport);
  } catch (e) {
    captureException(new Error(`Brevo importContacts error: ${e}`));
    return;
  }
};
