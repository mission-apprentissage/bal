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
      email: person.email,
      sirets: person.sirets?.join("\n") ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const formattedData = {
      ...data,
      sirets: data.sirets?.split("\n"),
    };

    try {
      await api.patch(`/admin/persons/${person._id}`, formattedData);

      push(PAGES.adminViewPerson(person._id).path);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box w={{ base: "100%", md: "50%" }}>
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
        <FormControl isInvalid={!!errors.nom} mb={5}>
          <FormLabel>Nom</FormLabel>
          <Input {...register("nom")} />
          <FormErrorMessage>{errors.nom?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.prenom} mb={5}>
          <FormLabel>Prénom</FormLabel>
          <Input {...register("prenom")} />
          <FormErrorMessage>{errors.prenom?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.civility} mb={5}>
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
          <FormLabel>Email</FormLabel>
          <Input {...register("email")} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.sirets} mb={5}>
          <FormLabel>SIRETS</FormLabel>
          <Textarea {...register("sirets")} />
          <FormErrorMessage>{errors.sirets?.message}</FormErrorMessage>
        </FormControl>

        <Box paddingTop={5}>
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
    </Box>
  );
};

export default PersonUpdate;
