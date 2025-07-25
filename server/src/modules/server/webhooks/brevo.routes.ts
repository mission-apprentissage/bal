import { zRoutes } from "shared";

import type { IBrevoWebhookEvent } from "../../../common/services/brevo/brevo";
import type { Server } from "../server";
import { processHardbounce } from "../../actions/brevo.actions";

export const brevoWebhookRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/v1/webhooks/brevo/hardbounce",
    {
      schema: zRoutes.post["/v1/webhooks/brevo/hardbounce"],
      onRequest: [server.auth(zRoutes.post["/v1/webhooks/brevo/hardbounce"])],
    },
    async (request, response) => {
      await processHardbounce(request.body as IBrevoWebhookEvent);
      response.code(204).send();
    }
  );
};
