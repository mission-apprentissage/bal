"use client";

import { Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";

import { IResGetPerson } from "../../../../../../shared/routes/person.routes";
import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import Breadcrumb, {
  PAGES,
} from "../../../../components/breadcrumb/Breadcrumb";

interface Props {
  person: IResGetPerson;
}

const PersonView: FC<Props> = ({ person }) => {
  return (
    <>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.adminPersons(),
          PAGES.adminViewPerson(person._id as string),
        ]}
      />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Fiche personne
      </Heading>

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
          civility: {
            header: () => "Civilite",
          },
          organisation: {
            header: () => "Organisation",
            cell: ({ value }) => {
              return value ? (
                <Text
                  as={Link}
                  href={PAGES.adminViewOrganisation(value._id).path}
                >
                  {value.nom}
                </Text>
              ) : (
                ""
              );
            },
          },
          sirets: {
            header: () => "Sirets",
            cell: ({ value }) => {
              return value?.join(", ") ?? "";
            },
          },
          _meta: {
            header: () => "Meta",
            cell: ({ value }) => {
              return <pre>{JSON.stringify(value, null, "  ")}</pre>;
            },
          },
        }}
      />
    </>
  );
};

export default PersonView;
