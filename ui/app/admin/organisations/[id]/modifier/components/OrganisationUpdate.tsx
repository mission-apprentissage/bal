"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";

import {
  IReqPatchOrganisation,
  IResGetOrganisation,
} from "../../../../../../../shared/routes/organisation.routes";
import { api } from "../../../../../../utils/api.utils";
import Breadcrumb, {
  PAGES,
} from "../../../../../components/breadcrumb/Breadcrumb";

interface Props {
  organisation: IResGetOrganisation;
}

interface FormData
  extends Omit<IReqPatchOrganisation, "etablissements" | "email_domains"> {
  etablissements: string;
  email_domains: string;
}

const OrganisationUpdate: FC<Props> = ({ organisation }) => {
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nom: organisation.nom,
      email_domains: organisation.email_domains?.join("\n") ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        email_domains: data.email_domains
          ?.split("\n")
          .map((domain) => domain.trim()),
      };

      await api.patch(
        `/admin/organisations/${organisation._id}`,
        formattedData
      );

      push(PAGES.adminViewOrganisation(organisation._id).path);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box w={{ base: "100%", md: "50%" }}>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.adminOrganisations(),
          PAGES.adminUpdateOrganisation(organisation._id),
        ]}
      />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Modifier une organisation
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.nom} mb={5}>
          <FormLabel>Nom</FormLabel>
          <Input {...register("nom")} />
          <FormErrorMessage>{errors.nom?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email_domains} mb={5}>
          <FormLabel>Domaines email</FormLabel>
          <Textarea {...register("email_domains")} />
          <FormErrorMessage>{errors.email_domains?.message}</FormErrorMessage>
        </FormControl>

        <Box paddingTop={5}>
          <Button
            as={Link}
            href={PAGES.adminViewOrganisation(organisation._id).path}
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

export default OrganisationUpdate;
