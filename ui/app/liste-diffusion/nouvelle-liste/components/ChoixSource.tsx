import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { DOCUMENT_TYPES } from "shared/constants/documents";

import { apiGet } from "../../../../utils/api.utils";

interface Props {
  onSuccess: (data: IBody<IPostRoutes["/mailing-list"]>) => void;
}

const ChoixSource: FC<Props> = ({ onSuccess }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<IBody<IPostRoutes["/mailing-list"]>>();

  const [previewClicked, setPreviewClicked] = useState(false);

  const { data: types = [] } = useQuery<string[]>({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const data = await apiGet("/admin/documents/types", {});

      return data;
    },
  });

  const onSelectSource = async () => {
    // Get preview source

    setPreviewClicked(true);
  };
  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    // await apiPost("/mailing-list", { body: { source: data.source } });

    await onSuccess({ source: data.source });
  };

  const validTypes = types.filter((t) => t !== DOCUMENT_TYPES.DECA);

  return (
    <Box w={{ base: "100%", md: "50%" }} mt={5}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
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
                  return value && validTypes.includes(value);
                },
              })}
            >
              {validTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.source?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        {previewClicked && <Box>TODO: Prévisualisation ICI...</Box>}

        <HStack spacing="4w" mt={8}>
          {!previewClicked && (
            <Button
              variant="primary"
              onClick={onSelectSource}
              isLoading={isSubmitting}
            >
              Suivant
            </Button>
          )}
          {previewClicked && (
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Confirmer
            </Button>
          )}
        </HStack>
      </form>
    </Box>
  );
};

export default ChoixSource;
