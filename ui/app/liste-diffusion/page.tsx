"use client";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";
import { IReqGetMailingList } from "shared/routes/mailingList.routes";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import Table from "../../components/table/Table";
import { Bin } from "../../theme/icons/Bin";
import { DownloadLine } from "../../theme/icons/DownloadLine";
import { api } from "../../utils/api.utils";
import { formatDate } from "../../utils/date.utils";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";

const ListeDiffusionPage = () => {
  const toast = useToast();

  const { data: mailingLists, refetch } = useQuery<IJob[]>({
    queryKey: ["mailingLists"],
    queryFn: async () => {
      const { data } = await api.get("/mailing-lists");

      return data;
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<IReqGetMailingList>();

  const onSubmit = async (data: IReqGetMailingList) => {
    await api.post("/mailing-list", { source: data.source });
    await refetch();

    toast({
      title:
        "La liste de diffusion est en cours de génération. Vous pouvez revenir sur cette page dans quelques minutes.",
      status: "success",
      duration: 10000,
      isClosable: true,
    });
  };

  const onDeleteMailingList = async (mailingList_id: string) => {
    await api.delete(`/mailing-list/${mailingList_id}`);
    if (typeof window !== "undefined" && window.location)
      window.location.reload();
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.listeDiffusion()]} />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Liste de diffusion
      </Heading>

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
                    return (
                      value && Object.values(DOCUMENT_TYPES).includes(value)
                    );
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

      <Box>
        <Table
          mt={4}
          data={mailingLists || []}
          columns={{
            source: {
              id: "source",
              size: 100,
              header: () => "Source",
              cell: ({ row }) => row.original.payload?.source,
            },
            status: {
              id: "status",
              size: 100,
              header: () => "Statut",
              cell: ({ row }) => {
                return (
                  <>
                    {
                      {
                        pending: "En attente",
                        will_start: "Programmé",
                        running: "En cours",
                        finished: "Terminé",
                        blocked: "Bloqué",
                        errored: "Erreur",
                      }[row.original.status]
                    }
                    {row.original.status === JOB_STATUS_LIST.RUNNING &&
                      row.original.payload?.processed && (
                        <> ({row.original.payload?.processed} %)</>
                      )}
                  </>
                );
              },
            },
            date: {
              id: "date",
              size: 100,
              header: () => "Date de génération",
              cell: ({ row }) => {
                return (
                  row.original.created_at &&
                  formatDate(
                    //@ts-ignore
                    row.original.created_at as string,
                    "dd/MM/yyyy à HH:mm"
                  )
                );
              },
            },

            actions: {
              id: "actions",
              size: 25,
              header: () => "Actions",
              cell: ({ row }) => {
                if (row.original.status !== JOB_STATUS_LIST.FINISHED) {
                  return null;
                }

                return (
                  <HStack spacing={4}>
                    <a
                      href={`/api/mailing-lists/${row.original._id}/download`}
                      title="Télécharger le fichier"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DownloadLine w="1w" />
                    </a>
                    <Bin
                      boxSize="5"
                      color="red_marianne"
                      cursor="pointer"
                      onClick={() =>
                        onDeleteMailingList(row.original._id.toString())
                      }
                    />
                  </HStack>
                );
              },
            },
          }}
        />
      </Box>
    </>
  );
};

export default ListeDiffusionPage;
