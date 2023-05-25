"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";
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
          email: {
            header: () => "Email",
          },
          civility: {
            header: () => "Civilite",
          },
          organisation: {
            header: () => "Organisation",
            cell: ({ organisation }) => {
              return organisation ? (
                <Text
                  as={Link}
                  href={PAGES.adminViewOrganisation(organisation._id).path}
                >
                  {organisation.nom}
                </Text>
              ) : (
                ""
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
      <Box paddingTop={10}>
        <Button
          as={Link}
          href={PAGES.adminUpdatePerson(person._id).path}
          variant="outline"
        >
          Modifier
        </Button>
      </Box>
    </>
  );
};

export default PersonView;
