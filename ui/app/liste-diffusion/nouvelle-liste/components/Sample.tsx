import { Typography } from "@mui/material";
import { FC } from "react";
import { isComputedColumns, MAILING_LIST_COMPUTED_COLUMNS } from "shared/constants/mailingList";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import { getDataFromSample } from "../mailingLists.utils";

interface Props {
  sample: IDocumentContentJson[];
  column?: string;
  size?: number;
}

const Sample: FC<Props> = ({ sample, column, size = 3 }) => {
  if (!column || column === "") {
    return <Typography variant="caption">Ici apparaitra un aperçu des données sur votre fichier</Typography>;
  }

  if (isComputedColumns(column)) {
    return <Typography variant="caption">{MAILING_LIST_COMPUTED_COLUMNS[column].sample}</Typography>;
  }

  const data = getDataFromSample(sample, column);

  if (data.length === 0) {
    return <Typography variant="caption">Aucune donnée disponible</Typography>;
  }

  return data.slice(0, size).join(", ");
};

export default Sample;
