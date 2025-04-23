import { getTdbRupturant } from "../../../common/apis/tdb";
import { insertBrevoContactList, processNewBrevoContact, processQueuedBrevoContact } from "../../actions/tdb.actions";

export async function hydrateEffectifsEmail() {
  const data = await getTdbRupturant();
  return insertBrevoContactList(data);
}

export async function processEffectifsPendingMail() {
  await processNewBrevoContact();
  await processQueuedBrevoContact();
}
