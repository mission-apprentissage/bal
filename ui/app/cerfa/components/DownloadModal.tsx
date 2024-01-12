import Alert from "@codegouvfr/react-dsfr/Alert";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

export const modal = createModal({
  id: "download-cerfa-modal",
  isOpenedByDefault: false,
});

interface Props {
  onDownload: () => void;
}

const DownloadModal: FC<Props> = ({ onDownload }) => {
  const download = () => {
    onDownload();
  };

  return (
    <modal.Component
      title="Télécharger le Cerfa en l’état"
      size="large"
      buttons={[
        {
          children: "Annuler",
        },
        {
          iconId: "ri-check-line",
          onClick: () => {
            download();
          },
          children: "Télécharger",
        },
      ]}
    >
      <Alert
        closable
        title="Vous avez des champs obligatoires non remplis"
        description="N’oubliez pas de compléter votre document avant de le transmettre à votre organisme compétent."
        onClose={function noRefCheck() {}}
        severity="info"
      />
      <Box my={2}>
        <Typography variant="subtitle2">Aucune donnée ne sera conservée.</Typography>
        <Typography gutterBottom>
          Vous pourrez toujours modifier le CERFA téléchargé depuis votre poste de travail.
        </Typography>
      </Box>

      <RadioButtons
        legend="Voulez-vous télécharger l’annexe des champs non remplis ou en erreurs ?"
        hintText="Ce document sera sous la forme d’un fichier PDF séparé."
        name="annexe_fields"
        options={[
          {
            label: "Oui",
            nativeInputProps: {
              value: "oui",
            },
          },
          {
            label: "Non",
            nativeInputProps: {
              value: "non",
            },
          },
        ]}
        orientation="horizontal"
      />

      <RadioButtons
        legend="Voulez-vous télécharger un document annexe indiquant les démarches à réaliser et comportant des informations utiles pour la suite ?"
        hintText="Ce document sera sous la forme d’un fichier PDF séparé."
        name="annexe_guide"
        options={[
          {
            label: "Oui",
            nativeInputProps: {
              value: "oui",
            },
          },
          {
            label: "Non",
            nativeInputProps: {
              value: "non",
            },
          },
        ]}
        orientation="horizontal"
      />

      <Typography>Cliquez sur télécharger pour obtenir le ou les documents sélectionnés.</Typography>
      <Typography className="fr-hint-text">
        Si vous avez sélectionné “Oui” à l’un des documents mentionnés, vous obtiendrez un fichier compressé comprenant
        les documents sélectionnés.
      </Typography>
    </modal.Component>
  );
};

export default DownloadModal;
