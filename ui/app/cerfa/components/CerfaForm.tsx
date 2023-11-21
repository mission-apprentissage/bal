"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

import { apiPost } from "../../../utils/api.utils";
import { activeStepState } from "../atoms/activeStep.atom";
import { CERFA_STEPS, CerfaStep } from "../utils/cerfa.utils";
import { downloadFile } from "../utils/form.utils";
import { employeurSchema } from "./blocks/employeur/employeurSchema";
import CerfaAccordionItem from "./CerfaAccordionItem";
import InformationMessages from "./InformationMessages";
import Stepper from "./stepper/Stepper";

export interface CerfaForm {
  values: any;
  dossier?: any;
  signal?: any;
  cache?: any;
  fields?: any;
}

const CerfaForm: FC = () => {
  const [activeStep, setActiveStep] = useRecoilState(activeStepState);
  const handleExpandChange = (step: CerfaStep) => {
    setActiveStep(step);
  };
  const methods = useForm({
    mode: "all",
    defaultValues: {
      employeur: {
        privePublic: "prive",
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

  const download = async () => {
    const data = await apiPost("/v1/cerfa", { body: values });

    downloadFile(data.content, "cerfa.pdf");
  };

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box mb={2} p={2} pt={0} position="sticky" top={24}>
            <Stepper />

            <Box mt={12}>
              <Typography variant="subtitle2" gutterBottom>
                Téléchargez à tout moment
              </Typography>
              <Button priority="secondary" type="button" onClick={download}>
                Télécharger
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <div className={fr.cx("fr-accordions-group")}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {Object.entries(CERFA_STEPS).map(([key, cerfaStep]) => {
                const Component = cerfaStep.component;
                return (
                  <CerfaAccordionItem
                    key={key}
                    id={cerfaStep.id}
                    label={cerfaStep.label}
                    completion={0} // TODO : compute completion
                    expanded={cerfaStep.id === activeStep.id}
                    onExpandedChange={() => handleExpandChange(cerfaStep)}
                  >
                    <Component />
                  </CerfaAccordionItem>
                );
              })}
            </form>
          </div>
        </Grid>
        <Grid item xs={3}>
          <InformationMessages messages={employeurSchema["employeur.siret"].messages} />
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default CerfaForm;
