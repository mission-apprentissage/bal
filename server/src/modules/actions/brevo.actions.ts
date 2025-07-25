import { captureException } from "@sentry/node";

import type { IBrevoWebhookEvent } from "../../common/services/brevo/brevo";

export const processHardbounce = async (payload: IBrevoWebhookEvent) => {
  // Log the hard bounce event
  captureException(payload);

  // Here you can add additional logic to handle the hard bounce event
};
