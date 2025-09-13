/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PutObjectRequest, S3ClientConfig } from "@aws-sdk/client-s3";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { internal } from "@hapi/boom";
import type { StreamingBlobPayloadInputTypes } from "@smithy/types";

import config from "../../config";
import logger from "../logger";

function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

const { endpoint, region, accessKeyId, secretAccessKey, bucket: s3Buckets } = config.s3;
const configuration: S3ClientConfig = {
  credentials: { accessKeyId, secretAccessKey },
  endpoint,
  region,
  forcePathStyle: true,
};
const s3Client = new S3Client(configuration);

type Bucket = "applications" | "storage";
function getBucketName(bucket: Bucket) {
  switch (bucket) {
    case "applications":
      return s3Buckets.application;
    case "storage":
      return s3Buckets.storage;
    default:
      assertUnreachable(bucket);
  }
}

export async function s3ReadAsStream(bucket: Bucket, key: string) {
  try {
    const object = await s3Client.send(new GetObjectCommand({ Bucket: getBucketName(bucket), Key: key }));
    return object.Body?.transformToWebStream();
  } catch (error: any) {
    const newError = internal(`Error reading S3 file stream`, { key: key, bucket: getBucketName(bucket) });
    newError.cause = error.message;
    throw newError;
  }
}

export async function s3Upload(
  bucket: Bucket,
  fileKey: string,
  options: Omit<PutObjectRequest, "Body" | "Bucket" | "Key"> & { Body: StreamingBlobPayloadInputTypes }
) {
  const bucketName = getBucketName(bucket);
  try {
    logger.info("uploading s3 file:", { bucket: bucketName, key: fileKey });
    const upload = new Upload({
      client: s3Client,
      params: { Bucket: bucketName, Key: fileKey, ...options },
    });
    await upload.done();
    logger.info("upload complete:", { bucket: bucketName, key: fileKey });
  } catch (error: any) {
    const newError = internal(`Error uploading S3 file`, { key: fileKey, bucket: getBucketName(bucket) });
    newError.cause = error.message;
    throw newError;
  }
}
