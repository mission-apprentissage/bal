import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Box } from "@mui/material";
import type { FC } from "react";
import type { IDocumentContentJson } from "shared/models/documentContent.model";

import Sample from "./Sample";
import { getDataFromSample } from "@/app/liste-diffusion/nouvelle-liste/mailingLists.utils";

interface Props {
  sample: IDocumentContentJson[];
  emailKey?: string;
}

const EmailSample: FC<Props> = ({ sample, emailKey }) => {
  if (!emailKey) {
    return <Sample sample={sample} column={emailKey} />;
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
};

export default EmailSample;
