import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";

import { TooltipIcon } from "../../../../theme/icons/Tooltip";
import { apiPost } from "../../../../utils/api.utils";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";

interface Props {
  onSuccess: (data: IBody<IPostRoutes["/mailing-list"]>) => void;
  onCancel: () => void;
  source: string;
  campaignName: string;
  columns: string[];
  identifierColumns: string[];
  email: string;
  secondaryEmail?: string;
}

const ChoixColonnesSortie: FC<Props> = ({
  onSuccess,
  onCancel,
  columns,
  identifierColumns,
  campaignName,
  source,
  email,
  secondaryEmail,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
  } = useForm<IBody<IPostRoutes["/mailing-list"]>>({
    defaultValues: {
      source,
      campaign_name: campaignName,
      identifier_columns: identifierColumns,
      output_columns: [
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
      output_columns: [{ output: "email", column: email, grouped: false }],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "output_columns",
  });

  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    await apiPost("/mailing-list", { body: data });

    onSuccess(data);
  };

  return (
    <Box>
      <Text mb={4}>
        Veuillez sélectionner les champs du fichier d’entrée que vous souhaitez
        avoir dans le fichier de sortie. Exemple : libellé établissement et
        libellée formation. Vous pouvez ajouter plusieurs.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id}>
            <MailingListSectionCell>
              <FormControl
                isInvalid={!!errors.campaign_name}
                mb={5}
                isDisabled={index === 0 || isSubmitting}
              >
                <FormLabel>Nom de sortie</FormLabel>
                <Input
                  placeholder="Campagne voeux 2023"
                  {...register(`output_columns.${index}.output` as const)}
                />
                <FormErrorMessage>
                  {errors.campaign_name?.message}
                </FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell>
              <FormControl
                key={field.id}
                isInvalid={!!errors.identifier_columns?.[index]}
                mb={5}
                isDisabled={index === 0 || isSubmitting}
              >
                <FormLabel>Colonne</FormLabel>
                <Select
                  isInvalid={!!errors.identifier_columns?.[index]}
                  placeholder="Colonne"
                  {...register(`output_columns.${index}.column` as const)}
                >
                  {columns.map((column) => (
                    <option key={column}>{column}</option>
                  ))}
                  <option value="WEBHOOK_LBA">WEBHOOK_LBA</option>
                </Select>
                <FormErrorMessage>
                  {errors.identifier_columns?.[index]?.message}
                </FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell>
              <FormControl mb={5} isDisabled={index === 0 || isSubmitting}>
                <Checkbox
                  {...register(`output_columns.${index}.grouped` as const)}
                >
                  Ne pas écraser
                  <Tooltip
                    label="Ajoutera des colonnes prefixées par _ pour chacun des champs du groupe NE_PAS_ECRASER"
                    fontSize="md"
                  >
                    <span>
                      <TooltipIcon ml={2} />
                    </span>
                  </Tooltip>
                </Checkbox>
              </FormControl>
            </MailingListSectionCell>
          </MailingListSectionRow>
        ))}

        <Box display="flex" justifyContent="center">
          <Button
            variant="secondary"
            onClick={() => append({ output: "", column: "", grouped: false })}
          >
            + Ajouter un champ
          </Button>
        </Box>

        <HStack spacing="4w" mt={8}>
          <Button isLoading={isSubmitting} onClick={onCancel}>
            Retour
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Confirmer
          </Button>
        </HStack>
      </form>
    </Box>
  );
};

export default ChoixColonnesSortie;
