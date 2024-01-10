import { captureException } from "@sentry/node";
import Ftp from "basic-ftp";
import { Writable } from "stream";

import config from "../../config";
import logger from "../logger";

class FTPClient {
  client = new Ftp.Client();

  /**
   * @description Open an FTP connection
   * @param {object} options
   */
  async connect(options: Ftp.AccessOptions) {
    logger.info(`Connecting to FTP....`);

    try {
      await this.client.access(options);
    } catch (error) {
      captureException(error);
      logger.error("FTP connection failed", error);
    }
  }

  async list() {
    console.log(await this.client.list());
  }

  /**
   * @description Disconnect an FTP connection
   */
  async disconnect() {
    logger.info(`Closing FTP....`);
    await this.client.close();
    logger.info(`Connection closed.`);
  }

  /**
   * @description Download a file from a remote FTP location
   */
  async downloadFile(remoteFile: string, destination: Writable | string) {
    try {
      this.client.trackProgress((info) => logger.info(`${(info.bytes / 1000000).toFixed(2)} MB`));
      await this.client.downloadTo(destination, remoteFile);
      this.client.trackProgress();
      logger.info(`File successfully downloaded.`);
    } catch (error) {
      captureException(error);
      logger.error("Download failed:", error);
    }
  }
}

export { FTPClient };

export const initFtpConnection = async (destination: Writable, ftp: { user: string; password: string }) => {
  const opt = {
    host: config.ftp.host,
    user: ftp.user,
    password: ftp.password,
    port: 21,
  };

  const client = new FTPClient();

  await client.connect(opt);

  destination.addListener("end", async () => {
    setTimeout(async () => {
      await client.disconnect();
    }, 1000);
  });

  return client;
};
