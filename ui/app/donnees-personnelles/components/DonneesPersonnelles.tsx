import { fr } from "@codegouvfr/react-dsfr";
import { Summary } from "@codegouvfr/react-dsfr/Summary";
import { Grid, Typography } from "@mui/material";
import React from "react";

import Section from "../../components/section/Section";

const anchors = {
  mission: "mission",
  finalite: "finalite",
  minimisation: "minimisation",
};

const summaryData = [
  {
    anchorLink: anchors.mission,
    anchorName: "La mission d’intérêt public",
  },
  {
    anchorLink: anchors.finalite,
    anchorName: "Faciliter le pilotage opérationnel de l’apprentissage",
  },
  {
    anchorLink: anchors.minimisation,
    anchorName: "Minimisation des données",
  },
];

const DonneesPersonnelles = () => {
  const productName = "BAL";

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
          Protection des données à caractère personnel
        </Typography>
        <Typography>
          Le BAL est{" "}
          <strong>
            construit dans le respect de la vie privée des personnes et applique les standards de sécurité de
            l&apos;État.
          </strong>
        </Typography>

        <Section>
          <Typography variant="h4" color={fr.colors.decisions.text.actionHigh.blueFrance.default} id={anchors.mission}>
            Base légale
          </Typography>
          <Typography variant="h3" gutterBottom color={fr.colors.decisions.text.actionHigh.blueFrance.default}>
            La mission d&apos;intérêt public
          </Typography>

          <Typography>
            Il existe plusieurs bases légales pour fonder un traitement de données à caractère personnel :
          </Typography>
          <ul>
            <li>Le consentement des personnes ;</li>
            <li>Une obligation légale ;</li>
            <li>L’existence d’un contrat ;</li>
            <li>Une mission d’intérêt public, etc...</li>
          </ul>
          <Typography gutterBottom>
            C’est sur cette dernière base légale que se fonde notre traitement. En effet, la Mission a accès à certaines
            données à caractère personnel (état civil, coordonnées, code formation, statut inscrit, apprenti, ou
            abandon) enregistrées dans les systèmes de gestion des CFA pour les années n et n-1, afin de proposer des
            nouveaux services, de réaliser des études de cohorte et des analyses de données pour améliorer la qualité du
            service public rendu.
          </Typography>
          <Typography>
            Le traitement de collecte des données relatives aux candidats à l’apprentissage et aux apprentis s’inscrit
            dans une mission d’intérêt public décrite dans le cadre de la mission Houzel. Cette mission Houzel fait
            l’objet de deux lettres en date du 10 septembre 2019 puis du 25 février 2020, mais aussi de deux décisions
            du gouvernement en date du 26 novembre 2019 et du 15 octobre 2020.
          </Typography>
        </Section>

        {/* Block Faciliter le pilotage */}
        <Section>
          <Typography variant="h4" color={fr.colors.decisions.text.actionHigh.blueFrance.default} id={anchors.finalite}>
            Finalité
          </Typography>
          <Typography variant="h3" gutterBottom color={fr.colors.decisions.text.actionHigh.blueFrance.default}>
            Faciliter le pilotage opérationnel de l&apos;apprentissage
          </Typography>

          <Typography gutterBottom>
            Le {productName} vise à mettre à disposition de toutes les parties prenantes de la formation en
            apprentissage les données clés, de manière dynamique, afin de permettre un pilotage opérationnel réactif
            dans les territoires.
          </Typography>
          <Typography>
            L’affichage des données en temps réel auprès des acteurs institutionnels leur permet :
          </Typography>
          <ul>
            <li>
              <strong>D&apos;avoir une tendance de l’évolution</strong> du nombre d’apprentis ;
            </li>
            <li>
              <strong>De dénombrer et identifier les CFAs</strong> dans lesquels des jeunes sont en recherche de contrat
              ou en risque de décrochage ;
            </li>
            <li>
              <strong>D&apos;évaluer l’impact</strong> des plans d’actions régionaux.
            </li>
          </ul>
        </Section>

        {/* Block Minimisation des données */}
        <Section>
          <Typography
            variant="h4"
            color={fr.colors.decisions.text.actionHigh.blueFrance.default}
            id={anchors.minimisation}
          >
            Données collectées
          </Typography>
          <Typography variant="h3" gutterBottom color={fr.colors.decisions.text.actionHigh.blueFrance.default}>
            Minimisation des données
          </Typography>

          <Typography>
            Dans le respect du RGPD, seules les données utiles à la construction du {productName} sont collectées.
          </Typography>
          <Typography>Données concernant l’apprenant :</Typography>
          <ul>
            <li>
              <strong>Identification</strong> : nom, prénom, date de naissance, tel, e-mail, Code Insee résidence, INE ;
            </li>
            <li>
              <strong>Formation suivie</strong> : Code Formation Diplôme, RNCP, libellé, période de la formation, année
              dans la formation, année scolaire, date début de formation ;
            </li>
            <li>
              <strong>Le statut de l’apprenant</strong> : apprenti, inscrit sans contrat, rupturant, abandon
            </li>
          </ul>
          <Typography>Données concernant l’organisme :</Typography>
          <ul>
            <li>
              <strong>Identification</strong> : UAI, SIRET, Nom, Code Insee CFA Formateur
            </li>
          </ul>
          <Typography>Données concernant le contrat d&apos;apprentissage :</Typography>
          <ul>
            <li>Date de début et date de fin</li>
          </ul>
        </Section>
      </Grid>
    </Grid>
  );
};

export default DonneesPersonnelles;
