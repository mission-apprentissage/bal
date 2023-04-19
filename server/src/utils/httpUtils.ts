import https from "https";
import { parse as parseUrl } from "url";

import logger from "./logger";

export async function createRequestStream(url: string, httpOptions = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      ...parseUrl(url),
      method: "GET",
      ...httpOptions,
    };

    logger.info(`Send http request [${options.method}] ${url}...`);
    const req = https.request(options, (res: any) => {
      if (res.statusCode >= 400) {
        reject(
          new Error(`Unable to get ${url}. Status code ${res.statusCode}`)
        );
      }

      resolve(res);
    });
    req.end();
  });
}

export function createUploadStream(url: string, httpOptions = {}) {
  const options = {
    ...parseUrl(url),
    method: "PUT",
    ...httpOptions,
  };

  logger.info(`Uploading ${url}...`);
  return https.request(options);
}
