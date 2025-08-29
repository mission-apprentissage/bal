import type { AxiosResponse } from "axios";
import axios from "axios";

import { z } from "zod/v4-mini";
import { createRequestStream, createUploadStream } from "./httpUtils";
import config from "@/config";

type AccountName = "main" | "support";

export interface IAuthResponse {
  token: Token;
}

export interface Token {
  is_domain: boolean;
  methods: string[];
  is_admin_project: boolean;
  catalog: Catalog[];
  expires_at: string;
  audit_ids: string[];
  issued_at: string;
}

export interface Catalog {
  endpoints: Endpoint[];
  type: string;
  id: string;
  name: string;
}

export interface Endpoint {
  url: string;
  interface: string;
  region: string;
  region_id: string;
  id: string;
}

async function authenticate(uri: string) {
  const regExp = new RegExp(/^(https:\/\/)(.+):(.+):(.+)@(.*)$/);

  if (!regExp.test(uri)) {
    throw new Error("Invalid OVH URI");
  }

  // @ts-ignore
  const [, protocol, user, password, tenantId, authUrl] = uri.match(regExp);
  const response = await axios.post<unknown, AxiosResponse<IAuthResponse>>(`${protocol}${authUrl}`, {
    auth: {
      identity: {
        tenantId,
        methods: ["password"],
        password: {
          user: {
            name: user,
            password: password,
            domain: {
              name: "Default",
            },
          },
        },
      },
    },
  });

  const token = response.headers["x-subject-token"];
  const catalog = response.data.token.catalog.find((c) => c.type === "object-store");

  if (!catalog) {
    throw new Error("No object-store catalog found");
  }

  const endpoint = catalog.endpoints.find((endpoint) => endpoint.region === "GRA");

  if (!endpoint) {
    throw new Error("No GRA endpoint found");
  }

  return { baseUrl: endpoint.url, token };
}

// DOC https://docs.openstack.org/api-ref/object-store/
async function requestObjectAccess(path: string, account: AccountName) {
  const ovhStorageAccount = account === "support" ? config.ovhStorageSupport : config.ovhStorage;

  const storage = ovhStorageAccount.containerName;
  const { baseUrl, token } = await authenticate(ovhStorageAccount.uri);

  return {
    url: encodeURI(`${baseUrl}/${storage}${path === "/" ? "" : `/${path}`}`),
    token,
  };
}

export const getFromStorage = async (path: string, account: AccountName, signal?: AbortSignal) => {
  const { url, token } = await requestObjectAccess(path, account);
  return createRequestStream(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
    signal,
  });
};

const zItemInfo = z.object({
  bytes: z.number(),
  hash: z.string(),
  name: z.string(),
  last_modified: z.string(),
  content_type: z.string(),
});

export const listFromStorage = async (account: AccountName): Promise<Array<z.infer<typeof zItemInfo>>> => {
  const { url, token } = await requestObjectAccess("/", account);
  const data = await axios.get(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });

  return z.array(zItemInfo).parse(data.data);
};

export const uploadToStorage = async (
  path: string,
  account: AccountName,
  ttlInSeconds: number,
  contentType: string = "application/octet-stream"
) => {
  const { url, token } = await requestObjectAccess(path, account);
  return createUploadStream(url, {
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
      "Content-Type": contentType,
      "X-Delete-After": ttlInSeconds.toString(), // Time to live in seconds
    },
  });
};

export const updateUploadTtl = async (path: string, account: AccountName, ttlInSeconds: number) => {
  const { url, token } = await requestObjectAccess(path, account);

  await axios.post(url, null, {
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
      "X-Delete-After": ttlInSeconds.toString(), // Time to live in seconds
    },
  });
};

export const deleteFromStorage = async (path: string, account: AccountName) => {
  const { url, token } = await requestObjectAccess(path, account);
  return createRequestStream(url, {
    method: "DELETE",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
};
