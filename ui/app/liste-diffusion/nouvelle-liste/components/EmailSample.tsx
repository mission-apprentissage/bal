import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Box } from "@mui/material";
import Sample from "./Sample";
import { getDataFromSample } from "@/app/liste-diffusion/nouvelle-liste/mailingLists.utils";

interface Props {
  sample: Array<Record<string, string> | undefined>;
  emailKey?: string;
  isLoading?: boolean;
}

export default function EmailSample({ sample, emailKey, isLoading }: Props) {
  if (!emailKey || isLoading) {
    return <Sample sample={sample} column={emailKey} isLoading={isLoading} />;
  }

  const data = getDataFromSample(sample, emailKey);

  // check if data has at least an email
  const hasEmail = data.some((d) => d.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));

  return (
    <Box>
      <Box mb={1}>
        <Sample sample={sample} column={emailKey} />
      </Box>
      {!hasEmail && (
        <Alert
          description={`La colonne ${emailKey} ne semble pas contenir pas d'adresse email.`}
          severity="warning"
          small
        />
      )}
    </Box>
  );
}
