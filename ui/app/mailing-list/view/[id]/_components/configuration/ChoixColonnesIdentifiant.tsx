import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { MailingListSourceSample } from "@/app/mailing-list/view/[id]/_components/MailingListSourceSample";
import { useMailingListConfigMutation } from "@/app/mailing-list/view/[id]/_hooks/useMailingListConfigMutation";
import { useMailingListSample } from "@/app/mailing-list/view/[id]/_hooks/useMailingListSample";
import MailingListSectionRow from "@/app/liste-diffusion/nouvelle-liste/components/MailingListSectionRow";
import MailingListSectionCell from "@/app/liste-diffusion/nouvelle-liste/components/MailingListSectionCell";
import EmailSample from "@/app/liste-diffusion/nouvelle-liste/components/EmailSample";

interface Props {
  onNext: () => void;
  mailingList: IMailingListV2Json;
  readonly: boolean;
}

interface IIdentifierColumnForm {
  email: string;
}

export function ChoixColonnesIdentifiant({ onNext, mailingList, readonly }: Props) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
  } = useForm<IIdentifierColumnForm>({
    disabled: readonly,
    defaultValues: { email: mailingList.config.email_column },
  });

  const watchEmail = watch("email");

  const { mutateAsync, isError: isMutationError, error: mutationError } = useMailingListConfigMutation();

  const onSubmit = useCallback(
    async (data: IIdentifierColumnForm) => {
      await mutateAsync({
        params: {
          id: mailingList._id,
        },
        body: {
          email_column: data.email,
        },
      });
      onNext();
    },
    [mailingList._id, onNext, mutateAsync]
  );

  const sampleResult = useMailingListSample(mailingList._id);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow>
          <MailingListSectionCell>Informations demandées</MailingListSectionCell>
          <MailingListSectionCell>En-têtes des colonnes (fichier source)</MailingListSectionCell>
          <MailingListSectionCell>3 premières lignes de données</MailingListSectionCell>
        </MailingListSectionRow>

        <MailingListSectionRow>
          <MailingListSectionCell>
            Email
            <Typography color={fr.colors.decisions.text.label.redMarianne.default} component="span">
              *
            </Typography>
          </MailingListSectionCell>
          <MailingListSectionCell>
            <Select
              label=""
              state={errors.email ? "error" : "default"}
              stateRelatedMessage={errors.email?.message}
              nativeSelectProps={{
                ...register("email", {
                  required: "Obligatoire",
                  validate: (value) => {
                    return value && mailingList.source.columns.includes(value);
                  },
                }),
              }}
            >
              <option value="" disabled hidden>
                Choisir la colonne email
              </option>
              {mailingList.source.columns.map((column) => (
                <option key={column}>{column}</option>
              ))}
            </Select>
          </MailingListSectionCell>
          <MailingListSectionCell>
            <EmailSample sample={sampleResult.data ?? []} emailKey={watchEmail} isLoading={sampleResult.isLoading} />
          </MailingListSectionCell>
        </MailingListSectionRow>

        <MailingListSourceSample mailingList={mailingList} />

        <Box>
          {isMutationError && (
            <Box color="error" my={2}>
              <Alert
                title=" Une erreur est survenue lors de la configuration"
                description={mutationError.message}
                severity="error"
              />
            </Box>
          )}
          <Box sx={{ display: "flex", gap: fr.spacing("4w"), justifyContent: "flex-end" }}>
            {readonly && (
              <Button type="button" onClick={onNext}>
                Continuer
              </Button>
            )}
            {!readonly && (
              <Button type="submit" disabled={isSubmitting}>
                Continuer
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
}
