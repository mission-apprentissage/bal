import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Select,
} from "@chakra-ui/react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";

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
  const { fields, append } = useFieldArray({
    control,
    name: "identifier_columns",
  });

  const watchEmail = watch("email");
  const watchSecondaryEmail = watch("secondary_email");

  const onSubmit = async (data: IIdentifierColumnForm) => {
    const identifierColumns = data.identifier_columns.map((ic) => ic.name);
    onSuccess({ ...data, identifier_columns: identifierColumns });
  };

  return (
    <Box mt={5}>
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
          <MailingListSectionCell>Email</MailingListSectionCell>
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
          <MailingListSectionCell></MailingListSectionCell>
          <MailingListSectionCell>Email secondaire</MailingListSectionCell>
          <MailingListSectionCell>
            <FormControl
              isInvalid={!!errors.secondary_email}
              mb={5}
              isDisabled={isSubmitting}
            >
              <Select
                isInvalid={!!errors.secondary_email}
                placeholder="Choisir l'email"
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
          <MailingListSectionCell></MailingListSectionCell>
        </MailingListSectionRow>

        {fields.map((field, index) => (
          <MailingListSectionRow key={field.id}>
            <MailingListSectionCell>
              <FormControl
                isInvalid={!!errors.identifier_columns?.[index]}
                isDisabled={isSubmitting}
              >
                {/* <FormLabel>Colonne</FormLabel> */}
                <Select
                  isInvalid={!!errors.identifier_columns?.[index]}
                  placeholder="Colonne"
                  {...register(`identifier_columns.${index}.name`)}
                >
                  {columns.map((column) => (
                    <option
                      key={column}
                      disabled={[watchEmail, watchSecondaryEmail].includes(
                        column
                      )}
                    >
                      {column}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.identifier_columns?.[index]?.message}
                </FormErrorMessage>
              </FormControl>
            </MailingListSectionCell>
            <MailingListSectionCell></MailingListSectionCell>
            <MailingListSectionCell></MailingListSectionCell>
          </MailingListSectionRow>
        ))}
        <Box display="flex" justifyContent="center">
          <Button variant="secondary" onClick={() => append({ name: "" })}>
            +
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
