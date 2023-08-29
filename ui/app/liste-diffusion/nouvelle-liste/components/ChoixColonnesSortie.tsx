import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
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
    watch,
  } = useForm<IBody<IPostRoutes["/mailing-list"]>>({
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
  const { fields, append } = useFieldArray({
    control,
    name: "output_columns",
  });

  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    await apiPost("/mailing-list", { body: data });

    onSuccess(data);
  };

  const outputColumns = watch("output_columns");

  return (
    <Box>
      <Text mb={4}>
        Veuillez sélectionner les champs du fichier d’entrée que vous souhaitez
        avoir dans le fichier de sortie. Exemple : libellé établissement et
        libellée formation. Vous pouvez ajouter plusieurs.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow>
          <MailingListSectionCell>Nom de sortie</MailingListSectionCell>
          <MailingListSectionCell>
            En-têtes des colonnes (fichier source)
          </MailingListSectionCell>
        </MailingListSectionRow>
        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id}>
            <MailingListSectionCell>
              <FormControl
                isInvalid={!!errors.output_columns?.[index]?.output}
                mb={5}
                isDisabled={index === 0 || isSubmitting}
              >
                <Input
                  {...register(`output_columns.${index}.output` as const, {
                    required: "Obligatoire",
                  })}
                />
                <FormErrorMessage>
                  {errors.output_columns?.[index]?.output?.message}
                </FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell>
              <FormControl
                key={field.id}
                isInvalid={!!errors.output_columns?.[index]?.column}
                mb={5}
                isDisabled={index === 0 || isSubmitting}
              >
                <Select
                  isInvalid={!!errors.output_columns?.[index]}
                  placeholder="Colonne"
                  {...register(`output_columns.${index}.column` as const, {
                    required: "Obligatoire",
                    validate: (value) => {
                      return value && [...columns, WEBHOOK_LBA].includes(value);
                    },
                  })}
                >
                  <optgroup label="BAL">
                    <option
                      value={WEBHOOK_LBA}
                      disabled={
                        !!outputColumns.find((c) => c.column === WEBHOOK_LBA)
                      }
                    >
                      WEBHOOK_LBA
                    </option>
                  </optgroup>
                  <optgroup label={source}>
                    {columns.map((column) => (
                      <option
                        key={column}
                        disabled={
                          !!outputColumns.find((c) => c.column === column)
                        }
                      >
                        {column}
                      </option>
                    ))}
                  </optgroup>
                </Select>
                <FormErrorMessage>
                  {errors.output_columns?.[index]?.column?.message}
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
