"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";

import {
  IReqPatchPerson,
  IResGetPerson,
} from "../../../../../../../shared/routes/person.routes";
import InfoDetails from "../../../../../../components/infoDetails/InfoDetails";
import { api } from "../../../../../../utils/api.utils";
import Breadcrumb, {
  PAGES,
} from "../../../../../components/breadcrumb/Breadcrumb";

interface Props {
  person: IResGetPerson;
}

interface FormData extends Omit<IReqPatchPerson, "sirets"> {
  sirets: string;
}

const PersonUpdate: FC<Props> = ({ person }) => {
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nom: person.nom,
      prenom: person.prenom,
      civility: person.civility,
      sirets: person.sirets?.join("\n") ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log({ data, sirets: data.sirets?.split("\n") });
    const formattedData = {
      ...data,
      sirets: data.sirets?.split("\n"),
    };
    try {
      const { data: updatedPerson } = await api.patch(
        `/admin/persons/${person._id}`,
        formattedData
      );
      console.log({ updatedPerson });
      push(PAGES.adminViewPerson(person._id).path);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.adminPersons(),
          PAGES.adminViewPerson(person._id as string),
        ]}
      />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Modifier une personne
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.email} mb={5}>
          <FormLabel>Nom</FormLabel>
          <Input {...register("nom")} />
          <FormErrorMessage>{errors.nom?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email} mb={5}>
          <FormLabel>Prénom</FormLabel>
          <Input {...register("prenom")} />
          <FormErrorMessage>{errors.prenom?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email} mb={5}>
          <FormLabel>Civilité</FormLabel>
          <Select
            isInvalid={!!errors.civility}
            placeholder="Choisir une civilité"
            {...register("civility")}
          >
            <option value="Monsieur">Monsieur</option>
            <option value="Madame">Madame</option>
          </Select>
          <FormErrorMessage>{errors.civility?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email} mb={5}>
          <FormLabel>SIRETS</FormLabel>
          <Textarea {...register("sirets")} />
          <FormErrorMessage>{errors.sirets?.message}</FormErrorMessage>
        </FormControl>

        <Box paddingTop={10}>
          <Button
            as={Link}
            href={PAGES.adminViewPerson(person._id).path}
            variant="outline"
            mr={5}
          >
            Retour
          </Button>

          <Button type="submit" variant="primary" mr={5}>
            Enregistrer
          </Button>
        </Box>
      </form>
      <InfoDetails
        data={person}
        rows={{
          _id: {
            header: () => "Identifiant",
          },
          nom: {
            header: () => "Nom",
          },
          prenom: {
            header: () => "Prénom",
          },
          email: {
            header: () => "Email",
          },
          civility: {
            header: () => "Civilite",
          },
          organisation: {
            header: () => "Organisation",
            cell: ({ organisation }) => {
              return organisation ? (
                <Text
                  as={Link}
                  href={PAGES.adminViewOrganisation(organisation._id).path}
                >
                  {organisation.nom}
                </Text>
              ) : (
                ""
              );
            },
          },
          sirets: {
            header: () => "Sirets",
            cell: ({ sirets }) => {
              return sirets?.join(", ") ?? "";
            },
          },
          _meta: {
            header: () => "Meta",
            cell: ({ _meta }) => {
              return <pre>{JSON.stringify(_meta, null, "  ")}</pre>;
            },
          },
        }}
      />
    </>
  );
};

export default PersonUpdate;
