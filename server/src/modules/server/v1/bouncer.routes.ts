import { addJob } from "job-processor";
import { zRoutes } from "shared";
import type { IEmailResult } from "shared/routes/v1/bouncer.routes";

import { getDbCollection } from "../../../common/utils/mongodbUtils";
import type { Server } from "../server";

export const bouncerRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/v1/bouncer/check",
    {
      schema: zRoutes.post["/v1/bouncer/check"],
      onRequest: [server.auth(zRoutes.post["/v1/bouncer/check"])],
    },
    async (request, response) => {
      const { body } = request;

      const pingResults = await getDbCollection("bouncer.email")
        .find({ email: { $in: body.map((e) => e.email) } })
        .toArray();
      const emailStatusMap: Map<string, "valid" | "invalid" | "unknown"> = new Map(
        pingResults.map((r) => {
          if (r.ping.status === "valid" || r.ping.status === "invalid") {
            return [r.email, r.ping.status];
          }
          return [r.email, "unknown"];
        })
      );

      const result: IEmailResult[] = [];

      for (const entry of body) {
        if (emailStatusMap.has(entry.email)) {
          result.push({
            email: entry.email,
            status: emailStatusMap.get(entry.email)!,
          });
        } else {
          result.push({
            email: entry.email,
            status: "queued",
          });
        }
      }

      const emails = result.filter((r) => r.status === "queued").map((r) => r.email);
      if (emails.length > 0) {
        await addJob({
          name: "email:verify",
          payload: {
            emails,
          },
          queued: true,
        });
      }

      return response.status(200).send(result);
    }
  );
};
