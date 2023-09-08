import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import Table from "../../../../components/table/Table";
import { apiGet } from "../../../../utils/api.utils";

export interface IChoseSourceForm {
  campaign_name: string;
  source: string;
  sample: IDocumentContentJson[];
  columns: string[];
}

interface Props {
  onSuccess: (data: IChoseSourceForm) => void;
}

const ChoixSource: FC<Props> = ({ onSuccess }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
  } = useForm<IChoseSourceForm>({ defaultValues: { source: "" } });
  const watchSource = watch("source");

  const { data: types = [] } = useQuery<string[]>({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const data = await apiGet("/documents/types", {});

      return data;
    },
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
  });

  const onSubmit = async (data: IChoseSourceForm) => {
    onSuccess({ ...data, sample, columns });
  };

  const tableColumns: Record<
    string,
    {
      id: string;
      header?: () => React.ReactNode;
      cell?: ColumnDefTemplate<CellContext<IDocumentContentJson, unknown>>;
      size?: number;
    }
  > = {};

  for (const column of columns) {
    tableColumns[column] = {
      id: column,
      // @ts-ignore
      cell: ({ row }) => row.original?.content?.[column],
    };
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
                placeholder: "Campagne voeux 2023",
                ...register("campaign_name", {
                  required: "Veuillez saisir le nom de la campagne",
                }),
              }}
            />
            <Select
              label="Label"
              state={errors.source ? "error" : "default"}
              stateRelatedMessage={errors.source?.message}
              nativeSelectProps={{
                ...register("source", {
                  required: "Veuillez selectionner la source",
                  validate: (value) => {
                    return value && types.includes(value);
                  },
                }),
              }}
            >
              <option value="" disabled hidden>
                Selectionner la source
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
              <Table noScroll={false} data={sample} columns={tableColumns} />
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
