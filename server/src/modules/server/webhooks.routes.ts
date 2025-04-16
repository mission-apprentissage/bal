import { Server } from "./server";
import { brevoWebhookRoutes } from "./webhooks/brevo.routes";

export const webhookRoutes = ({ server }: { server: Server }) => {
  /**
   * Génerer une clé API
   */
  server.register(
    async (instance: Server) => {
      brevoWebhookRoutes({ server: instance });
    },
    { prefix: "/v1/webhooks" }
  );
};
