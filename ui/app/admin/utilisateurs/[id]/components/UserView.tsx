"use client";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { IUserWithPersonPublic } from "shared/models/user.model";
import type { IResErrorJson } from "shared/routes/common.routes";

import InfoDetails from "../../../../../components/infoDetails/InfoDetails";
import Toast, { useToast } from "../../../../../components/toast/Toast";
import { apiDelete } from "../../../../../utils/api.utils";
import { formatDate } from "../../../../../utils/date.utils";
import { queryClient } from "../../../../../utils/query.utils";
import Breadcrumb, { PAGES } from "../../../../components/breadcrumb/Breadcrumb";
import { getPersonDisplayName } from "../../../personnes/persons.format";

interface Props {
  user: IUserWithPersonPublic;
}

const modal = createModal({
  id: "delete-user-modal",
  isOpenedByDefault: false,
});

const UserView: FC<Props> = ({ user }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, setToast, handleClose } = useToast();
  const { push } = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiDelete("/admin/users/:id", { params: { id: user._id } });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      push(PAGES.adminUsers().path);
    } catch (error) {
      console.error(error);
      const serverError = error as IResErrorJson;
      setToast({
        severity: "error",
        message: `Une erreur est survenue lors de la suppression du fichier${
          serverError?.message ? ` : ${serverError.message}` : ""
        }`,
      });
    } finally {
      setIsDeleting(false);
      modal.close();
    }
  };

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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

        <Button
          key="delete"
          iconId="ri-delete-bin-line"
          onClick={() => {
            modal.open();
          }}
          priority="tertiary"
          title="Supprimer"
          style={{
            color: fr.colors.decisions.text.actionHigh.redMarianne.default,
          }}
        >
          Supprimer
        </Button>
      </Box>
      <modal.Component
        title="Supprimer l'utilisateur"
        buttons={[
          {
            children: "Annuler",
            disabled: isDeleting,
          },
          {
            iconId: "ri-delete-bin-line",
            onClick: handleDelete,
            children: "Supprimer l'utilisateur",
            disabled: isDeleting,
            doClosesModal: false,
            style: {
              backgroundColor: fr.colors.decisions.text.actionHigh.redMarianne.default,
            },
          },
        ]}
      >
        Vous allez supprimer l'utilisateur {user.email}. Cette action est irréversible.
      </modal.Component>
      <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
    </>
  );
};

export default UserView;
