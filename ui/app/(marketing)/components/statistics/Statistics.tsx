import { Divider, Grid, Typography } from "@mui/material";
import { FC } from "react";

import {
  StyledStatistic,
  StyledStatisticNumberAutocomplete,
  StyledStatisticNumberControls,
  StyledStatistics,
} from "./Statistics.styled";

const Statistics: FC = () => {
  return (
    <StyledStatistics>
      <Grid container>
        <StyledStatistic item xs={5}>
          <StyledStatisticNumberAutocomplete variant="h1" component="h3">
            55
          </StyledStatisticNumberAutocomplete>
          <Typography>champs auto-complétés</Typography>
        </StyledStatistic>

        <Grid item xs={2} container direction="row" justifyContent="center" alignItems="center">
          <Divider orientation="vertical" style={{ height: "80%", width: "1px" }} />
        </Grid>

        <StyledStatistic item xs={5}>
          <StyledStatisticNumberControls variant="h1" component="h3">
            + de 100
          </StyledStatisticNumberControls>
          <Typography>contrôles en temps réel</Typography>
        </StyledStatistic>
      </Grid>
    </StyledStatistics>
  );
};

export default Statistics;
