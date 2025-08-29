import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Box, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  isColumnReserved,
  MAILING_LIST_COMPUTED_COLUMNS,
  MAILING_LIST_COMPUTED_COLUMNS_KEYS,
} from "shared/constants/mailingList";
import type { IMailingListComputedColumnsKeys } from "shared/constants/mailingList";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import MailingListSectionRow from "@/app/liste-diffusion/nouvelle-liste/components/MailingListSectionRow";
import MailingListSectionCell from "@/app/liste-diffusion/nouvelle-liste/components/MailingListSectionCell";
import Sample from "@/app/liste-diffusion/nouvelle-liste/components/Sample";
import { useMailingListSample } from "@/app/mailing-list/view/[id]/_hooks/useMailingListSample";
import WarningEmail from "@/app/liste-diffusion/nouvelle-liste/components/WarningEmail";
import { useMailingListConfigMutation } from "@/app/mailing-list/view/[id]/_hooks/useMailingListConfigMutation";
import PreviewColonnesSortie from "@/app/mailing-list/view/[id]/_components/PreviewColonnesSortie";
import ToggleSwitchInput from "@/components/form/ToggleSwitchInput";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  mailingList: IMailingListV2Json;
  readonly: boolean;
}

type FormValues = {
  output_columns: FlatColumnConfig[];
};

type FlatColumnConfig = {
  input: `source:${string}` | `computed:${IMailingListComputedColumnsKeys}`;
  output: string;
  simple: boolean;
};

function getInputFlatValue(
  input: { type: "source"; name: string } | { type: "computed"; name: IMailingListComputedColumnsKeys }
): `source:${string}` | `computed:${IMailingListComputedColumnsKeys}` {
  return input.type === "source" ? `${input.type}:${input.name}` : `${input.type}:${input.name}`;
}

function parseInputFlatValue(
  input: `source:${string}` | `computed:${IMailingListComputedColumnsKeys}`
): { type: "source"; name: string } | { type: "computed"; name: IMailingListComputedColumnsKeys } {
  const [type, name] = input.split(":");
  if (type === "computed") {
    return {
      type: "computed",
      name: name as IMailingListComputedColumnsKeys,
    };
  }
  return {
    type: "source",
    name,
  };
}

function flattenOutputColumns(outputColumns: IMailingListV2Json["config"]["output_columns"]): FlatColumnConfig[] {
  return outputColumns.map((col) => {
    return {
      input: getInputFlatValue(col.input),
      output: col.output,
      simple: col.simple,
    };
  });
}

function unflattenOutputColumns(outputColumns: FlatColumnConfig[]): IMailingListV2Json["config"]["output_columns"] {
  return outputColumns.map((col) => {
    const input = parseInputFlatValue(col.input);
    return {
      input,
      output: col.output,
      simple: col.simple,
    };
  });
}

