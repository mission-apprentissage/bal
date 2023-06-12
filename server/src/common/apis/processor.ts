import { AxiosInstance } from "axios";
import { IMailingList } from "shared/models/mailingList.model";

import config from "@/config";

import { ApiError, apiRateLimiter } from "../../utils/apiUtils";
import getApiClient from "./client";

const executeWithRateLimiting = apiRateLimiter("processor", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient(
    {
      baseURL: config.processorUrl,
    },
    { cache: false }
  ),
});

/**
 * @description process document
 * @param {ICreateDocument} document
 */
export const processDocument = async (documentId: string) => {
  return executeWithRateLimiting(async (client: AxiosInstance) => {
    try {
      const { data } = await client.post(`/document`, {
        document_id: documentId,
      });

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new ApiError(
        "Api Processor",
        `${error.message}`,
        error.code || error.response?.status
      );
    }
  });
};

export const processMailingList = async (mailingList: IMailingList) => {
  return executeWithRateLimiting(async (client: AxiosInstance) => {
    try {
      const { data } = await client.post(`/mailing-list`, {
        mailing_list_id: mailingList._id,
      });

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new ApiError(
        "Api Processor",
        `${error.message}`,
        error.code || error.response?.status
      );
    }
  });
};
