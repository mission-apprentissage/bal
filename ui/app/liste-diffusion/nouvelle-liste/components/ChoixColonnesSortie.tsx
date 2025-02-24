import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { Box, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import {
  isComputedColumns,
  MAILING_LIST_COMPUTED_COLUMNS,
  MAILING_LIST_COMPUTED_COLUMNS_KEYS,
} from "shared/constants/mailingList";
import { IDocumentContentJson } from "shared/models/documentContent.model";
import { IMailingListJson } from "shared/models/mailingList.model";

import ToggleSwitchInput from "../../../../components/form/ToggleSwitchInput";
import { apiPost } from "../../../../utils/api.utils";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";
import PreviewColonnesSortie from "./PreviewColonnesSortie";
import Sample from "./Sample";
import WarningEmail from "./WarningEmail";

interface Props {
  onSuccess: (data: IBody<IPostRoutes["/mailing-list"]>) => void;
  onCancel: () => void;
  source: string;
  campaignName: string;
  columns: string[];
  identifierColumns: string[];
  email: string;
  secondaryEmail?: string;
  sample: IDocumentContentJson[];
  mailingList?: IMailingListJson;
  trainingColumns: IMailingListJson["training_columns"];
}

type Route = IBody<IPostRoutes["/mailing-list"]>;
type FormValues = Route;

const ChoixColonnesSortie: FC<Props> = ({
  onSuccess,
  onCancel,
  columns,
  identifierColumns,
  trainingColumns,
  campaignName,
  source,
  email,
  secondaryEmail,
  sample,
  mailingList,
}) => {
  const outputColumnDefaultValues = [{ output: "email", column: email, simple: true }];

  for (const identifierColumn of identifierColumns) {
    outputColumnDefaultValues.push({
      output: identifierColumn,
      column: identifierColumn,
      simple: true,
    });
  }

  for (const column of columns) {
    if (column !== email && !identifierColumns.includes(column)) {
      outputColumnDefaultValues.push({
        output: column,
        column,
        simple: true,
      });
    }
  }

  if (mailingList) {
    const outputColumns = mailingList?.output_columns
      //filter already selected columns
      .filter((c) => !outputColumnDefaultValues.find((oc) => oc.column === c.column));

    outputColumnDefaultValues.push(...outputColumns);
  }

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      source,
      campaign_name: campaignName,
      identifier_columns: identifierColumns,
      output_columns: outputColumnDefaultValues,
      training_columns: trainingColumns,
    },
    values: {
      email,
      secondary_email: secondaryEmail,
      source,
      campaign_name: campaignName,
      identifier_columns: identifierColumns,
      output_columns: outputColumnDefaultValues,
      training_columns: trainingColumns,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "output_columns",
  });

  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    await apiPost("/mailing-list", { body: data });

    onSuccess(data);
  };

  const outputColumns = watch("output_columns");

  return (
    <Box>
      <Typography mb={4}>
        Sélectionnez le ou les champs du fichier d’entrée que vous voulez retrouver dans votre fichier de sortie.
        (Exemple : libellé établissement et libellé formation).
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow>
          <MailingListSectionCell xs={3}>Nom de sortie</MailingListSectionCell>
          <MailingListSectionCell xs={3}>En-têtes des colonnes (fichier source)</MailingListSectionCell>
          <MailingListSectionCell xs={3}>Fusionner les valeurs</MailingListSectionCell>
          <MailingListSectionCell xs={3}>3 premières lignes de données</MailingListSectionCell>
        </MailingListSectionRow>
        {fields.map((field, index) => {
          const { onChange, ...columnField } = register(`output_columns.${index}.column`, {
            required: "Obligatoire",
            validate: (value) => {
              return value && [...columns, ...MAILING_LIST_COMPUTED_COLUMNS_KEYS].includes(value);
            },
          });
          const selectColumnDisabled = index === 0 || isSubmitting;
          const outputDisabled = index === 0 || isComputedColumns(outputColumns[index].column) || isSubmitting;

          const groupedDisabled =
            isComputedColumns(outputColumns[index].column) ||
            identifierColumns.includes(outputColumns[index].column) ||
            isSubmitting;

          return (
            <MailingListSectionRow key={field.id}>
              <MailingListSectionCell xs={3}>
                <Select
                  label=""
                  disabled={selectColumnDisabled}
                  state={errors.output_columns?.[index]?.column?.message ? "error" : "default"}
                  stateRelatedMessage={errors.output_columns?.[index]?.column?.message}
                  nativeSelectProps={{
                    onChange: (e) => {
                      const { value } = e.target;

                      if (isComputedColumns(value)) {
                        const columns = MAILING_LIST_COMPUTED_COLUMNS[value].columns;
                        setValue(`output_columns.${index}.output`, columns.map((c) => c.output).join(", "));
                        setValue(`output_columns.${index}.simple`, true);
                      } else {
                        setValue(`output_columns.${index}.output`, value);
                      }

                      onChange(e);
                    },
                    ...columnField,
                  }}
                >
                  <option value="" disabled hidden>
                    Colonne
                  </option>
                  <optgroup label="BAL">
                    {MAILING_LIST_COMPUTED_COLUMNS_KEYS.map((key) => (
                      <option key={key} value={key} disabled={!!outputColumns.find((c) => c.column === key)}>
                        {key}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={source}>
                    {columns.map((column) => (
                      <option key={column} disabled={!!outputColumns.find((c) => c.column === column)} value={column}>
                        {column}
                        {index === 0 && secondaryEmail && `, ${secondaryEmail}`}
                      </option>
                    ))}
                  </optgroup>
                </Select>
              </MailingListSectionCell>
              <MailingListSectionCell xs={3}>
                <Input
                  label=""
                  state={errors.output_columns?.[index]?.output?.message ? "error" : "default"}
                  stateRelatedMessage={errors.output_columns?.[index]?.output?.message}
                  disabled={outputDisabled}
                  nativeInputProps={{
                    placeholder: "Nom de sortie",
                    ...register(`output_columns.${index}.output`, {
                      required: "Obligatoire",
                    }),
                  }}
                />
              </MailingListSectionCell>
              <MailingListSectionCell xs={3}>
                {index !== 0 && (
                  <>
                    <ToggleSwitchInput
                      control={control}
                      {...register(`output_columns.${index}.simple` as const)}
                      toggleSwitchProps={{
                        showCheckedHint: false,
                        disabled: groupedDisabled,
                        label: (
                          <Typography whiteSpace="nowrap">
                            Fusionner les valeurs
                            <Tooltip
                              title={`En cochant l'option "fusionner", les lignes ayant le même identifiant seront fusionnées en conservant la dernière valeur de la colonne. Si l'option "fusionner" n'est pas choisie le logiciel créera des colonnes de même intitulé succédées d'un "_".`}
                            >
                              <Box component="i" ml={1} className="ri-information-line" />
                            </Tooltip>
                          </Typography>
                        ),
                        inputTitle: "Fusionner les valeurs",
                      }}
                    />
                  </>
                )}
              </MailingListSectionCell>
              <MailingListSectionCell xs={3}>
                <Sample sample={sample} column={outputColumns[index].column} />
                {index !== 0 && (
                  <Box ml="auto">
                    <Button
                      iconId="ri-delete-bin-line"
                      onClick={() => remove(index)}
                      priority="tertiary no outline"
                      title="Supprimer"
                    />
                  </Box>
                )}
              </MailingListSectionCell>
            </MailingListSectionRow>
          );
        })}

        <Box display="flex" justifyContent="center">
          <Button priority="secondary" type="button" onClick={() => append({ output: "", column: "", simple: true })}>
            + Ajouter un champ
          </Button>
        </Box>

        <PreviewColonnesSortie columns={outputColumns} />

        <WarningEmail email={email} sample={sample} />

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

export default ChoixColonnesSortie;
