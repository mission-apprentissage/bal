import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useMutation } from "@tanstack/react-query";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { captureException } from "@sentry/nextjs";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { canResetMailingList } from "shared/mailing-list/mailing-list.utils";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { apiPost } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";

type MailingListResetSourceProps = {
  mailingList: IMailingListV2Json;
};

const modal = createModal({
  id: "reset-config-parse",
  isOpenedByDefault: false,
});

export function MailingListResetSource({ mailingList }: MailingListResetSourceProps) {
  const { error, isPending, isError, mutateAsync } = useMutation({
    mutationFn: async () => {
      await apiPost("/_private/mailing-list/:id/reset", {
        params: { id: mailingList._id },
        body: { status: "initial" },
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"], exact: true }),
        queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list", mailingList._id], exact: true }),
      ]);
    },
    onError: (error) => {
      captureException(error);
    },
  });

  if (mailingList.status === "initial") {
    return null;
  }

  const canReset = canResetMailingList(mailingList);

  return (
    <>
      <modal.Component
        title="Réinitialiser la liste"
        buttons={[
          {
            doClosesModal: true,
            children: "Annuler",
          },
          {
            doClosesModal: false,
            children: "Réinitialiser",
            onClick: async () => {
              await mutateAsync();
              modal.close();
            },
          },
        ]}
        size="large"
      >
        <Alert
          title="Êtes-vous sûr de vouloir réinitialiser la liste de diffusion ? "
          description="Cette action est irréversible."
          severity="warning"
        />

        {isError && (
          <Alert
            title="Une erreur est survenue lors de la réinitialisation"
            description={error.message}
            severity="error"
          />
        )}
      </modal.Component>
      <CallOut
        title="Les paramètres d'extractions ne peuvent pas être modifiés"
        buttonProps={{
          children: "Réinitialiser la liste",
          ...modal.buttonProps,
          size: "large",
          priority: "secondary",
          disabled: !canReset || isPending,
        }}
      >
        {canReset
          ? "Vous pouvez la réinitialiser pour changer les paramètres. Seul le fichier source ne peut pas être modifié."
          : "La liste est en cours de traitement, vous ne pouvez pas la réinitialiser pour le moment."}
      </CallOut>
    </>
  );
}
