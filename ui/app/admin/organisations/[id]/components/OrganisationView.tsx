"use client";

import { Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { FC } from "react";

import { IResGetOrganisation } from "../../../../../../shared/routes/organisation.routes";
import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import Table from "../../../../../components/table/Table";
import Breadcrumb, {
  PAGES,
} from "../../../../components/breadcrumb/Breadcrumb";

interface Props {
  organisation: IResGetOrganisation;
}

const OrganisationView: FC<Props> = ({ organisation }) => {
  return (
    <>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.adminOrganisations(),
          // @ts-ignore
          PAGES.adminViewOrganisation(organisation._id as string),
        ]}
      />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Fiche organisation
      </Heading>

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
                <UnorderedList>
                  {email_domains?.map((domain: string) => (
                    <ListItem key={domain}>{domain}</ListItem>
                  ))}
                </UnorderedList>
              );
            },
          },
        }}
      />

      <Heading as="h3" fontSize="xl" mb={[3, 6]}>
        Établissements
      </Heading>

      <Table
        mt={4}
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
