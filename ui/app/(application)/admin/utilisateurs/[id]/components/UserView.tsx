import { Typography } from "@mui/material";
import InfoDetails from "components/infoDetails/InfoDetails";
import { FC } from "react";
import { IUserPublic } from "shared/models/user.model";
import { formatDate } from "utils/date.utils";

import Breadcrumb, { PAGES } from "../../../../components/breadcrumb/Breadcrumb";

interface Props {
  user: IUserPublic;
}

const UserView: FC<Props> = ({ user }) => {
  return (
    <>
      <Breadcrumb pages={[PAGES.adminUsers(), PAGES.adminUserView(user._id)]} />
      <Typography variant="h2" gutterBottom>
        Fiche utilisateur
      </Typography>

      <InfoDetails
        data={user}
        rows={{
          _id: {
            header: () => "Identifiant",
          },
          email: {
            header: () => "Email",
          },
          is_admin: {
            header: () => "Administrateur",
            cell: ({ is_admin }) => (is_admin ? "Oui" : "Non"),
          },
          api_key_used_at: {
            header: () => "Dernière utilisation API",
            cell: ({ api_key_used_at }) => {
              return api_key_used_at ? formatDate(api_key_used_at, "PPP à p") : "Jamais";
            },
          },
        }}
      />
    </>
  );
};

export default UserView;
