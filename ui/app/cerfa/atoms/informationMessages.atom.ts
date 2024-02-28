import { atom } from "recoil";
import { InformationMessage } from "shared/helpers/cerfa/types/cerfa.types";

export const informationMessagesState = atom<InformationMessage[] | undefined>({
  key: "informationMessages",
  default: undefined,
});
