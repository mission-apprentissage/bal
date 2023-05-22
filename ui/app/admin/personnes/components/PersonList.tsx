import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IResGetPersons } from "../../../../../shared/routes/person.routes";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { api } from "../../../../utils/api.utils";
import { PAGES } from "../../../components/breadcrumb/Breadcrumb";

const PersonList = () => {
  const [persons, setPersons] = useState<IResGetPersons>([]);

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await api.get("/admin/persons");

      setPersons(data);
    };
    fetchPersons();
  }, []);

  return (
    <Table
      mt={4}
      data={persons || []}
      columns={{
        name: {
          id: "name",
          size: 100,
          header: () => "Nom complet",
          cell: ({ row }) => {
            const { nom, prenom, _id } = row.original;
            return nom || prenom ? `${nom ?? ""} ${prenom ?? ""}` : _id;
          },
        },
        email: {
          id: "email",
          size: 100,
          header: () => "Email",
        },
        civility: {
          id: "civility",
          size: 100,
          header: () => "Civilité",
        },
        organisation_id: {
          id: "organisation_id",
          size: 100,
          header: () => "Organisation",
          cell: ({ row }) => {
            const { organisation } = row.original;

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
        source: {
          id: "source",
          size: 100,
          header: () => "Source",
          cell: ({ row }) => row.original._meta?.source ?? "",
        },
        actions: {
          id: "actions",
          size: 25,
          header: () => "",
          cell: ({ row }) => (
            <Link href={`/admin/personnes/${row.original._id}`}>
              <ArrowRightLine w="1w" />
            </Link>
          ),
        },
      }}
    />
  );
};

export default PersonList;
