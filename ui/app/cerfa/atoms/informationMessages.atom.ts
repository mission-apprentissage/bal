import { atom } from "recoil";

import { InformationMessage } from "../utils/cerfaSchema";

export const informationMessagesState = atom<InformationMessage[] | undefined>({
  key: "informationMessages",
  default: undefined,
});
