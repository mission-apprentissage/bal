import { getLink } from "@codegouvfr/react-dsfr/link";
import Summary from "@codegouvfr/react-dsfr/Summary";
import Table from "@codegouvfr/react-dsfr/Table";
import { Grid, Typography } from "@mui/material";
import React from "react";

import Section from "../../components/section/Section";

const CONTACT_ADDRESS = "tableau-de-bord@apprentissage.beta.gouv.fr";

const { Link } = getLink();

const anchors = {
  Finalite: "finalite",
  DonneesACaracterePersonelTraitees: "donnees-a-caractere-personel-traitees",
  BaseJuridiqueDuTraitementDeDonnees: "base-juridique-du-traitement-de-donnees",
  DureeDeConservation: "duree-de-conservation",
  DroitDesPersonnesConcernees: "droit-des-personnes-concernees",
  DestinatairesDesDonnees: "destinataires-des-donnees",
  SecuriteEtConfidentialiteDesDonnees: "securite-et-confidentialite-des-donnees",
};

const summaryData = [
  { anchorName: "Finalité", anchorLink: "finalite" },
  {
    anchorName: "Données à caractère personnel traitées",
    anchorLink: "donnees-a-caractere-personel-traitees",
  },
  {
    anchorName: "Base juridique du traitement de données",
    anchorLink: "base-juridique-du-traitement-de-donnees",
  },
  {
    anchorName: "Durée de conservation",
    anchorLink: "duree-de-conservation",
  },
  {
    anchorName: "Droit des personnes concernées",
    anchorLink: "droit-des-personnes-concernees",
  },
  {
    anchorName: "Destinataires des données",
    anchorLink: "destinataires-des-donnees",
  },
  {
    anchorName: "Sécurité et confidentialité des données",
    anchorLink: "securite-et-confidentialite-des-donnees",
  },
];

