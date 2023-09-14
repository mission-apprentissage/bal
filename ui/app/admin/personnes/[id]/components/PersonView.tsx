import Button from "@codegouvfr/react-dsfr/Button";
import { Typography } from "@mui/material";
import { FC } from "react";
import { PersonWithOrganisationJson } from "shared/models/person.model";

import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import Breadcrumb, { PAGES } from "../../../../components/breadcrumb/Breadcrumb";

interface Props {
  person: PersonWithOrganisationJson;
}

const PersonView: FC<Props> = ({ person }) => {
  return (
    <>
      <Breadcrumb pages={[PAGES.adminPersons(), PAGES.adminViewPerson(person._id as unknown as string)]} />
      <Typography variant="h2" gutterBottom>
        Fiche personne
      </Typography>

      <InfoDetails
        data={person}
        rows={{
          _id: {
            header: () => "Identifiant",
          },
          nom: {
            header: () => "Nom",
          },
          prenom: {
            header: () => "Prénom",
          },
          email: {
            header: () => "Email",
          },
          civility: {
            header: () => "Civilite",
          },
          organisation: {
            header: () => "Organisation",
            cell: ({ organisation }) => {
              if (!organisation) return null;
              return (
                <Button
                  iconId="fr-icon-arrow-right-line"
                  iconPosition="right"
                  linkProps={{
                    href: PAGES.adminViewOrganisation(organisation._id as unknown as string).path,
                  }}
                  priority="tertiary no outline"
                >
                  {organisation.nom}
                </Button>
              );
            },
          },
          sirets: {
            header: () => "Sirets",
            cell: ({ sirets }) => {
              return sirets?.join(", ") ?? "";
            },
          },
          _meta: {
            header: () => "Meta",
            cell: ({ _meta }) => {
              return <pre>{JSON.stringify(_meta, null, "  ")}</pre>;
            },
          },
        }}
      />
    </>
  );
};

export default PersonView;
