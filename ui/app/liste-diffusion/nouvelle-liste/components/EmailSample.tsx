import Alert from "@codegouvfr/react-dsfr/Alert";
import { Box } from "@mui/material";
import { FC } from "react";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import { getDataFromSample } from "../mailingLists.utils";
import Sample from "./Sample";

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
