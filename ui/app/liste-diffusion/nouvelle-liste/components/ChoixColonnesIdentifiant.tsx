import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import { TooltipIcon } from "../../../../theme/icons/Tooltip";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";

interface Props {
  onSuccess: (
    data: Pick<
      IBody<IPostRoutes["/mailing-list"]>,
      "email" | "secondary_email" | "identifier_columns"
    >
  ) => void;
  columns: string[];
  sample: IDocumentContentJson[];
  onCancel: () => void;
}

interface IIdentifierColumnForm {
  email: string;
  secondary_email: string;
  identifier_columns: { name: string }[];
}

const ChoixColonnesIdentifiant: FC<Props> = ({
  onSuccess,
  columns,
  onCancel,
  sample,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    watch,
  } = useForm<IIdentifierColumnForm>({
    defaultValues: { identifier_columns: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "identifier_columns",
  });

  const watchEmail = watch("email");
  const watchSecondaryEmail = watch("secondary_email");
  const watchIdentifierColumns = watch("identifier_columns");

  const onSubmit = async (data: IIdentifierColumnForm) => {
    const identifierColumns = data.identifier_columns.map((ic) => ic.name);
    onSuccess({ ...data, identifier_columns: identifierColumns });
  };

  const getDataFromSample = (key: string) => {
    return (
      sample
        // @ts-ignore
        .map((row) => row?.content?.[key] ?? "")
        .filter((value) => value && value !== "")
        .slice(0, 3)
        .join(", ")
    );
  };

  return (
    <Box>
      <Text mb={4}>
        Les champs obligatoires serviront comme identifiants uniques. Les champs
        de courriel facultatifs correspondent aux courriels supplémentaires à
        qui la campagne sera envoyée.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MailingListSectionRow>
          <MailingListSectionCell>
            Informations demandées
          </MailingListSectionCell>
          <MailingListSectionCell>
            En-têtes des colonnes (fichier source)
          </MailingListSectionCell>
          <MailingListSectionCell>
            3 premières lignes de données
          </MailingListSectionCell>
        </MailingListSectionRow>

        <MailingListSectionRow>
          <MailingListSectionCell>
            Email<Text color="red">*</Text>
          </MailingListSectionCell>
          <MailingListSectionCell>
            <FormControl isInvalid={!!errors.email} isDisabled={isSubmitting}>
              <Select
                isInvalid={!!errors.email}
                placeholder="Choisir l'email"
                {...register("email", {
                  required: "Obligatoire",
                  validate: (value) => {
                    return value && columns.includes(value);
                  },
                })}
              >
                {columns.map((column) => (
                  <option key={column}>{column}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
          </MailingListSectionCell>
          <MailingListSectionCell>
            {watchEmail && getDataFromSample(watchEmail)}
          </MailingListSectionCell>
          <MailingListSectionCell>ou</MailingListSectionCell>
          <MailingListSectionCell></MailingListSectionCell>
          <MailingListSectionCell></MailingListSectionCell>
          <MailingListSectionCell>
            Email secondaire{" "}
            <Tooltip
              label="L'email secondaire est facultatif. Une adresse email secondaire différente dupliquera la ligne dans le fichier de sortie."
              fontSize="md"
            >
              <span>
                <TooltipIcon ml={2} />
              </span>
            </Tooltip>
          </MailingListSectionCell>
          <MailingListSectionCell>
            <FormControl
              isInvalid={!!errors.secondary_email}
              mb={5}
              isDisabled={isSubmitting}
            >
              <Select
                isInvalid={!!errors.secondary_email}
                placeholder="Choisir l'email secondaire"
                {...register("secondary_email")}
              >
                {columns.map((column) => (
                  <option key={column} disabled={watchEmail === column}>
                    {column}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.secondary_email?.message}
              </FormErrorMessage>
            </FormControl>
          </MailingListSectionCell>
          <MailingListSectionCell>
            {watchSecondaryEmail && getDataFromSample(watchSecondaryEmail)}
          </MailingListSectionCell>
        </MailingListSectionRow>

        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id}>
            <MailingListSectionCell />
            <MailingListSectionCell>
              <FormControl
                isInvalid={!!errors.identifier_columns?.[index]}
                isDisabled={isSubmitting}
              >
                <Select
                  isInvalid={!!errors.identifier_columns?.[index]}
                  placeholder="Colonne"
                  {...register(`identifier_columns.${index}.name`, {
                    required: "Obligatoire",
                    validate: (value) => {
                      return value && columns.includes(value);
                    },
                  })}
                >
                  {columns.map((column) => (
                    <option
                      key={column}
                      disabled={[
                        watchEmail,
                        watchSecondaryEmail,
                        ...watchIdentifierColumns.map((ic) => ic.name),
                      ].includes(column)}
                    >
                      {column}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.identifier_columns?.[index]?.name?.message}
                </FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell>
              {watchIdentifierColumns?.[index]?.name &&
                getDataFromSample(watchIdentifierColumns?.[index]?.name)}

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
          <Button variant="secondary" onClick={() => append({ name: "" })}>
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

export default ChoixColonnesIdentifiant;
