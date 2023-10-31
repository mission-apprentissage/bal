import Alert from "@codegouvfr/react-dsfr/Alert";
import { Box } from "@mui/material";
import { FC } from "react";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import { getDataFromSample } from "../mailingLists.utils";

interface Props {
  email: string;
  sample: IDocumentContentJson[];
}

const WarningEmail: FC<Props> = ({ email, sample }) => {
  const data = getDataFromSample(sample, email);

  // check if data has at least an email
  const hasEmail = data.some((d) => d.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));

  if (hasEmail) return null;

  return (
    <Box mb={4}>
      <Alert
        title={`La colonne ${email} ne semble pas contenir pas d'adresse email.`}
        description="En l'absence d'adresse e-mail, la génération de la liste de diffusion ne sera pas possible."
        severity="error"
        small
      />
    </Box>
  );
};

export default WarningEmail;
