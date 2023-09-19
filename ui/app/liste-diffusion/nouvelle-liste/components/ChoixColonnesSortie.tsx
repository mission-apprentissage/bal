import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { Box, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import ToggleSwitchInput from "../../../../components/form/ToggleSwitchInput";
import { apiPost } from "../../../../utils/api.utils";
import { getFormattedSample } from "../mailingLists.utils";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";
import PreviewColonnesSortie from "./PreviewColonnesSortie";

const WEBHOOK_LBA = "WEBHOOK_LBA";

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
}

type FormValues = IBody<IPostRoutes["/mailing-list"]>;

const ChoixColonnesSortie: FC<Props> = ({
  onSuccess,
  onCancel,
  columns,
  identifierColumns,
  campaignName,
  source,
  email,
  secondaryEmail,
  sample,
}) => {
  const outputColumnDefaultValues = [{ output: "email", column: email, grouped: true }];

  for (const identifierColumn of identifierColumns) {
    outputColumnDefaultValues.push({ output: identifierColumn, column: identifierColumn, grouped: true });
  }

  outputColumnDefaultValues.push({ output: "", column: "", grouped: false });

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
    },
    values: {
      email,
      secondary_email: secondaryEmail,
      source,
      campaign_name: campaignName,
      identifier_columns: identifierColumns,
      output_columns: outputColumnDefaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "output_columns",
  });

  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    // invert grouped columns
    const outputColumns = data.output_columns.map((column) => ({
      ...column,
      grouped: !column.grouped,
    }));

    const formattedData = {
      ...data,
      output_columns: outputColumns,
    };

    await apiPost("/mailing-list", { body: formattedData });

    onSuccess(formattedData);
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
              return value && [...columns, WEBHOOK_LBA].includes(value);
            },
          });
          return (
            <MailingListSectionRow key={field.id}>
              <MailingListSectionCell xs={3}>
                <Input
                  label=""
                  state={errors.output_columns?.[index]?.output?.message ? "error" : "default"}
                  stateRelatedMessage={errors.output_columns?.[index]?.output?.message}
                  disabled={index === 0 || outputColumns[index].column === WEBHOOK_LBA || isSubmitting}
                  nativeInputProps={{
                    placeholder: "Nom de sortie",
                    ...register(`output_columns.${index}.output`, {
                      required: "Obligatoire",
                    }),
                  }}
                />
              </MailingListSectionCell>
              <MailingListSectionCell xs={3}>
                <Select
                  label=""
                  disabled={index === 0 || isSubmitting}
                  state={errors.output_columns?.[index]?.column?.message ? "error" : "default"}
                  stateRelatedMessage={errors.output_columns?.[index]?.column?.message}
                  nativeSelectProps={{
                    onChange: (e) => {
                      const { value } = e.target;

                      if (value === WEBHOOK_LBA) {
                        setValue(`output_columns.${index}.output`, "lien_lba, lien_prdv");
                        setValue(`output_columns.${index}.grouped`, false);
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
                    <option value={WEBHOOK_LBA} disabled={!!outputColumns.find((c) => c.column === WEBHOOK_LBA)}>
                      {WEBHOOK_LBA}
                    </option>
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
                {index !== 0 && (
                  <>
                    <ToggleSwitchInput
                      control={control}
                      {...register(`output_columns.${index}.grouped` as const)}
                      toggleSwitchProps={{
                        showCheckedHint: false,
                        disabled: outputColumns[index].column === WEBHOOK_LBA || isSubmitting,
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
                {outputColumns[index].column && getFormattedSample(sample, outputColumns[index].column)}
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
          <Button priority="secondary" onClick={() => append({ output: "", column: "", grouped: false })}>
            + Ajouter un champ
          </Button>
        </Box>

        <PreviewColonnesSortie columns={outputColumns} />

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
