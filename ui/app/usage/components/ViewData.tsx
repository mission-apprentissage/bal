import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import type { FC } from "react";

interface Props {
  title: string;
  data?: unknown;
}

const ViewData: FC<Props> = ({ data, title }) => {
  if (!data) return null;
  return (
    <Box my={4}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box mt={2} p={2} bgcolor={fr.colors.decisions.background.default.grey.active}>
        <pre>{JSON.stringify(data, null, "\t")}</pre>
      </Box>
    </Box>
  );
};

export default ViewData;
