import Boom from "@hapi/boom";
import { zRoutes } from "shared";

import { IBrevoWebhookEvent } from "../../../common/services/brevo/brevo";
import config from "../../../config";
import { processHardbounce } from "../../actions/tdb.actions";
import { Server } from "../server";

export const brevoWebhookRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/brevo/hardbounce",
    {
      schema: zRoutes.post["/v1/webhooks/brevo/hardbounce"],
    },
    async (request) => {
      const { apiKey } = request.query;

      if (config.brevo.webhookApiKey !== apiKey) {
        throw Boom.forbidden("Invalid API key");
      }

      await processHardbounce(request.body as IBrevoWebhookEvent);
    }
  );
};
