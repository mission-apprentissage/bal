import type { IncomingMessage } from "node:http";

import https from "https";
import { urlToHttpOptions } from "url";

import logger from "@/common/logger";

export async function createRequestStream(url: string, httpOptions: https.RequestOptions = {}) {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const options = {
      ...urlToHttpOptions(new URL(url)),
      method: "GET",
      ...httpOptions,
    };

    logger.info(`Send http request [${options.method}] ${url}...`);
    const req = https.request(options, (res) => {
      if (!res?.statusCode || res.statusCode >= 400) {
        reject(new Error(`Unable to get ${url}. Status code ${res.statusCode}`));
      }

      resolve(res);
    });
    req.end();
  });
}

export function createUploadStream(url: string, httpOptions = {}) {
  const options = {
    ...urlToHttpOptions(new URL(url)),
    method: "PUT",
    ...httpOptions,
  };

  logger.info(`Uploading ${url}...`);
  return https.request(options);
}
