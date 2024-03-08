import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Grid, Typography } from "@mui/material";
import { FC } from "react";

import { PAGES } from "../../../(application)/components/breadcrumb/Breadcrumb";
import {
  StyledAdvantageContainer,
  StyledAdvantageImage,
  StyledCallToActionContainer,
  StyledImageForm,
} from "./Advantages.styled";
import form from "./form.png";
import money from "./money.png";
import notebook from "./notebook.png";
import storage from "./storage.png";

const Advantages: FC = () => {
  return (
    <section>
      <Grid container>
        <Grid item xs={5}>
          <Typography variant="h3" gutterBottom>
            Réduisez considérablement votre charge de travail
          </Typography>
          <Typography>En utilisant un formulaire assisté plutôt qu’un document papier.</Typography>

          <StyledImageForm src={form} alt="form" />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={6}>
          <StyledAdvantageContainer>
            <StyledAdvantageImage src={notebook} alt="document" />
            <Box>
              <Typography variant="h6" gutterBottom>
                Document impeccable
              </Typography>
              <Typography>
                Document final <strong>conforme</strong> au formulaire demandé par l’administration,{" "}
                <strong>sans ratures ni bavures</strong>.
              </Typography>
            </Box>
          </StyledAdvantageContainer>
          <StyledAdvantageContainer>
            <StyledAdvantageImage src={money} alt="rémuneration" />
            <Box>
              <Typography variant="h6" gutterBottom>
                Rémunération calculée
              </Typography>
              <Typography>
                Calcul <strong>automatique</strong> des <strong>périodes</strong> et du <strong>seuil</strong> minimal
                de rémunération adapté à votre situation.
              </Typography>
            </Box>
          </StyledAdvantageContainer>
          <StyledAdvantageContainer>
            <StyledAdvantageImage src={storage} alt="stockage" />
            <Box>
              <Typography variant="h6" gutterBottom>
                Pas de stockage de données
              </Typography>
              <Typography>Aucune donnée n’est conservée après votre départ de la plateforme.</Typography>
            </Box>
          </StyledAdvantageContainer>
        </Grid>
      </Grid>
      <StyledCallToActionContainer>
        <Button
          priority="secondary"
          iconId="fr-icon-arrow-right-line"
          iconPosition="right"
          linkProps={{
            href: PAGES.cerfa().path,
          }}
        >
          Commencer la saisie
        </Button>
      </StyledCallToActionContainer>
    </section>
  );
};

export default Advantages;
