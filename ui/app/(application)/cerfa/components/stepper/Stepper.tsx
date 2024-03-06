import { Box } from "@mui/material";
import { FC } from "react";
import { useRecoilState } from "recoil";

import { activeStepState } from "../../atoms/activeStep.atom";
import { CERFA_STEPS } from "../../utils/cerfa.utils";
import Step from "./Step";

const Stepper: FC = () => {
  const [activeStep, setActiveStep] = useRecoilState(activeStepState);

  return (
    <Box>
      {Object.entries(CERFA_STEPS).map(([key, cerfaStep]) => (
        <Step
          key={key}
          active={activeStep?.id === cerfaStep.id}
          stepNumber={cerfaStep.order}
          onClick={() => {
            setActiveStep(cerfaStep);
          }}
        >
          {cerfaStep.label}
        </Step>
      ))}
    </Box>
  );
};

export default Stepper;
