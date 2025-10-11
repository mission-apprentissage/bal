import { Typography } from "@mui/material";
import type { FC } from "react";
import type { IPersonJson } from "shared/models/person.model";
import InfoDetails from "@/components/infoDetails/InfoDetails";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

interface Props {
  person: IPersonJson;
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
          email: {
            header: () => "Email",
          },
          siret: {
            header: () => "SIRET",
          },
          source: {
            header: () => "Source",
          },
          created_at: {
            header: () => "Créée le",
          },
          updated_at: {
            header: () => "Dernière mise à jour",
          },
        }}
      />
    </>
  );
};

export default PersonView;
