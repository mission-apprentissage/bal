import { FindCursor } from "mongodb";

import { BrevoContacts, IBrevoContactsAPI } from "../../../../shared/models/brevo.contacts.model";
import { updateTdbRupturant } from "../../common/apis/tdb";
import { importContacts } from "../../common/services/brevo/brevo";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
import { getDbCollection } from "../../common/utils/mongodbUtils";
import config from "../../config";

export async function insertBrevoContact(contact: IBrevoContactsAPI) {
  await getDbCollection("brevo.contacts").updateOne(
    {
      email: contact.email,
    },
    {
      $setOnInsert: {
        created_at: new Date(),
        updated_at: new Date(),
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
    const mappedResult: Array<IBrevoContactsAPI> = chunk.emailsResult.map((item) => ({
      email: item.email,
      nom: chunk.emailsMap.get(item.email)?.nom,
      prenom: chunk.emailsMap.get(item.email)?.prenom,
      urls: chunk.emailsMap.get(item.email)?.urls,
      telephone: chunk.emailsMap.get(item.email)?.telephone,
      nomOrganisme: chunk.emailsMap.get(item.email)?.nomOrganisme,
    }));

    await importContacts(brevoListe?.listId, mappedResult);

    await updateTdbRupturant(chunk.emailsResult);
  }
}
