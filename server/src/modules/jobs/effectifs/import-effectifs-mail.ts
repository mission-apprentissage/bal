import { getTdbRupturant } from "../../../common/apis/tdb";
import { insertPendingEmail, processPendingEmail } from "../../actions/tdb.actions";

export async function hydrateEffectifsEmail() {
  const data = await getTdbRupturant();

  for (const item of data) {
    await insertPendingEmail(item);
  }
}

export async function processEffectifsPendingMail() {
  return processPendingEmail();
}
