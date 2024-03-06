import { atom } from "recoil";

import { CerfaStep } from "../utils/cerfa.utils";

export const activeStepState = atom<CerfaStep | undefined>({
  key: "activeStep",
  default: undefined,
});
