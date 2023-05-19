"use client";

import { Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";

import { IResGetUser } from "../../../../../../shared/routes/user.routes";
import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import { formatDate } from "../../../../../utils/date.utils";
import Breadcrumb, {
  PAGES,
} from "../../../../components/breadcrumb/Breadcrumb";

interface Props {
  user: IResGetUser;
}

const UserView: FC<Props> = ({ user }) => {
  return (
    <>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.adminUsers(),
          PAGES.adminUserView(user._id as string),
        ]}
      />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Fiche utilisateur
      </Heading>

      <InfoDetails
        data={user}
        rows={{
          _id: {
            header: () => "Identifiant",
          },
          email: {
            header: () => "Email",
          },
          person: {
            header: () => "Personne",
            cell: ({ value }) => {
              if (!value) return null;

              return (
                <Text as={Link} href={PAGES.adminViewPerson(value._id).path}>
                  {value?.nom || value?.prenom
                    ? `${value?.nom ?? ""} ${value?.prenom ?? ""}`
                    : value._id}
                </Text>
              );
            },
          },
          api_key_used_at: {
            header: () => "Dernière utilisation API",
            cell: ({ value }) => {
              return value ? formatDate(value, "PPP à p") : "Jamais";
            },
          },
        }}
      />
    </>
  );
};

export default UserView;
