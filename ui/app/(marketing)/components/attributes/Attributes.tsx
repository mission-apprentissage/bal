import { Grid, Typography } from "@mui/material";
import { FC } from "react";

import { StyledAttributeImage, StyledAttributes } from "./Attributes.styled";
import developer from "./developer_solid.svg";
import hands from "./hands_solid.svg";
import rocket from "./product_launch_solid.svg";

const Attributes: FC = () => {
  return (
    <StyledAttributes>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <StyledAttributeImage src={developer} alt="developer" width={140} height={88} />
          <Typography variant="h5" gutterBottom>
            Simple
          </Typography>
          <Typography variant="body2">
            Le formulaire vous guide pour compléter les différents champs, afin de limiter les oublis ou erreurs.
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <StyledAttributeImage src={hands} alt="developer" width={190} height={88} />
          <Typography variant="h5" gutterBottom>
            Rapide
          </Typography>
          <Typography variant="body2">
            De nombreux champs se complètent automatiquement à partir d’une seule donnée.
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <StyledAttributeImage src={rocket} alt="developer" width={197} height={88} />
          <Typography variant="h5" gutterBottom>
            Sans erreur
          </Typography>
          <Typography variant="body2">
            Contrôles en temps réel sur l’établissement d’accueil, la formation, l’âge de l’apprenti et bien d’autres.{" "}
          </Typography>
        </Grid>
      </Grid>
    </StyledAttributes>
  );
};

export default Attributes;
