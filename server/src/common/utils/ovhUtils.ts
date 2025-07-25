import type { AxiosResponse } from "axios";
import axios from "axios";

import { createRequestStream, createUploadStream } from "./httpUtils";
import config from "@/config";

interface Options {
  storage?: string;
  account?: "mna" | "sbs";
  contentType?: string;
}

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

async function requestObjectAccess(path: string, options: Options = {}) {
  const ovhStorageAccount = options.account
    ? options.account === "mna"
      ? config.ovhStorageMna
      : config.ovhStorage
    : config.ovhStorage;

  const storage = options.storage || ovhStorageAccount.containerName;
  const { baseUrl, token } = await authenticate(ovhStorageAccount.uri);

  return {
    url: encodeURI(`${baseUrl}/${storage}${path === "/" ? "" : `/${path}`}`),
    token,
  };
}

export const getFromStorage = async (path: string, options: Options = {}) => {
  const { url, token } = await requestObjectAccess(path, options);
  return createRequestStream(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
};

export const uploadToStorage = async (path: string, options: Options = {}) => {
  const { url, token } = await requestObjectAccess(path, options);
  return createUploadStream(url, {
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
      "Content-Type": options.contentType || "application/octet-stream",
    },
  });
};

export const deleteFromStorage = async (path: string, options: Options = {}) => {
  const { url, token } = await requestObjectAccess(path, options);
  return createRequestStream(url, {
    method: "DELETE",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
};
