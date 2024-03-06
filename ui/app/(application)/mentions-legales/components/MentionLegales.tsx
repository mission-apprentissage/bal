import { Summary } from "@codegouvfr/react-dsfr/Summary";
import { Grid, Typography } from "@mui/material";

import Section from "../../components/section/Section";

const anchors = {
  EditeurDuSite: "editeur-du-site",
  DirecteurDeLaPublication: "directeur-de-la-publication",
  HebergementDuSite: "hebergement-du-site",
  Accessibilite: "accessibilite",
  SignalerUnDyfonctionnement: "signaler-un-dyfonctionnement",
};

const summaryData = [
  {
    anchorName: "Éditeur du site",
    anchorLink: anchors.EditeurDuSite,
  },
  {
    anchorName: "Directeur de la publication",
    anchorLink: anchors.DirecteurDeLaPublication,
  },
  {
    anchorName: "Hébergement du site",
    anchorLink: anchors.HebergementDuSite,
  },
  {
    anchorName: "Accessibilité",
    anchorLink: anchors.Accessibilite,
  },
  {
    anchorName: "Signaler un dysfonctionnement",
    anchorLink: anchors.SignalerUnDyfonctionnement,
  },
];

const MentionsLegales = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Summary
          links={summaryData.map((item) => ({
            linkProps: {
              href: `#${item.anchorLink}`,
            },
            text: item.anchorName,
          }))}
        />
      </Grid>
      <Grid item xs={12} lg={9}>
        <Typography variant="h2" gutterBottom>
          Mentions légales
        </Typography>

        <Typography>Mentions légales du site « BAL »</Typography>

        <Section id={anchors.EditeurDuSite}>
          <Typography variant="h3" gutterBottom>
            Éditeur du site
          </Typography>
          <Typography>
            Ce site est édité par la Délégation Générale à l’Emploi et à la Formation Professionnelle (DGEFP) et la
            Mission interministérielle de l’apprentissage.
            <br />
            <br />
            10-18 place des 5 Martyrs du Lycée Buffon
            <br /> 75015 Paris
          </Typography>
        </Section>

        <Section id={anchors.DirecteurDeLaPublication}>
          <Typography variant="h3" gutterBottom>
            Directeur de la publication
          </Typography>
          <Typography gutterBottom>
            Le Directeur de la publication est Monsieur Bruno Lucas, Délégué général à l’Emploi et à la Formation
            Professionnelle.
          </Typography>
        </Section>

        <Section id={anchors.HebergementDuSite}>
          <Typography variant="h3" gutterBottom>
            Hébergement du site
          </Typography>
          <Typography>
            L’hébergement est assuré par OVH SAS, situé à l’adresse suivante :
            <br />
            2 rue Kellermann
            <br />
            59100 Roubaix
            <br />
            Standard : 09.72.10.07
            <br />
            <br />
            La conception et la réalisation du site sont effectuée par La Mission Interministérielle pour
            l’apprentissage, située à l’adresse suivante :
            <br />
            Beta.gouv
            <br />
            20 avenue de Ségur
            <br />
            75007 Paris
          </Typography>
        </Section>

        <Section id={anchors.Accessibilite}>
          <Typography variant="h3" gutterBottom id={anchors.Accessibilite}>
            Accessibilité
          </Typography>
          <Typography>
            La conformité aux normes d’accessibilité numérique est un objectif ultérieur mais nous tâchons de rendre ce
            site accessible à toutes et à tous.
          </Typography>
        </Section>

        <Section id={anchors.SignalerUnDyfonctionnement}>
          <Typography variant="h3" gutterBottom>
            Signaler un dysfonctionnement
          </Typography>
          <Typography>
            Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du
            site, merci de nous en faire part.
            <br />
            Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou
            une demande de saisine au Défenseur des droits.
          </Typography>
        </Section>
      </Grid>
    </Grid>
  );
};

export default MentionsLegales;
