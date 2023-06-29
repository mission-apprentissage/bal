import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
} from "@chakra-ui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IReqGetMailingList } from "shared/routes/mailingList.routes";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import { api } from "../../../utils/api.utils";

interface Props {
  onSuccess: () => void;
}

const Form: FC<Props> = ({ onSuccess }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<IReqGetMailingList>();

  const onSubmit = async (data: IReqGetMailingList) => {
    await api.post("/mailing-list", { source: data.source });

    await onSuccess();
  };
  return (
    <Box w={{ base: "100%", md: "50%" }}>
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
                  return value && Object.values(DOCUMENT_TYPES).includes(value);
                },
              })}
            >
              {[
                DOCUMENT_TYPES.VOEUX_AFFELNET_MAI_2023,
                DOCUMENT_TYPES.VOEUX_AFFELNET_JUIN_2023,
              ].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.source?.message}</FormErrorMessage>
          </FormControl>
        </Box>

        <HStack spacing="4w" mt={8}>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Générer la liste
          </Button>
        </HStack>
      </form>
    </Box>
  );
};

export default Form;
