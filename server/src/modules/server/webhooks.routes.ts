import type { Server } from "./server";
import { brevoWebhookRoutes } from "./webhooks/brevo.routes";

export const webhookRoutes = ({ server }: { server: Server }) => {
  server.register(async (instance: Server) => {
    brevoWebhookRoutes({ server: instance });
  });
};
