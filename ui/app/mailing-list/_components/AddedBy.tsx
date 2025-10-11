import { useQuery } from "@tanstack/react-query";
import type { IUserPublic } from "shared/models/user.model";
import { Box } from "@mui/material";
import Loading from "@/app/loading";
import { apiGet } from "@/utils/api.utils";

export function AddedBy(props: { addedBy: string }) {
  const userQuery = useQuery<IUserPublic>({
    queryKey: ["/_private/users", props.addedBy],
    queryFn: async () =>
      apiGet("/_private/users/:id", {
        params: { id: props.addedBy },
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

  return <>{userQuery.data.email}</>;
}
