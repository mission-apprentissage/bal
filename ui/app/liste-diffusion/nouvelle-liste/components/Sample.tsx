import { Typography } from "@mui/material";
import { FC } from "react";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import { getDataFromSample, WEBHOOK_LBA } from "../mailingLists.utils";

interface Props {
  sample: IDocumentContentJson[];
  column?: string;
  size?: number;
}

const Sample: FC<Props> = ({ sample, column, size = 3 }) => {
  if (!column || column === "") {
    return <Typography variant="caption">Ici apparaitra un aperçu des données sur votre fichier</Typography>;
  }

  if (column === WEBHOOK_LBA) {
    return <Typography variant="caption">Données récupérées depuis LBA</Typography>;
  }

  const data = getDataFromSample(sample, column);

  if (data.length === 0) {
    return <Typography variant="caption">Aucune donnée disponible</Typography>;
  }

  return data.slice(0, size).join(", ");
};

export default Sample;
