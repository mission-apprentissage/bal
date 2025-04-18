import Boom from "@hapi/boom";
import { FindCursor } from "mongodb";

import { BrevoContacts, IBrevoContactsAPI } from "../../../../shared/models/brevo.contacts.model";
import { updateTdbRupturant } from "../../common/apis/tdb";
import { BrevoEventStatus, IBrevoWebhookEvent, importContacts } from "../../common/services/brevo/brevo";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
import { getDbCollection } from "../../common/utils/mongodbUtils";
import config from "../../config";

export async function insertBrevoContactList(contacts: Array<IBrevoContactsAPI>) {
  if (contacts.length === 0) {
    return;
  }
  const currentDate = new Date();
  await getDbCollection("brevo.contacts").bulkWrite(
    contacts.map((contact) => ({
      updateOne: {
        filter: { email: contact.email },
        update: {
          $setOnInsert: {
            created_at: currentDate,
            updated_at: currentDate,
            treated: false,
            ...contact,
          },
        },
        upsert: true,
      },
    })),
    { ordered: false }
  );
}

export async function processBrevoContact() {
  async function* generator(cursor: FindCursor<BrevoContacts>, chunkSize: number = 100) {
    const emailsMap = new Map<string, BrevoContacts>();
    for await (const document of cursor) {
      emailsMap.set(document.email, document);

      if (emailsMap.size === chunkSize) {
        const emailsResult = await verifyEmails([...emailsMap.keys()]);
        yield { emailsResult, emailsMap };
        emailsMap.clear();
      }
    }
    if (emailsMap.size > 0) {
      const emailsResult = await verifyEmails([...emailsMap.keys()]);
      yield { emailsResult, emailsMap };
    }
  }

  const brevoListe = await getDbCollection("brevo.listes").findOne({
    product: "tdb",
    env: config.env,
  });

  if (!brevoListe) {
    throw Boom.internal("Brevo liste not found");
  }

  const cursor = getDbCollection("brevo.contacts").find({ treated: false });

  for await (const chunk of generator(cursor, 100)) {
    const bulkOps = chunk.emailsResult.map((item) => ({
      updateOne: {
        filter: { email: item.email },
        update: {
          $set: {
            treated: true,
            updated_at: new Date(),
          },
        },
      },
    }));

    const mappedResult: Array<IBrevoContactsAPI> = chunk.emailsResult.reduce((acc, item) => {
      const contact = chunk.emailsMap.get(item.email);
      if (!contact) {
        return acc;
      }
      return [
        ...acc,
        {
          email: item.email,
          nom: contact.nom,
          prenom: contact.prenom,
          urls: contact?.urls,
          telephone: contact?.telephone,
          nom_organisme: contact?.nom_organisme,
          mission_locale_id: contact.mission_locale_id,
        },
      ];
    }, [] as Array<IBrevoContactsAPI>);

    await importContacts(brevoListe.listId, mappedResult);

    await updateTdbRupturant(
      chunk.emailsResult.map((item) => ({
        email: item.email,
        status: item.ping.status,
      }))
    );

    await getDbCollection("brevo.contacts").bulkWrite(bulkOps);
  }
}

export async function processHardbounce(payload: IBrevoWebhookEvent) {
  const { event, email } = payload;

  if (event === BrevoEventStatus.HARD_BOUNCE) {
    await updateTdbRupturant([{ email, status: "hardbounced" }]);
  }
}
