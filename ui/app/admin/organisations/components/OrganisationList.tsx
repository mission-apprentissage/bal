import Link from "next/link";
import { useEffect, useState } from "react";

import { IResGetOrganisations } from "../../../../../shared/routes/organisation.routes";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { api } from "../../../../utils/api.utils";

const OrganisationList = () => {
  const [organisations, setOrganisations] = useState<IResGetOrganisations>([]);

  useEffect(() => {
    const fetchOrganisations = async () => {
      const { data } = await api.get("/admin/organisations");

      setOrganisations(data);
    };
    fetchOrganisations();
  }, []);

  return (
    <Table
      mt={4}
      data={organisations || []}
      columns={{
        nom: {
          size: 100,
          header: () => "Nom",
        },
        email_domains: {
          size: 100,
          header: () => "Domaines",
          cell: ({ row }) => row.original.email_domains.join(", "),
        },
        actions: {
          size: 25,
          header: () => "",
          cell: ({ row }) => (
            <Link href={`/admin/organisations/${row.original._id}`}>
              <ArrowRightLine w="1w" />
            </Link>
          ),
        },
      }}
    />
  );
};

export default OrganisationList;
