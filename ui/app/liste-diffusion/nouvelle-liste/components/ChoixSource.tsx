import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";

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

  const { data: types = [] } = useQuery<string[]>({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const data = await apiGet("/documents/types", {});

      return data;
    },
  });

  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    onSuccess(data);
  };

  return (
    <Box w={{ base: "100%", md: "50%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <FormControl isInvalid={!!errors.campaign_name} mb={5}>
            <FormLabel>Nom de la campagne</FormLabel>
            <Input
              placeholder="Campagne voeux 2023"
              {...register("campaign_name", { required: "Nom de la campagne" })}
            />
            <FormErrorMessage>{errors.campaign_name?.message}</FormErrorMessage>
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
