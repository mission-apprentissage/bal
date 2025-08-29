import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Box } from "@mui/material";
import type { FC } from "react";
import { getDataFromSample } from "@/app/liste-diffusion/nouvelle-liste/mailingLists.utils";

interface Props {
  email: string;
  sample: Array<Record<string, string> | undefined>;
  isLoading?: boolean;
}

const WarningEmail: FC<Props> = ({ email, sample, isLoading }) => {
  if (isLoading) return null;

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
