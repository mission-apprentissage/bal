import { QueryClient } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";

const QUERY_CLIENT_RETRY_DELAY = 3000;
const QUERY_CLIENT_RETRY_ATTEMPTS = 1;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_CLIENT_RETRY_ATTEMPTS, // retry failing requests just once, see https://react-query.tanstack.com/guides/query-retries
      retryDelay: QUERY_CLIENT_RETRY_DELAY, // retry failing requests after 3 seconds
      refetchOnWindowFocus: false, // see https://react-query.tanstack.com/guides/important-defaults
      refetchOnReconnect: false,
    },
  },
});

export const getSearchParamsForQuery = (searchParams: ReadonlyURLSearchParams | null) => {
  const q = searchParams?.get("q") ?? "";
  const page = searchParams?.get("page") ?? "1";
  const limit = searchParams?.get("limit") ?? "10";

  return {
    q,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

export const formatUrlWithNewParams = (
  to: string,
  searchParams: ReadonlyURLSearchParams | null,
  newParams: Record<string, string | number>
) => {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  Object.entries(newParams).forEach(([key, value]) => {
    newSearchParams.set(key, value.toString());
  });

  newSearchParams.toString();

  return `${to}?${newSearchParams.toString()}`;
};
