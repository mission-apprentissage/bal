import { getTdbRupturant } from "../../../common/apis/tdb";
import { insertPendingEmail } from "../../actions/tdb.actions";

export async function hydrateEffectifsEmail() {
  const data = await getTdbRupturant();

  for (const item of data) {
    await insertPendingEmail(item);
  }
}
