"use client";

import { Typography } from "@mui/material";
import { FC } from "react";
import { IOrganisationJson } from "shared/models/organisation.model";

import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import Table from "../../../../../components/table/Table";
import Breadcrumb, { PAGES } from "../../../../components/breadcrumb/Breadcrumb";

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
          nom: {
            header: () => "Nom",
          },
          email_domains: {
            header: () => "Domaines",
            cell: ({ email_domains }) => {
              return (
                <ul>
                  {email_domains?.map((domain: string) => (
                    <li key={domain}>{domain}</li>
                  ))}
                </ul>
              );
            },
          },
        }}
      />

      <Typography variant="h3" gutterBottom>
        Établissements
      </Typography>

      <Table
        data={organisation.etablissements ?? []}
        columns={{
          nom: {
            id: "nom",
            size: 100,
            header: () => "Nom",
          },
          siret: {
            id: "siret",
            size: 100,
            header: () => "Siret",
          },
          is_hq: {
            id: "is_hq",
            size: 100,
            header: () => "Siège social",
            cell: ({ getValue }) => (getValue() ? "Oui" : "Non"),
          },
          is_close: {
            id: "is_close",
            size: 100,
            header: () => "Fermé",
            cell: ({ getValue }) => (getValue() ? "Oui" : "Non"),
          },
        }}
      />
    </>
  );
};

export default OrganisationView;
