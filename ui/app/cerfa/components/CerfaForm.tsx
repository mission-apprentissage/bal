"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Grid, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

import { apiPost } from "../../../utils/api.utils";
import { activeStepState } from "../atoms/activeStep.atom";
import { informationMessagesState } from "../atoms/informationMessages.atom";
import { showOverlayState } from "../atoms/showOverlay.atom";
import { CERFA_STEPS, CerfaStep } from "../utils/cerfa.utils";
import { downloadFile } from "../utils/form.utils";
import InputController from "./blocks/inputs/InputController";
import CerfaAccordionItem from "./CerfaAccordionItem";
import InformationMessages from "./InformationMessages";
import LoadingOverlay from "./LoadingOverlay";
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
  const [showOverlay] = useRecoilState(showOverlayState);
  const [_, setInformationMessage] = useRecoilState(informationMessagesState);
  const handleExpandChange = (step: CerfaStep) => {
    setActiveStep(step);
  };

  useEffect(() => {
    setInformationMessage(activeStep.messages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep, setInformationMessage]);

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
        dateSignature: "",
        dateDebutContrat: "",
        dateDebutFormationPratique: "",
        dateFinContrat: "",
      },
      apprenti: {
        nom: "",
        prenom: "",
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

    downloadFile(data.content, `${values.apprenti.nom}-${values.apprenti.prenom}-cerfa_10103*10.pdf`);
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
          <Box mx={1}>
            <InputController name="contrat.modeContractuel" />
          </Box>
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
          <Box mt={2} mb={6}>
            <Typography color={fr.colors.decisions.text.mention.grey.default}>
              L’encart “Cadre réservé à l’organisme en charge du dépôt du contrat” est à la charge de l’administration
              qui traitera votre document.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <InformationMessages />
        </Grid>
      </Grid>
      {showOverlay && <LoadingOverlay />}
    </FormProvider>
  );
};

export default CerfaForm;
