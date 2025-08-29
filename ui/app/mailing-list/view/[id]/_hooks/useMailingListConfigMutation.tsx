import { useMutation } from "@tanstack/react-query";
import type { IPutRoutes, IRequest } from "shared";
import { captureException } from "@sentry/nextjs";
import { apiPut } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";

export function useMailingListConfigMutation() {
  return useMutation({
    mutationFn: async (variables: IRequest<IPutRoutes["/_private/mailing-list/:id/config"]>) => {
      await apiPut("/_private/mailing-list/:id/config", variables);
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"], exact: true }),
        queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list", variables.params.id], exact: true }),
      ]);
    },
    onError: (error) => {
      captureException(error);
    },
  });
}
