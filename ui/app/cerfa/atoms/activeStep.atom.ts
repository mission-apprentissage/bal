import { atom } from "recoil";

import { CERFA_STEPS } from "../utils/cerfa.utils";

export const activeStepState = atom({
  key: "activeStep",
  default: CERFA_STEPS.EMPLOYEUR,
});
