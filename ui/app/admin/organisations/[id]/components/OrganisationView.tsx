"use client";

import { Typography } from "@mui/material";
import type { FC } from "react";
import type { IOrganisationJson } from "shared/models/organisation.model";
import InfoDetails from "@/components/infoDetails/InfoDetails";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

interface Props {
  organisation: IOrganisationJson;
}

const OrganisationView: FC<Props> = ({ organisation }) => {
  return (
    <>
      <Breadcrumb pages={[PAGES.adminOrganisations(), PAGES.adminViewOrganisation(organisation._id)]} />
      <Typography variant="h2" gutterBottom>
        Fiche organisation
      </Typography>

      <InfoDetails
        data={organisation}
        rows={{
          _id: {
            header: () => "Identifiant",
          },
          siren: {
            header: () => "SIREN",
          },
          email_domain: {
            header: () => "Domaine Email",
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

export default OrganisationView;
