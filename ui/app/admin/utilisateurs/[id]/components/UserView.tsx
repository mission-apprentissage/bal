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
import { getPersonDisplayName } from "../../../personnes/persons.format";

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
            cell: ({ person }) => {
              if (!person) return null;

              return (
                <Text as={Link} href={PAGES.adminViewPerson(person._id).path}>
                  {getPersonDisplayName(person)}
                </Text>
              );
            },
          },
          api_key_used_at: {
            header: () => "Dernière utilisation API",
            cell: ({ api_key_used_at }) => {
              return api_key_used_at
                ? formatDate(api_key_used_at, "PPP à p")
                : "Jamais";
            },
          },
        }}
      />
    </>
  );
};

export default UserView;
