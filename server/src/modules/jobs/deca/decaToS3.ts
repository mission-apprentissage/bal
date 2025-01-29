import { PassThrough } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

import { s3Upload } from "../../../common/utils/awsUtils";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { createToJsonTransformStream } from "../../../common/utils/streamUtils";

const bucket = "storage"; // Replace with your bucket name
const fileKey = "deca_export.json.gz"; // Replace with your file key

// Stream data from MongoDB to upload to S3
export const streamDataToParquetAndS3 = async (): Promise<void> => {
  try {
    // Fetch data with a cursor from MongoDB
    const cursor = await getDbCollection("deca").find();
    const transformStream = createToJsonTransformStream({ schema: null, opt: { noParse: true } });
    const gzip = createGzip();

    const passThrough = new PassThrough();

    // Start S3 upload
    const uploadPromise = s3Upload(bucket, fileKey, {
      Body: passThrough,
      ContentEncoding: "gzip",
    });
    await pipeline(cursor.stream(), transformStream, gzip, passThrough);

    // Ensure upload completes
    await uploadPromise;

    console.log("File successfully uploaded to S3!");
  } catch (error) {
    console.error("Error during processing:", error);
  }
};
