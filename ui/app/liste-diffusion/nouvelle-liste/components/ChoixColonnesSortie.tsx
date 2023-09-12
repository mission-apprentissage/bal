import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import { TooltipIcon } from "../../../../theme/icons/Tooltip";
import { apiPost } from "../../../../utils/api.utils";
import { getDataFromSample } from "../mailingLists.utils";
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
  sample: IDocumentContentJson[];
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
  sample,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    watch,
    setValue,
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "output_columns",
  });

  const onSubmit = async (data: IBody<IPostRoutes["/mailing-list"]>) => {
    await apiPost("/mailing-list", { body: data });

    onSuccess(data);
  };

  const outputColumns = watch("output_columns");

  const webhookLbaColumnIndex = outputColumns.findIndex((c) => c.column === WEBHOOK_LBA);

  useEffect(() => {
    if (webhookLbaColumnIndex !== -1) {
      setValue(`output_columns.${webhookLbaColumnIndex}.output`, "lien_lba, lien_prdv");
    }
  }, [webhookLbaColumnIndex]);

  return (
    <Box>
      <Text mb={4}>
        Sélectionnez le ou les champs du fichier d’entrée que vous voulez retrouver dans votre fichier de sortie.
        (Exemple : libellé établissement et libellé formation).
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow nbColumns={4}>
          <MailingListSectionCell>Nom de sortie</MailingListSectionCell>
          <MailingListSectionCell>En-têtes des colonnes (fichier source)</MailingListSectionCell>
          <MailingListSectionCell>Ne pas écraser</MailingListSectionCell>
          <MailingListSectionCell>3 premières lignes de données</MailingListSectionCell>
        </MailingListSectionRow>
        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id} nbColumns={4}>
            <MailingListSectionCell>
              <FormControl
                isInvalid={!!errors.output_columns?.[index]?.output}
                isDisabled={index === 0 || outputColumns[index].column === WEBHOOK_LBA || isSubmitting}
              >
                <Input
                  placeholder="Nom de sortie"
                  {...register(`output_columns.${index}.output`, {
                    required: "Obligatoire",
                  })}
                />
                <FormErrorMessage>{errors.output_columns?.[index]?.output?.message}</FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell>
              <FormControl
                key={field.id}
                isInvalid={!!errors.output_columns?.[index]?.column}
                isDisabled={index === 0 || isSubmitting}
              >
                <Select
                  isInvalid={!!errors.output_columns?.[index]}
                  placeholder="Colonne"
                  {...register(`output_columns.${index}.column`, {
                    required: "Obligatoire",
                    validate: (value) => {
                      return value && [...columns, WEBHOOK_LBA].includes(value);
                    },
                  })}
                >
                  <optgroup label="BAL">
                    <option value={WEBHOOK_LBA} disabled={!!outputColumns.find((c) => c.column === WEBHOOK_LBA)}>
                      {WEBHOOK_LBA}
                    </option>
                  </optgroup>
                  <optgroup label={source}>
                    {columns.map((column) => (
                      <option key={column} disabled={!!outputColumns.find((c) => c.column === column)} value={column}>
                        {column}
                        {index === 0 && secondaryEmail && `, ${secondaryEmail}`}
                      </option>
                    ))}
                  </optgroup>
                </Select>
                <FormErrorMessage>{errors.output_columns?.[index]?.column?.message}</FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell>
              {index !== 0 && (
                <>
                  <FormControl isDisabled={index === 0 || isSubmitting}>
                    <Checkbox {...register(`output_columns.${index}.grouped` as const)}>
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
                </>
              )}
            </MailingListSectionCell>
            <MailingListSectionCell>
              {outputColumns[index].column && getDataFromSample(sample, outputColumns[index].column)}
              <IconButton
                marginLeft="auto"
                aria-label="Supprimer"
                onClick={() => remove(index)}
                icon={<DeleteIcon />}
              />
            </MailingListSectionCell>
          </MailingListSectionRow>
        ))}

        <Box display="flex" justifyContent="center">
          <Button variant="secondary" onClick={() => append({ output: "", column: "", grouped: false })}>
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
