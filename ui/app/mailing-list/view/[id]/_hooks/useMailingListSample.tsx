import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/api.utils";

export function useMailingListSample(mailingListId: string) {
  return useQuery({
    queryKey: ["/_private/mailing-list", mailingListId, "sample"],
    queryFn: async ({ queryKey }) =>
      apiGet("/_private/mailing-list/:id/source/sample", { params: { id: queryKey[1] } }),
    throwOnError: true,
    retry: 5,
  });
}
