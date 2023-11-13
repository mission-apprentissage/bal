"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { FC, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

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
  const methods = useForm({
    mode: "all",
    defaultValues: {
      employeur: {
        adresse: {
          departement: "",
        },
      },
      contrat: {
        dateDebutContrat: "",
      },
      apprenti: {
        dateNaissance: "",
      },
    },
  });

  const values = methods.watch();
  const errors = methods.formState.errors;

  console.log({ values, errors });

  const onSubmit: SubmitHandler<any> = (values) => {
    console.log("submitted", { values, errors });
  };

  return (
    <Box>
      <div className={fr.cx("fr-accordions-group")}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {Object.entries(CERFA_STEPS).map(([key, cerfaStep]) => {
              const Component = cerfaStep.component;
              return (
                <CerfaAccordionItem
                  key={key}
                  id={cerfaStep.id}
                  label={cerfaStep.label}
                  completion={0} // TODO : compute completion
                  expanded={cerfaStep.order === step}
                  onExpandedChange={() => handleExpandChange(cerfaStep.order)}
                >
                  <Component />
                </CerfaAccordionItem>
              );
            })}
          </form>
        </FormProvider>
      </div>
    </Box>
  );
};

export default CerfaForm;
