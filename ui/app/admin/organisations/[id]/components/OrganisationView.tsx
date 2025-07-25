"use client";

import { Typography } from "@mui/material";
import type { FC } from "react";
import type { IOrganisationJson } from "shared/models/organisation.model";

import InfoDetails from "@/components/infoDetails/InfoDetails";
import Table from "@/components/table/Table";
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
        rows={organisation.etablissements ?? []}
        getRowId={(row) => row.siret as string}
        columns={[
          {
            field: "nom",
            headerName: "Nom",
            flex: 1,
          },
          {
            field: "siret",
            headerName: "Siret",
            minWidth: 200,
          },
          {
            field: "is_hq",
            headerName: "Siège social",
            minWidth: 100,
            valueFormatter: ({ value }) => (value ? "Oui" : "Non"),
          },
          {
            field: "is_close",
            headerName: "Fermé",
            minWidth: 100,
            valueFormatter: ({ value }) => (value ? "Oui" : "Non"),
          },
        ]}
      />
    </>
  );
};

export default OrganisationView;
