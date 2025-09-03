import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useMutation } from "@tanstack/react-query";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { captureException } from "@sentry/nextjs";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { canScheduleGenerate } from "shared/mailing-list/mailing-list.utils";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { apiPost } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";

type MailingListResetConfig = {
  mailingList: IMailingListV2Json;
  readonly: boolean;
};

const modal = createModal({
  id: "reset-config-modal",
  isOpenedByDefault: false,
});

export function MailingListResetConfig({ mailingList, readonly }: MailingListResetConfig) {
  const { error, isPending, isError, mutateAsync } = useMutation({
    mutationFn: async () => {
      await apiPost("/_private/mailing-list/:id/reset", {
        params: { id: mailingList._id },
        body: { status: "parse:success" },
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

  if (!readonly) {
    return null;
  }

  const canReset = readonly && canScheduleGenerate(mailingList);

  return (
    <>
      <modal.Component
        title="Réinitialiser la configuration"
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
          title="Êtes-vous sûr de vouloir réinitialiser la configuration ? "
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
        title="La configuration ne peut pas être modifiée"
        buttonProps={{
          children: "Réinitialiser la configuration",
          ...modal.buttonProps,
          size: "large",
          priority: "secondary",
          disabled: !canReset || isPending,
        }}
      >
        {canReset
          ? "La liste est déjà cofigurée, vous pouvez la réinitialiser pour éditer la configuration à nouveau."
          : "La liste est en cours de traitement, vous ne pouvez pas éditer ou réinitialiser la configuration pour le moment."}
      </CallOut>
    </>
  );
}