export function ChoixColonnesSortie({ mailingList, onPrev, onNext, readonly }: Props) {
  const sampleResult = useMailingListSample(mailingList._id);

  const defaultValues = useMemo((): FormValues => {
    return {
      output_columns: flattenOutputColumns(mailingList.config.output_columns),
    };
  }, [mailingList.config.output_columns]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues,
    disabled: readonly,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "output_columns",
  });

  const { mutateAsync, isError: isMutationError, error: mutationError } = useMailingListConfigMutation();

  const onSubmit = async (data: FormValues) => {
    await mutateAsync({
      params: { id: mailingList._id },
      body: { output_columns: unflattenOutputColumns(data.output_columns) },
    });

    onNext();
  };

  const outputColumnsFlat = watch("output_columns");
  const outputColumns = unflattenOutputColumns(outputColumnsFlat);

  return (
    <Box>
      <Typography mb={4}>
        Sélectionnez le ou les champs du fichier d’entrée que vous voulez retrouver dans votre fichier de sortie.
        (Exemple : libellé établissement et libellé formation).
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow>
          <MailingListSectionCell size={{ xs: 3 }}>Colonne source</MailingListSectionCell>
          <MailingListSectionCell size={{ xs: 3 }}>Nom de sortie</MailingListSectionCell>
          <MailingListSectionCell size={{ xs: 3 }}>Fusionner les valeurs</MailingListSectionCell>
          <MailingListSectionCell size={{ xs: 3 }}>3 premières lignes de données</MailingListSectionCell>
        </MailingListSectionRow>
        <MailingListSectionRow>
          <MailingListSectionCell size={{ xs: 3 }}>
            <Select
              label=""
              disabled
              nativeSelectProps={{
                value: "email",
              }}
            >
              <option value="email" disabled hidden>
                {mailingList.config.email_column}
              </option>
            </Select>
          </MailingListSectionCell>
          <MailingListSectionCell size={{ xs: 3 }}>
            <Input
              label=""
              disabled
              nativeInputProps={{
                value: "email",
              }}
            />
          </MailingListSectionCell>
          <MailingListSectionCell size={{ xs: 3 }}></MailingListSectionCell>
          <MailingListSectionCell size={{ xs: 3 }}>
            <Sample sample={sampleResult.data ?? []} column={mailingList.config.email_column} />
          </MailingListSectionCell>
        </MailingListSectionRow>
        {fields.map((field, index) => {
          const { onChange, ...columnField } = register(`output_columns.${index}.input`, {
            required: "Obligatoire",
            validate: (value) => {
              if (!value) return "Obligatoire";
              if (value === getInputFlatValue({ type: "source", name: mailingList.config.email_column })) {
                return "La colonne d'indentification est déjà configurée";
              }

              for (let i = 0; i < index; i++) {
                if (outputColumnsFlat[i].input === value) {
                  return "La colonne source est déjà utilisée";
                }
              }
            },
            deps: outputColumnsFlat
              .map((_c, i): `output_columns.${number}.input` | null => (i > index ? `output_columns.${i}.input` : null))
              .filter((c) => c !== null),
          });

          const outputDisabled = outputColumns[index].input.type === "computed" || isSubmitting;
          const groupedDisabled = outputColumns[index].input.type === "computed" || isSubmitting;

          return (
            <MailingListSectionRow key={field.id}>
              <MailingListSectionCell size={{ xs: 3 }}>
                <Select
                  label=""
                  disabled={isSubmitting}
                  state={errors.output_columns?.[index]?.input?.message ? "error" : "default"}
                  stateRelatedMessage={errors.output_columns?.[index]?.input?.message}
                  nativeSelectProps={{
                    onChange: async (e) => {
                      const { value } = e.target;
                      const input = parseInputFlatValue(
                        value as `source:${string}` | `computed:${IMailingListComputedColumnsKeys}`
                      );

                      if (input.type === "computed") {
                        const columns = MAILING_LIST_COMPUTED_COLUMNS[input.name].columns;
                        setValue(`output_columns.${index}.output`, columns.map((c) => c.output).join(", "), {
                          shouldValidate: true,
                        });
                        setValue(`output_columns.${index}.simple`, true);
                      } else {
                        setValue(`output_columns.${index}.output`, input.name, {
                          shouldValidate: true,
                        });
                      }

                      await onChange(e);
                    },
                    ...columnField,
                  }}
                >
                  <option value="source:" disabled hidden>
                    Colonne
                  </option>
                  <optgroup label="BAL">
                    {MAILING_LIST_COMPUTED_COLUMNS_KEYS.map((name) => {
                      const key = getInputFlatValue({ type: "computed", name });
                      return (
                        <option key={key} value={key} disabled={isSubmitting}>
                          {name}
                        </option>
                      );
                    })}
                  </optgroup>
                  <optgroup label="Colonnes de la source">
                    {mailingList.source.columns.map((name) => {
                      const key = getInputFlatValue({ type: "source", name });
                      return (
                        <option
                          key={key}
                          disabled={name === mailingList.config.email_column || isSubmitting}
                          value={key}
                        >
                          {name}
                        </option>
                      );
                    })}
                  </optgroup>
                </Select>
              </MailingListSectionCell>
              <MailingListSectionCell size={{ xs: 3 }}>
                <Input
                  label=""
                  state={errors.output_columns?.[index]?.output?.message ? "error" : "default"}
                  stateRelatedMessage={errors.output_columns?.[index]?.output?.message}
                  disabled={outputDisabled}
                  nativeInputProps={{
                    placeholder: "Nom de sortie",
                    ...register(`output_columns.${index}.output`, {
                      required: "Obligatoire",
                      validate: (value) => {
                        if (!value) return "Obligatoire";

                        for (let i = 0; i < index; i++) {
                          if (outputColumnsFlat[i].output === value) {
                            return "Le nom de sortie est déjà utilisé";
                          }
                        }

                        if (isColumnReserved(value)) {
                          return "Le nom de sortie est réservé";
                        }
                      },
                      deps: outputColumnsFlat
                        .map((_c, i): `output_columns.${number}.output` | null =>
                          i > index ? `output_columns.${i}.output` : null
                        )
                        .filter((c) => c !== null),
                    }),
                  }}
                />
              </MailingListSectionCell>
              <MailingListSectionCell size={{ xs: 3 }}>
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
              </MailingListSectionCell>
              <MailingListSectionCell size={{ xs: 3 }}>
                <Sample sample={sampleResult.data ?? []} column={outputColumnsFlat[index].input} />
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
          );
        })}

        <Box display="flex" justifyContent="center">
          <Button
            priority="secondary"
            type="button"
            disabled={isSubmitting || readonly}
            onClick={() => append({ output: "", input: "source:", simple: true })}
          >
            + Ajouter un champ
          </Button>
        </Box>

        <PreviewColonnesSortie columns={outputColumns} />

        <WarningEmail
          email={mailingList.config.email_column}
          sample={sampleResult.data ?? []}
          isLoading={sampleResult.isLoading}
        />

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
            <Button type="button" priority="tertiary" disabled={isSubmitting} onClick={onPrev}>
              Retour
            </Button>
            {!readonly && (
              <Button type="submit" disabled={isSubmitting}>
                Continuer
              </Button>
            )}
            {readonly && (
              <Button type="button" onClick={onNext}>
                Continuer
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
}
