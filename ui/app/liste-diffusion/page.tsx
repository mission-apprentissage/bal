"use client";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { IJobJson } from "shared/models/job.model";

import { apiGet } from "../../utils/api.utils";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import GeneratingMailingList from "./components/GeneratingMailingList";
import ListMailingList from "./components/ListMailingList";

const inProgressStatuses: IJobJson["status"][] = [
  "running",
  "pending",
  "will_start",
];

const ListeDiffusionPage = () => {
  const { data: mailingLists, refetch } = useQuery<IJobJson[]>({
    queryKey: ["mailingLists"],
    queryFn: async () => apiGet("/mailing-lists", {}),
  });

  const generatingMailingList = mailingLists?.find((mailingList) =>
    inProgressStatuses.includes(mailingList.status)
  );

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.listeDiffusion()]} />

      <Flex mt={8} flexDirection="row">
        <Heading as="h2" fontSize="2xl" flexGrow={1}>
          Mes Listes de diffusion
        </Heading>
        <Button
          variant="primary"
          as={NextLink}
          href="/liste-diffusion/nouvelle-liste"
        >
          + Créer nouvelle liste
        </Button>
      </Flex>

      {generatingMailingList && (
        <GeneratingMailingList
          mailingList={generatingMailingList}
          onDone={refetch}
        />
      )}

      <ListMailingList mailingLists={mailingLists} onDelete={refetch} />
    </>
  );
};

export default ListeDiffusionPage;
