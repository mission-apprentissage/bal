import { Typography } from "@mui/material";
import { isComputedColumns, MAILING_LIST_COMPUTED_COLUMNS } from "shared/constants/mailingList";

import { getDataFromSample } from "@/app/liste-diffusion/nouvelle-liste/mailingLists.utils";

interface Props {
  sample: Array<Record<string, string> | undefined>;
  column?: string;
  size?: number;
  isLoading?: boolean;
}

export default function Sample({ sample, column, size = 3, isLoading = false }: Props) {
  if (!column || column === "" || isLoading) {
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
}
