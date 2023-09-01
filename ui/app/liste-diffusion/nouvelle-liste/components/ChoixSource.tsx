import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
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
  } = useForm<IChoseSourceForm>();
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

  const { data: sample = [] } = useQuery<IDocumentContentJson[]>({
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
        <Box w={{ base: "100%", md: "50%" }}>
          <Box>
            <FormControl isInvalid={!!errors.campaign_name} mb={5}>
              <FormLabel>Nom de la campagne</FormLabel>
              <Input
                placeholder="Campagne voeux 2023"
                {...register("campaign_name", {
                  required: "Nom de la campagne",
                })}
              />
              <FormErrorMessage>
                {errors.campaign_name?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.source}
              mb={5}
              isDisabled={isSubmitting}
            >
              <FormLabel>Source</FormLabel>
              <Select
                isInvalid={!!errors.source}
                placeholder="Choisir la source"
                {...register("source", {
                  required: "Obligatoire: Vous devez choisir la source",
                  validate: (value) => {
                    return value && types.includes(value);
                  },
                })}
              >
                {types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.source?.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </Box>

        {watchSource && (
          <Box>
            {sample.length > 0 ? (
              <Box overflow="scroll">
                <Table mt={4} data={sample} columns={tableColumns} />
              </Box>
            ) : (
              <Text>Cette source ne comporte aucune donnée</Text>
            )}
          </Box>
        )}

        <HStack spacing="4w" mt={8}>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Suivant
          </Button>
        </HStack>
      </form>
    </Box>
  );
};

export default ChoixSource;
