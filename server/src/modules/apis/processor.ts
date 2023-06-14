import { AxiosInstance } from "axios";
import { IDocument } from "shared/models/document.model";

import { config } from "../../../config/config";
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
export const processDocument = async (document: IDocument) => {
  return executeWithRateLimiting(async (client: AxiosInstance) => {
    try {
      const { data } = await client.post(`/document`, {
        document_id: document._id,
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