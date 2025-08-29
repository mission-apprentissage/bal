import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Box, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IDocumentContentJson } from "shared/models/documentContent.model";
import type { IMailingListJson } from "shared/models/mailingList.model";

import Table from "@/components/table/Table";
import { apiGet } from "@/utils/api.utils";

export interface IChoseSourceForm {
  campaign_name: string;
  source: string;
  sample: IDocumentContentJson[];
  columns: string[];
}

interface Props {
  onSuccess: (data: IChoseSourceForm) => void;
  mailingList?: IMailingListJson;
}

const ChoixSource: FC<Props> = ({ mailingList, onSuccess }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    setValue,
  } = useForm<IChoseSourceForm>();

  useEffect(() => {
    setValue("campaign_name", mailingList?.campaign_name ?? "");
    setValue("source", mailingList?.source ?? "");
  }, [setValue, mailingList]);

  const watchSource = watch("source");

  const { data: types = [] } = useQuery<string[]>({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const data = await apiGet("/documents/types", {});

      return data;
    },
    throwOnError: true,
  });

  const { data: columns = [] } = useQuery<string[]>({
    queryKey: ["documentColumns", watchSource],
    queryFn: async () => {
      if (!watchSource) return [];
      const data = await apiGet("/documents/columns", {
        querystring: { type: watchSource ?? "" },
      });

      return data;
    },
    throwOnError: true,
  });

  const { data: sample = [], isFetching } = useQuery<IDocumentContentJson[]>({
    queryKey: ["documentSample", watchSource],
    queryFn: async () => {
      if (!watchSource) return [];

      const data = await apiGet("/documents/sample", {
        querystring: { type: watchSource ?? "" },
      });

      return data;
    },
    throwOnError: true,
  });

  const onSubmit = async (data: IChoseSourceForm) => {
    onSuccess({ ...data, sample, columns });
  };

  const tableColumns: GridColDef[] = [];

  for (const column of columns) {
    tableColumns.push({
      field: column,
      headerName: column,
      valueGetter: (_value, row) => row.content?.[column],
      minWidth: 200,
    });
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my={2}>
          <Box>
            <Input
              label="Nom de la campagne"
              state={errors.campaign_name ? "error" : "default"}
              stateRelatedMessage={errors.campaign_name?.message}
              nativeInputProps={{
                placeholder: "Campagne_voeux",
                ...register("campaign_name", {
                  required: "Veuillez saisir le nom de la campagne",
                  validate: {
                    regex: (value) => {
                      if (!/^[A-Za-z0-9 _-]*$/.test(value)) {
                        return "Le nom doit contenir uniquement lettres, chiffres, tirets (-) et underscores (_), sans espaces.";
                      }
                    },
                  },
                }),
              }}
            />
            <Select
              label="Source"
              state={errors.source ? "error" : "default"}
              stateRelatedMessage={errors.source?.message}
              nativeSelectProps={{
                ...register("source", {
                  required: "Veuillez sélectionner la source",
                  validate: (value) => {
                    return value && types.includes(value);
                  },
                }),
              }}
            >
              <option value="" disabled hidden>
                Sélectionner la source
              </option>
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </Box>
        </Box>

        {watchSource && !isFetching && (
          <Box my={2}>
            {sample.length > 0 ? (
              <>
                <Table rows={sample} columns={tableColumns} />
              </>
            ) : (
              <Typography>Cette source ne comporte aucune donnée</Typography>
            )}
          </Box>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Suivant
        </Button>
      </form>
    </Box>
  );
};

export default ChoixSource;
