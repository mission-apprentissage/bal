"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { CERFA_STEPS } from "../utils/cerfa.utils";
import CerfaAccordionItem from "./CerfaAccordionItem";

export interface CerfaForm {
  values: any;
  dossier?: any;
  signal?: any;
  cache?: any;
  fields?: any;
}

const CerfaForm: FC = () => {
  const [step, setStep] = useState(CERFA_STEPS.EMPLOYEUR.order);
  const handleExpandChange = (step: number) => {
    setStep(step);
  };
  const methods = useForm();

  const values = methods.watch();

  console.log({ values });

  return (
    <Box>
      <div className={fr.cx("fr-accordions-group")}>
        <FormProvider {...methods}>
          {Object.entries(CERFA_STEPS).map(([key, cerfaStep]) => {
            const Component = cerfaStep.component;
            return (
              <CerfaAccordionItem
                key={key}
                id={cerfaStep.id}
                label={cerfaStep.label}
                completion={0}
                expanded={cerfaStep.order === step}
                onExpandedChange={() => handleExpandChange(cerfaStep.order)}
              >
                <Component />
              </CerfaAccordionItem>
            );
          })}
        </FormProvider>
      </div>
    </Box>
  );
};

export default CerfaForm;