const PolitiqueDeConfidentialite = () => {
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
          Politique de confidentialité
        </Typography>

        <Section>
          <Typography variant="h3" gutterBottom>
            Traitement des données à caractère personnel
          </Typography>
          <Typography>
            Le tableau de bord de l’apprentissage est développé par la Mission nationale pour l’apprentissage, mandatée
            par le ministère du Travail.
          </Typography>
        </Section>

        <Section mt={4} id={anchors.Finalite}>
          <Typography variant="h3" gutterBottom>
            Finalités
          </Typography>
          <Typography>
            Nous manipulons des données à caractère personnel pour améliorer la qualité du suivi et du pilotage de
            l’apprentissage par les différents acteurs. Plus précisément, elles visent à :
          </Typography>
          <ul>
            <li>
              Produire sous la forme d’un tableau de bord les données synthétiques des effectifs de l&apos;apprentissage
              afin de contribuer au pilotage de l’apprentissage au niveau national et territorial par les acteurs
              publics ou avec délégation de service public ;
            </li>
            <li>
              Identifier les jeunes en recherche de contrat ou en situation de décrochage pour améliorer leur
              accompagnement ;
            </li>
            <li>
              Produire les données nécessaires aux organismes de formation pour répondre aux enquêtes (notamment SIFA) ;
            </li>
            <li>Créer un compte pour accéder ou fournir des données;</li>
            <li>Suivre et piloter l&apos;usage du tableau de bord par l&apos;équipe Mission apprentissage ;</li>
            <li>Identifier les organismes de formation et leurs réseaux (référentiel).</li>
          </ul>
        </Section>
        <Section mt={4} id={anchors.DonneesACaracterePersonelTraitees}>
          <Typography variant="h3" gutterBottom>
            Données à caractère personnel traitées
          </Typography>
          <Typography>
            Nous traitons les données à caractère personnel et catégories de données à caractère personnel suivantes :
          </Typography>
          <ul>
            <li>
              Données relatives à l’identification du candidat ou jeune (nom, prénom, date de naissance, INE, adresse
              e-mail) ;
            </li>
            <li>Données relatives au représentant légal du jeune (nom, numéro de téléphone) ;</li>
            <li>
              Données relatives aux évènements du parcours des apprenants (date de début et de fin, date de début fin de
              contrat, et rupture, organisme de formation et département) ;
            </li>
            <li>Informations relatives au souhait de formation des candidats ;</li>
            <li>Données de contact des organisme de formation (adresse e-mail) ;</li>
            <li>Données de contact des entreprises (adresse e-mail).</li>
          </ul>
        </Section>
        <Section id={anchors.BaseJuridiqueDuTraitementDeDonnees}>
          <Typography variant="h3" gutterBottom>
            Base juridique du traitement de données
          </Typography>
          <Typography>
            Nous sommes autorisés à traiter vos données dans le cadre d’une mission d’intérêt public ou relevant de
            l’exercice de l’autorité publique dont est investi le responsable de traitement au sens de l’article 6-e du
            RPGD. Cette mission est notamment précisée dans la lettre de Mission de la Mission nationale pour
            l’apprentissage du 10 septembre 2019 et décision gouvernementale du 26 novembre 2019.
          </Typography>
        </Section>
        <Section mt={4} id={anchors.DureeDeConservation}>
          <Typography variant="h3" gutterBottom>
            Durée de conservation
          </Typography>
          <Typography>
            Nous conservons vos données pour une durée de 2 ans à compter de la dernière modification liée aux
            informations sur un candidat.
          </Typography>
        </Section>
        <Section mt={4} id={anchors.DroitDesPersonnesConcernees}>
          <Typography variant="h3" gutterBottom>
            Droit des personnes concernées
          </Typography>
          <Typography>Vous disposez des droits suivants concernant vos données à caractère personnel :</Typography>
          <ul>
            <li>Droit d’information et droit d’accès aux données ;</li>
            <li>Droit de rectification des données ;</li>
            <li>Droit d’opposition au traitement de données ;</li>
            <li>Droit à la limitation des données.</li>
          </ul>
          <Typography>
            <br />
            Pour les exercer, faites-nous parvenir une demande en précisant la date et l’heure précise de la requête –
            ces éléments sont indispensables pour nous permettre de retrouver votre recherche – par voie électronique à
            l’adresse suivante : <Link href={`mailto:${CONTACT_ADDRESS}`}>{CONTACT_ADDRESS}</Link>
            <br />
            <br />
            Par voie postale :
            <br />
            <br />
            Délégation générale à l’emploi et à la formation professionnelle
            <br />
            14 avenue Duquesne
            <br />
            75350 Paris SP 07
            <br />
            <br />
            En raison de l’obligation de sécurité et de confidentialité dans le traitement des données à caractère
            personnel qui incombe au responsable de traitement, votre demande ne sera traitée que si vous apportez la
            preuve de votre identité. <br />
            Pour vous aider dans votre démarche, vous trouverez ici
            <br />
            <Link href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">
              https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
            </Link>
            , un modèle de courrier élaboré par la CNIL.
            <br />
            <br />
            Le responsable de traitement s’engage à répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à
            compter de la réception de votre demande.
          </Typography>
        </Section>
        <Section mt={4} id={anchors.DestinatairesDesDonnees}>
          <Typography variant="h3" gutterBottom>
            Destinataires des données
          </Typography>
          <Typography>
            Nous nous engageons à ce que les données à caractères personnels soient traitées par les seules personnes
            autorisées.
          </Typography>
          <br />
          <Typography>Ont accès aux données :</Typography>
          <ul>
            <li>Les agents autorisés des DREETS, dans le cadre de leurs missions de service public ;</li>
            <li>Les organismes de formation ;</li>
            <li>Les réseaux d’organismes de formation ;</li>
            <li>Les Régions ;</li>
            <li>Les personnes autorisées au sein des Rectorats, dans le cadre de leurs missions de service public ;</li>
            <li>Les personnes autorisées au sein des Académies, dans le cadre de leurs missions de service public ;</li>
            <li>
              Les personnes autorisées travaillant pour le compte de la mission interministérielle pour l’apprentissage
              dans le cadre de la conception des services numériques ;
            </li>
            <li>
              Les personnes travaillant pour le compte de la mission interministérielle pour l’apprentissage dans le
              cadre de propositions ciblées d&apos;offres d’emploi ou d’alternance ;
            </li>
          </ul>
        </Section>
        <Section mt={4} id={anchors.SecuriteEtConfidentialiteDesDonnees}>
          <Typography variant="h3" gutterBottom>
            Sécurité et confidentialité des données
          </Typography>
          <Typography>
            Les mesures techniques et organisationnelles de sécurité adoptées pour assurer la confidentialité,
            l’intégrité et protéger l’accès des données sont notamment :
          </Typography>
          <ul>
            <li>Anonymisation ;</li>
            <li>Stockage des données en base de données ;</li>
            <li>Stockage des mots de passe en base sont hachés ;</li>
            <li>Cloisonnement des données ;</li>
            <li>Mesures de traçabilité ;</li>
            <li>Surveillance ;</li>
            <li>Protection contre les virus, malwares et logiciels espions ;</li>
            <li>Protection des réseaux ;</li>
            <li>Sauvegarde ;</li>
            <li>Mesures restrictives limitant l’accès physiques aux données à caractère personnel.</li>
          </ul>
          <Typography>Sous-traitants</Typography>
          <Table
            data={[
              [
                "OVH SAS",
                "France",
                "Hébergement",
                <Link href="https://www.ovhcloud.com/fr/personal-data-protection" key="ovh">
                  https://www.ovhcloud.com/fr/personal-data-protection
                </Link>,
              ],
            ]}
            headers={["Partenaire", "Pays destinataire", "Traitement réalisé", "Garanties"]}
          />

          <Typography variant="h3" gutterBottom>
            Cookies et autres traceurs
          </Typography>
          <Typography>
            Un cookie est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour but de collecter
            des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal
            (ordinateur, mobile ou tablette).
            <br />
            <br />
            Le site ne dépose pas de cookies de mesure d’audience (nombre de visites, pages consultées). Néanmoins, nous
            utilisons Plausible qui permet de suivre les tendances d’utilisation de notre site. L’outil ne permet pas
            d’identifier les personnes, ni de tracer votre usage d’internet, dans ou en dehors du site.
            <br />
            <br />
            Pour plus d’information à propos de Plausible :
            <br />
            <Link href="https://plausible.io/data-policy#first-thing-first-what-we-collect-and-what-we-use-it-for">
              https://plausible.io/data-policy#first-thing-first-what-we-collect-and-what-we-use-it-for
            </Link>{" "}
            et <Link href="https://plausible.io/privacy">https://plausible.io/privacy</Link>.
          </Typography>
        </Section>
      </Grid>
    </Grid>
  );
};
export default PolitiqueDeConfidentialite;
