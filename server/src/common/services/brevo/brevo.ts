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

const enum BrevoEventStatus {
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
