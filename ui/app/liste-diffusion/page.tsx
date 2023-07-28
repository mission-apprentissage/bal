"use client";
import { Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { IJobJson } from "shared/models/job.model";

import { apiGet } from "../../utils/api.utils";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import Form from "./components/Form";
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
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Liste de diffusion
      </Heading>

      {generatingMailingList ? (
        <GeneratingMailingList
          mailingList={generatingMailingList}
          onDone={refetch}
        />
      ) : (
        <Form onSuccess={refetch} />
      )}

      <ListMailingList mailingLists={mailingLists} onDelete={refetch} />
    </>
  );
};

export default ListeDiffusionPage;
