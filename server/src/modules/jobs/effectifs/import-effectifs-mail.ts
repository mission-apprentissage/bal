import { getTdbRupturant } from "../../../common/apis/tdb";
import { insertBrevoContactList, processBrevoContact } from "../../actions/tdb.actions";

export async function hydrateEffectifsEmail() {
  const data = await getTdbRupturant();
  return insertBrevoContactList(data);
}

export async function processEffectifsPendingMail() {
  return processBrevoContact();
}
