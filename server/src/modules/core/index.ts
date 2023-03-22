import { Server } from "../../server";
import { coreRoutes } from "./routes/core.routes";
import { userRoutes } from "./routes/user.routes";

export const registerCoreModule = ({ server }: { server: Server }) => {
  coreRoutes({ server });
  userRoutes({ server });
};
