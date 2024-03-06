import { atom } from "recoil";

import { FieldState } from "../utils/form.utils";

export const fieldsState = atom<Record<string, FieldState | undefined>>({
  key: "fields",
  default: {},
});

export const activeFieldState = atom<string>({
  key: "activeField",
  default: "",
});
