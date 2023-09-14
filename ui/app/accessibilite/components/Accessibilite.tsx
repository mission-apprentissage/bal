import { getLink } from "@codegouvfr/react-dsfr/link";
import { Typography } from "@mui/material";
import React from "react";

import { PAGES } from "../../components/breadcrumb/Breadcrumb";
import Section from "../../components/section/Section";

const Accessibilite = () => {
  const { Link } = getLink();
  return (
    <>
      <Typography variant="h2" gutterBottom>
        {PAGES.accessibilite().title}
      </Typography>
      <Section>
        <Typography>
          L&apos;initiative internationale pour l&apos;accessibilité du Web (Web Accessiblility Initiative) définit
          l&apos;accessibilité du Web comme suit :<br />
          <br />
          L&apos;accessibilité du Web signifie que les personnes en situation de handicap peuvent utiliser le Web. Plus
          précisément, qu&apos;elles peuvent percevoir, comprendre, naviguer et interagir avec le Web, et qu&apos;elles
          peuvent contribuer sur le Web. L&apos;accessibilité du Web bénéficie aussi à d&apos;autres, notamment les
          personnes âgées dont les capacités changent avec l&apos;âge. L&apos;accessibilité du Web comprend tous les
          handicaps qui affectent l&apos;accès au Web, ce qui inclut les handicaps visuels, auditifs, physiques, de
          paroles, cognitives et neurologiques.
          <br />
          <br />
          L&apos;article 47 de la loi n° 2005-102 du 11 février 2005 pour l&apos;égalité des droits et des chances, la
          participation et la citoyenneté des personnes handicapées fait de l&apos;accessibilité une exigence pour tous
          les services de communication publique en ligne de l&apos;État, les collectivités territoriales et les
          établissements publics qui en dépendent.
          <br />
          <br />
          Il stipule que les informations diffusées par ces services doivent être accessibles à tous. Le référentiel
          général d&apos;accessibilité pour les administrations (RGAA) rendra progressivement accessible l&apos;ensemble
          des informations fournies par ces services.
          <br />
          <br />
          Le site Catalogue de l&apos;offre de formation en apprentissage est en cours d&apos;optimisation afin de le
          rendre conforme au{" "}
          <Link href={"https://www.numerique.gouv.fr/publications/rgaa-accessibilite"}>RGAA v3 </Link>
          .
          <br />
          La déclaration de conformité sera publiée ultérieurement.
        </Typography>
      </Section>
      <Section>
        <Typography variant="h3" gutterBottom>
          Nos engagements
        </Typography>
        <Typography>
          Audit de mise en conformité (en cours) pour nous aider à détecter les potentiels oublis d&apos;accessibilité.
          <br />
          Déclaration d&apos;accessibilité (en cours) pour expliquer en toute transparence notre démarche.
          <br />
          Mise à jour de cette page pour vous tenir informés de notre progression.
          <br />
          Nos équipes ont ainsi travaillé sur les contrastes de couleur, la présentation et la structure de
          l&apos;information ou la clarté des formulaires.
          <br />
          Des améliorations vont être apportées régulièrement.
        </Typography>
      </Section>
      <Section>
        <Typography>
          Pour en savoir plus sur la politique d&apos;accessibilité numérique de l&apos;État :{" "}
          <Link href={"https://www.numerique.gouv.fr/publications/rgaa-accessibilite/"}>
            https://www.numerique.gouv.fr/publications/rgaa-accessibilite/{" "}
          </Link>
        </Typography>
      </Section>
      <Section>
        <Typography variant="h3" gutterBottom>
          Voie de recours
        </Typography>
        <Typography>
          Cette procédure est à utiliser dans le cas suivant : vous avez signalé au responsable du site internet un
          défaut d&apos;accessibilité qui vous empêche d&apos;accéder à un contenu ou à un des services du portail et
          vous n&apos;avez pas obtenu de réponse satisfaisante.
          <br />
          <br />
          Vous pouvez :
          <ul>
            <li>
              Écrire un message au <Link href={"https://formulaire.defenseurdesdroits.fr/"}>Défenseur des droits </Link>
            </li>
            <li>
              Contacter le délégué du{" "}
              <Link href={"https://www.defenseurdesdroits.fr/saisir/delegues"}>
                Défenseur des droits dans votre région{" "}
              </Link>
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :<br />
              Défenseur des droits
              <br />
              Libre réponse 71120 75342 Paris CEDEX 07
            </li>
          </ul>
        </Typography>
      </Section>
    </>
  );
};

export default Accessibilite;
