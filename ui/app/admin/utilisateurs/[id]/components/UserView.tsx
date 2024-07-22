import Button from "@codegouvfr/react-dsfr/Button";
import { Typography } from "@mui/material";
import { FC } from "react";
import { IUserWithPersonPublic } from "shared/models/user.model";

import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import { formatDate } from "../../../../../utils/date.utils";
import Breadcrumb, { PAGES } from "../../../../components/breadcrumb/Breadcrumb";
import { getPersonDisplayName } from "../../../personnes/persons.format";

interface Props {
  user: IUserWithPersonPublic;
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
          person: {
            header: () => "Personne",
            cell: ({ person }) => {
              if (!person) return null;

              return (
                <Button
                  iconId="fr-icon-arrow-right-line"
                  iconPosition="right"
                  linkProps={{
                    href: PAGES.adminViewPerson(person._id).path,
                  }}
                  priority="tertiary no outline"
                >
                  {getPersonDisplayName(person)}
                </Button>
              );
            },
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

      <Button
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
        linkProps={{
          href: PAGES.adminListeDiffusion(user._id).path,
        }}
        priority="tertiary"
      >
        Listes de diffusion
      </Button>
    </>
  );
};

export default UserView;
