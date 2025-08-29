import { zProcessorStatus } from "job-processor/dist/core.js";
import type { IRoutesDef } from "../common.routes";

export const zProcessorAdminRoutes = {
  get: {
    "/admin/processor": {
      method: "get",
      path: "/admin/processor",
      response: { "200": zProcessorStatus },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
  post: {},
} as const satisfies IRoutesDef;
