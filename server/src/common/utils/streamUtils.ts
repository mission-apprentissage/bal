import { Transform } from "node:stream";
import { compose as _compose, transformData } from "oleoduc";
import streamJson from "stream-json";
import streamers from "stream-json/streamers/StreamArray.js";
import { parse } from "zod/v4/core";
import type { $ZodType, $ZodArray } from "zod/v4/core";

export function createToJsonTransformStream<T extends $ZodType>({
  schema,
  opt = { noParse: false },
}: {
  schema: $ZodArray<T> | null;
  opt?: { noParse?: boolean };
}): Transform {
  let inited = false;
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: false,
    transform(chunk, _encoding, callback) {
      try {
        if (!inited) {
          this.push("[");
          inited = true;
        } else {
          this.push(",\n");
        }
        this.push(
          opt.noParse ? JSON.stringify(chunk) : JSON.stringify(schema ? parse(schema._zod.def.element, chunk) : chunk)
        );
        callback();
      } catch (error) {
        callback(error);
      }
    },
    flush(callback) {
      if (!inited) {
        this.push("[");
      }
      this.push("]");
      callback();
    },
  });
}

export function streamJsonArray() {
  return _compose(
    streamJson.parser(),
    streamers.streamArray(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformData((data: any) => data.value)
  );
}
