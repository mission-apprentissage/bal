"use client";
import { Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import { api } from "../../utils/api.utils";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import Form from "./components/Form";
import GeneratingMailingList from "./components/GeneratingMailingList";
import ListMailingList from "./components/ListMailingList";

const ListeDiffusionPage = () => {
  const { data: mailingLists, refetch } = useQuery<IJob[]>({
    queryKey: ["mailingLists"],
    queryFn: async () => {
      const { data } = await api.get("/mailing-lists");

      return data;
    },
  });

  const generatingMailingList = mailingLists?.find((mailingList) =>
    [
      JOB_STATUS_LIST.RUNNING,
      JOB_STATUS_LIST.PENDING,
      JOB_STATUS_LIST.WILLSTART,
    ].includes(mailingList.status as JOB_STATUS_LIST)
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
