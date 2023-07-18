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
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IReqGetMailingList } from "shared/routes/mailingList.routes";
import {
  DOCUMENT_TYPES,
  IResGetDocumentTypes,
} from "shared/routes/upload.routes";

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

  const { data: types = [] } = useQuery<IResGetDocumentTypes>({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      const { data } = await api.get("/admin/documents/types");

      return data;
    },
  });

  const onSubmit = async (data: IReqGetMailingList) => {
    await api.post("/mailing-list", { source: data.source });

    await onSuccess();
  };

  const validTypes = types.filter((t) => t !== DOCUMENT_TYPES.DECA);

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
