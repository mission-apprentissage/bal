"use client";

import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import type { IUserWithPersonPublic } from "shared/models/user.model";
import { MailingListEditSourceForm } from "./source/MailingListEditSourceForm";
import { MailingListSourceReadonly } from "./source/MailingListSourceReadonly";
import { apiGet } from "@/utils/api.utils";
import Loading from "@/app/loading";

export function MailingListSource(props: { mailingList: IMailingListV2Json }) {
  const readonly = props.mailingList.status !== "initial";

  const userQuery = useQuery<IUserWithPersonPublic>({
    queryKey: ["/_private/users", props.mailingList.added_by],
    queryFn: async () =>
      apiGet("/_private/users/:id", {
        params: { id: props.mailingList.added_by },
      }),
    throwOnError: true,
    retry: 5,
  });

  if (!userQuery.isSuccess) {
    return (
      <Box
        padding={8}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        margin="auto"
        maxWidth="600px"
        textAlign="center"
      >
        <Loading />
      </Box>
    );
  }

  return readonly ? (
    <MailingListSourceReadonly mailingList={props.mailingList} user={userQuery.data} />
  ) : (
    <MailingListEditSourceForm mailingList={props.mailingList} user={userQuery.data} />
  );
}
