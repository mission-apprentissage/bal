import { isAxiosError } from "axios";
import { BouncerPingResult } from "shared/models/bouncer.email.model";

import config from "@/config";

import { ApiError } from "../utils/apiUtils";
import getApiClient from "./client";

export interface ApiTdbUpdateRupturant {
  email: string;
  ping: BouncerPingResult;
}

const client = getApiClient(
  {
    baseURL: `${config.tdb.baseURL}/api/v1`,
    timeout: 0,
    headers: {
      "x-api-key": `${config.tdb.apiKey}`,
    },
  },
  { cache: false }
);

export const getTdbRupturant = async (): Promise<string[]> => {
  try {
    const { data } = await client.get<string[]>("/bal/rupturants");
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new ApiError(
        "Api TDB - getTdbRupturant",
        `${error.code}: ${error.message}`,
        JSON.stringify(error.response?.data ?? null)
      );
    }

    throw new ApiError("Api TDB - getTdbRupturan", `${error.message}`, error.code || error.response?.status);
  }
};

export const updateTdbRupturant = async (items: ApiTdbUpdateRupturant[]) => {
  try {
    await client.put("/bal/rupturants", { rupturants: items });
  } catch (error) {
    if (isAxiosError(error)) {
      throw new ApiError(
        "Api TDB - updateTdbRupturant",
        `${error.code}: ${error.message}`,
        JSON.stringify(error.response?.data ?? null)
      );
    }

    throw new ApiError("Api TDB - updateTdbRupturant", `${error.message}`, error.code || error.response?.status);
  }
};
