import { atom } from "recoil";

import { FieldState } from "../utils/form.utils";

export const fieldsState = atom({
  key: "fields",
  default: {} as Record<string, FieldState | undefined>,
});
