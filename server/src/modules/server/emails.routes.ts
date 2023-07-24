import { preValidationHookHandler } from "fastify";
import {
  IParamsGetEmailPreview,
  IReqPostEmailsWebHook,
  SParamsGetEmailPreview,
  SReqPostEmailsWebHook,
} from "shared/routes/emails.routes";

import {
  checkIfEmailExists,
  markEmailAsDelivered,
  markEmailAsFailed,
  markEmailAsOpened,
  renderEmail,
  unsubscribeUser,
} from "../actions/emails.actions";
import { Server } from "./server";

export const emailsRoutes = ({ server }: { server: Server }) => {
  const checkEmailToken: preValidationHookHandler = async (
    request,
    reply,
    done
  ) => {
    const { token } = request.params as IParamsGetEmailPreview;
    if (!(await checkIfEmailExists(token))) {
      return reply.status(404).send("Non trouvé");
    }
    done();
  };

  server.get<{
    Params: IParamsGetEmailPreview;
  }>(
    "/emails/:token/preview",
    {
      schema: {
        params: SParamsGetEmailPreview,
        // response: {
        //   200: SResEmailHTML,
        // },
      } as const,
      preHandler: [checkEmailToken],
    },
    async (request, response) => {
      const html = await renderEmail(request.params.token);
      return response
        .header("Content-Type", "text/html")
        .status(200)
        .send(Buffer.from(html as string));
    }
  );

  server.get<{
    Params: IParamsGetEmailPreview;
  }>(
    "/emails/:token/markAsOpened",
    {
      schema: {
        params: SParamsGetEmailPreview,
      } as const,
    },
    async (request, response) => {
      const { token } = request.params;

      markEmailAsOpened(token);

      return response
        .header("Content-Type", "image/gif")
        .status(200)
        .send(
          Buffer.from(
            "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            "base64"
          )
        );
    }
  );

  server.get<{
    Params: IParamsGetEmailPreview;
  }>(
    "/emails/:token/unsubscribe",
    {
      schema: {
        params: SParamsGetEmailPreview,
        // response: {
        //   200: SResEmailHTML,
        // },
      } as const,
      preHandler: [checkEmailToken],
    },
    async (request, response) => {
      const { token } = request.params;

      await unsubscribeUser(token);

      return response
        .header("Content-Type", "text/html")
        .status(200)
        .send(
          Buffer.from(
            `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Désinscription</title>
                </head>
                <body>
                    <div class="sib-container rounded ui-sortable" style="position: relative; max-width: 540px; margin: 0px auto; text-align: left; background: rgb(252, 252, 252); padding: 40px 20px 20px; line-height: 150%; border-radius: 4px; border-width: 0px !important; border-color: transparent !important;">
                        <div class="header" style="padding: 0px 20px;">
                            <h1 class="title editable" data-editfield="newsletter_name" contenteditable="true" style="font-weight: normal; text-align: center; font-size: 25px; margin-bottom: 5px; padding: 0px; margin-top: 0px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(35, 35, 35);">Désinscription</h1>
                        </div>
                         <div class="innercontainer rounded2 email-wrapper" style="border-radius: 10px; padding: 10px; background: rgb(241, 241, 241);">
                            <div class="description editable" data-editfield="newsletter_description" contenteditable="true" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(52, 52, 52); padding: 0px 20px 15px; text-align: center">Vous êtes désinscrit.</div>
                        </div>
                    </div>
            
                </body>
            </html>
            `
          )
        );
    }
  );

  server.post<{
    Body: IReqPostEmailsWebHook;
  }>(
    "/emails/webhook",
    {
      schema: {
        body: SReqPostEmailsWebHook,
      } as const,
      preHandler: [server.auth([server.validateWebHookKey])],
    },
    async (request, response) => {
      const { event, "message-id": messageId } = request.body;

      if (event === "delivered") {
        markEmailAsDelivered(messageId);
      } else {
        markEmailAsFailed(messageId, event);
      }

      return response.status(200).send();
    }
  );
};
