import { getTdbRupturant } from "../../../common/apis/tdb";
import { insertBrevoContact, processBrevoContact } from "../../actions/tdb.actions";

export async function hydrateEffectifsEmail() {
  const data = await getTdbRupturant();

  for (const item of data) {
    await insertBrevoContact(item);
  }
}

export async function processEffectifsPendingMail() {
  return processBrevoContact();
}
