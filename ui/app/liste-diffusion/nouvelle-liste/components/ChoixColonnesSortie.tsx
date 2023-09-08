import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { Box, Tooltip, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import ToggleSwitchInput from "../../../../components/form/ToggleSwitchInput";
import { apiPost } from "../../../../utils/api.utils";
import { getDataFromSample } from "../mailingLists.utils";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";

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
      output_columns: [
        { output: "email", column: email, grouped: false },
        {
          output: "",
          column: "",
          grouped: false,
        },
      ],
    },
    values: {
      email,
      secondary_email: secondaryEmail,
      source,
      campaign_name: campaignName,
      identifier_columns: identifierColumns,
      output_columns: [
        { output: "email", column: email, grouped: false },
        {
          output: "",
          column: "",
          grouped: false,
        },
      ],
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

  const webhookLbaColumnIndex = outputColumns.findIndex((c) => c.column === WEBHOOK_LBA);

  useEffect(() => {
    if (webhookLbaColumnIndex !== -1) {
      setValue(
        `output_columns.${webhookLbaColumnIndex}.output`,
        "lien_lba, lien_prdv"
      );
      setValue(`output_columns.${webhookLbaColumnIndex}.grouped`, true);
    }
  }, [webhookLbaColumnIndex]);

  return (
    <Box>
      <Typography mb={4}>
        Sélectionnez le ou les champs du fichier d’entrée que vous voulez
        retrouver dans votre fichier de sortie. (Exemple : libellé établissement
        et libellé formation).
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow>
          <MailingListSectionCell xs={3}>Nom de sortie</MailingListSectionCell>
          <MailingListSectionCell xs={3}>
            En-têtes des colonnes (fichier source)
          </MailingListSectionCell>
          <MailingListSectionCell xs={3}>Ne pas écraser</MailingListSectionCell>
          <MailingListSectionCell xs={3}>
            3 premières lignes de données
          </MailingListSectionCell>
        </MailingListSectionRow>
        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id}>
            <MailingListSectionCell xs={3}>
              <Input
                label=""
                state={
                  errors.output_columns?.[index]?.output?.message
                    ? "error"
                    : "default"
                }
                stateRelatedMessage={
                  errors.output_columns?.[index]?.output?.message
                }
                disabled={
                  index === 0 ||
                  outputColumns[index].column === WEBHOOK_LBA ||
                  isSubmitting
                }
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
                state={
                  errors.output_columns?.[index]?.column?.message
                    ? "error"
                    : "default"
                }
                stateRelatedMessage={
                  errors.output_columns?.[index]?.column?.message
                }
                nativeSelectProps={{
                  ...register(`output_columns.${index}.column`, {
                    required: "Obligatoire",
                    validate: (value) => {
                      return value && [...columns, WEBHOOK_LBA].includes(value);
                    },
                  }),
                }}
              >
                <option value="" disabled hidden>
                  Colonne
                </option>
                <optgroup label="BAL">
                  <option
                    value={WEBHOOK_LBA}
                    disabled={
                      !!outputColumns.find((c) => c.column === WEBHOOK_LBA)
                    }
                  >
                    {WEBHOOK_LBA}
                  </option>
                </optgroup>
                <optgroup label={source}>
                  {columns.map((column) => (
                    <option
                      key={column}
                      disabled={
                        !!outputColumns.find((c) => c.column === column)
                      }
                      value={column}
                    >
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
                      disabled:
                        outputColumns[index].column === WEBHOOK_LBA ||
                        isSubmitting,
                      label: (
                        <Typography whiteSpace="nowrap">
                          Ne pas écraser
                          <Tooltip title="Ajoutera des colonnes prefixées par _ pour chacun des champs du groupe NE_PAS_ECRASER">
                            <Box
                              component="i"
                              ml={1}
                              className="ri-information-line"
                            />
                          </Tooltip>
                        </Typography>
                      ),
                      inputTitle: "Ne pas écraser",
                    }}
                  />
                </>
              )}
            </MailingListSectionCell>
            <MailingListSectionCell xs={3}>
              {outputColumns[index].column &&
                getDataFromSample(sample, outputColumns[index].column)}
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
        ))}

        <Box display="flex" justifyContent="center">
          <Button
            priority="secondary"
            onClick={() => append({ output: "", column: "", grouped: false })}
          >
            + Ajouter un champ
          </Button>
        </Box>

        <Box>
          <Box mx={2} display="inline-block">
            <Button
              priority="tertiary"
              disabled={isSubmitting}
              onClick={onCancel}
            >
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
