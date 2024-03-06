import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";
import { Grid, Typography } from "@mui/material";

export const StyledStatistics = styled.section`
  margin-bottom: ${fr.spacing("6w")};
`;

export const StyledStatistic = styled(Grid)`
  padding: 2rem 0;
  text-align: center;
`;

export const StyledStatisticNumberAutocomplete = styled(Typography)`
  color: #667dcf;
` as typeof Typography;

export const StyledStatisticNumberControls = styled(Typography)`
  color: #e18b76;
` as typeof Typography;
