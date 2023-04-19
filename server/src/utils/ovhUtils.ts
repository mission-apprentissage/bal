import axios from "axios";

import { config } from "../../config/config";
import { createRequestStream, createUploadStream } from "./httpUtils";

async function authenticate(uri: string) {
  const regExp = new RegExp(/^(https:\/\/)(.+):(.+):(.+)@(.*)$/);

  if (!regExp.test(uri)) {
    throw new Error("Invalid OVH URI");
  }

  // @ts-ignore
  const [, protocol, user, password, tenantId, authUrl] = uri.match(regExp);
  const response = await axios.post(`${protocol}${authUrl}`, {
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
  const { endpoints } = response.data.token.catalog.find(
    (c: any) => c.type === "object-store"
  );
  const { url: baseUrl } = endpoints.find((s: any) => s.region === "GRA");

  return { baseUrl, token };
}

async function requestObjectAccess(path: string, options: any = {}) {
  const storage = options.storage || config.ovhStorage.containerName;
  const { baseUrl, token } = await authenticate(config.ovhStorage.uri);

  return {
    url: encodeURI(`${baseUrl}/${storage}${path === "/" ? "" : `/${path}`}`),
    token,
  };
}

export const getFromStorage = async (path: string, options: any = {}) => {
  const { url, token } = await requestObjectAccess(path, options);
  return createRequestStream(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
};

export const uploadToStorage = async (path: string, options: any = {}) => {
  const { url, token } = await requestObjectAccess(path, options);
  return createUploadStream(url, {
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
      "Content-Type": options.contentType || "application/octet-stream",
    },
  });
};

export const deleteFromStorage = async (path: string, options: any = {}) => {
  const { url, token } = await requestObjectAccess(path, options);
  return createRequestStream(url, {
    method: "DELETE",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
};
