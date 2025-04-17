import { FindCursor } from "mongodb";

import { BrevoContacts, IBrevoContactsAPI } from "../../../../shared/models/brevo.contacts.model";
import { updateTdbRupturant } from "../../common/apis/tdb";
import { BrevoEventStatus, IBrevoWebhookEvent, importContacts } from "../../common/services/brevo/brevo";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
import { getDbCollection } from "../../common/utils/mongodbUtils";
import config from "../../config";

export async function insertBrevoContact(contact: IBrevoContactsAPI) {
  const currentDate = new Date();
  await getDbCollection("brevo.contacts").updateOne(
    {
      email: contact.email,
    },
    {
      $setOnInsert: {
        created_at: currentDate,
        updated_at: currentDate,
        treated: false,
        ...contact,
      },
    },
    {
      upsert: true,
    }
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
    throw new Error("Brevo liste not found");
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
    await getDbCollection("brevo.contacts").bulkWrite(bulkOps);
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

    await importContacts(brevoListe?.listId, mappedResult);

    await updateTdbRupturant(
      chunk.emailsResult.map((item) => ({
        email: item.email,
        status: item.ping.status,
      }))
    );
  }
}

export async function processHardbounce(payload: IBrevoWebhookEvent) {
  const { event, email } = payload;

  if (event === BrevoEventStatus.HARD_BOUNCE) {
    updateTdbRupturant([{ email, status: "hardbounced" }]);
  }
}
