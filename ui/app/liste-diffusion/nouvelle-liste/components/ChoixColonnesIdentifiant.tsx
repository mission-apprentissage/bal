import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Select from "@codegouvfr/react-dsfr/Select";
import { Box, Tooltip, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { IDocumentContentJson } from "shared/models/documentContent.model";
import { IMailingListJson } from "shared/models/mailingList.model";

import { getFormattedSample } from "../mailingLists.utils";
import EmailSample from "./EmailSample";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";

interface Props {
  onSuccess: (
    data: Pick<IBody<IPostRoutes["/mailing-list"]>, "email" | "secondary_email" | "identifier_columns">
  ) => void;
  columns: string[];
  sample: IDocumentContentJson[];
  onCancel: () => void;
  mailingList?: IMailingListJson;
}

interface IIdentifierColumnForm {
  email: string;
  secondary_email: string;
  identifier_columns: { name: string }[];
}

const ChoixColonnesIdentifiant: FC<Props> = ({ onSuccess, columns, onCancel, sample, mailingList }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    watch,
    setValue,
  } = useForm<IIdentifierColumnForm>({
    defaultValues: { identifier_columns: [], email: "", secondary_email: "" },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "identifier_columns",
  });

  useEffect(() => {
    if (mailingList) {
      setValue("email", mailingList.email);
      setValue("secondary_email", mailingList.secondary_email ?? "");
      const identifierColumns = mailingList?.identifier_columns?.map((ic) => ({ name: ic }));
      setValue("identifier_columns", identifierColumns);
    }
  }, [mailingList, columns]);

  const watchEmail = watch("email");
  const watchSecondaryEmail = watch("secondary_email");
  const watchIdentifierColumns = watch("identifier_columns");

  const onSubmit = async (data: IIdentifierColumnForm) => {
    const identifierColumns = data.identifier_columns.map((ic) => ic.name);
    onSuccess({ ...data, identifier_columns: identifierColumns });
  };

  return (
    <Box>
      {columns.length === 0 && (
        <Box my={2}>
          <Alert
            description="Il est nécessaire de sélectionner une source à l'étape 1 pour continuer."
            severity="info"
            title="Sélectionner une source"
          />
        </Box>
      )}
      <Typography mb={4}>
        Les champs obligatoires serviront comme identifiants uniques. Les champs de courriel facultatifs correspondent
        aux courriels supplémentaires à qui la campagne sera envoyée.
      </Typography>
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
                    return value && columns.includes(value);
                  },
                }),
              }}
            >
              <option value="" disabled hidden>
                Choisir la colonne email
              </option>
              {columns.map((column) => (
                <option key={column}>{column}</option>
              ))}
            </Select>
          </MailingListSectionCell>
          <MailingListSectionCell>
            {watchEmail && <EmailSample sample={sample} emailKey={watchEmail} />}
          </MailingListSectionCell>
          <MailingListSectionCell>ou</MailingListSectionCell>
          <MailingListSectionCell></MailingListSectionCell>
          <MailingListSectionCell></MailingListSectionCell>
          <MailingListSectionCell>
            Email secondaire
            <Tooltip title="L'email secondaire est facultatif. Une adresse email secondaire différente dupliquera la ligne dans le fichier de sortie.">
              <Box component="i" ml={1} className="ri-information-line" />
            </Tooltip>
          </MailingListSectionCell>
          <MailingListSectionCell>
            <Select
              label=""
              state={errors.secondary_email ? "error" : "default"}
              stateRelatedMessage={errors.secondary_email?.message}
              nativeSelectProps={{ ...register("secondary_email") }}
            >
              <option value="">Choisir la colonne email secondaire</option>
              {columns.map((column) => (
                <option key={column} disabled={watchEmail === column}>
                  {column}
                </option>
              ))}
            </Select>
          </MailingListSectionCell>
          <MailingListSectionCell>
            {watchSecondaryEmail && <EmailSample sample={sample} emailKey={watchSecondaryEmail} />}
          </MailingListSectionCell>
        </MailingListSectionRow>

        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id}>
            <MailingListSectionCell />
            <MailingListSectionCell>
              <Select
                label=""
                state={errors.identifier_columns?.[index]?.name?.message ? "error" : "default"}
                stateRelatedMessage={errors.identifier_columns?.[index]?.name?.message}
                nativeSelectProps={{
                  ...register(`identifier_columns.${index}.name`, {
                    required: "Obligatoire",
                    validate: (value) => {
                      return value && columns.includes(value);
                    },
                  }),
                }}
              >
                <option value="" disabled hidden>
                  Colonne
                </option>
                {columns.map((column) => (
                  <option
                    key={column}
                    disabled={[
                      watchEmail,
                      watchSecondaryEmail,
                      ...watchIdentifierColumns.map((ic) => ic.name),
                    ].includes(column)}
                  >
                    {column}
                  </option>
                ))}
              </Select>
            </MailingListSectionCell>
            <MailingListSectionCell>
              {watchIdentifierColumns?.[index]?.name &&
                getFormattedSample(sample, watchIdentifierColumns?.[index]?.name)}

              <Box ml="auto">
                <Button
                  iconId="ri-delete-bin-line"
                  onClick={() => remove(index)}
                  priority="tertiary no outline"
                  title="Supprimer"
                />
              </Box>
            </MailingListSectionCell>
          </MailingListSectionRow>
        ))}
        <Box display="flex" justifyContent="center">
          <Button priority="secondary" type="button" onClick={() => append({ name: "" })}>
            + Ajouter un champ
          </Button>
        </Box>
        <Box>
          <Box mx={2} display="inline-block">
            <Button type="button" priority="tertiary" disabled={isSubmitting} onClick={onCancel}>
              Retour
            </Button>
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Confirmer
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ChoixColonnesIdentifiant;
