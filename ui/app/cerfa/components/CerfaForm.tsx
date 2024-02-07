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
import DownloadModal, { modal } from "./DownloadModal";
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

const scrollToSection = () => {
  const employeurElement = document.getElementById(`${CERFA_STEPS.EMPLOYEUR.id}-collapse`)?.parentNode;
  // @ts-expect-error TODO
  const top = employeurElement?.offsetTop;

  setTimeout(() => {
    window.scrollTo({ top: top, behavior: "smooth" });
  }, 200);
};

const CerfaForm: FC = () => {
  const [activeStep, setActiveStep] = useRecoilState(activeStepState);
  const [showOverlay] = useRecoilState(showOverlayState);
  const [_, setInformationMessage] = useRecoilState(informationMessagesState);
  const handleExpandChange = (step: CerfaStep) => {
    setActiveStep(step);
  };

  useEffect(() => {
    scrollToSection();
  }, [activeStep]);

  useEffect(() => {
    setInformationMessage(activeStep?.messages);
  }, [activeStep, setInformationMessage]);

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      employeur: {
        siret: "",
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
        dureeTravailHebdoMinutes: "00",
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

    let filename = "cerfa_10103*10.pdf";

    if (values.apprenti.nom && values.apprenti.prenom) {
      filename = `${values.apprenti.nom}-${values.apprenti.prenom}-${filename}`;
    }

    downloadFile(data.content, filename);
  };

  return (
    <FormProvider {...methods}>
      <DownloadModal onDownload={download} />
      <Grid container spacing={2}>
        <Grid
          item
          xs={3}
          sx={{
            borderRight: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
          }}
        >
          <Box mb={2} p={2} pt={0} position="sticky" top={24}>
            <Stepper />

            <Box mt={12}>
              <Typography gutterBottom>Téléchargez à tout moment</Typography>
              <Button priority="primary" type="button" onClick={() => modal.open()}>
                Télécharger
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h1" mb={2}>
            Cerfa 10103*10
          </Typography>
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
                    expanded={cerfaStep.id === activeStep?.id}
                    onExpandedChange={() => handleExpandChange(cerfaStep)}
                  >
                    <Box pl={2}>
                      <Component />
                    </Box>
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
