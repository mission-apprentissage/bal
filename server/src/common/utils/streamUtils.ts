// import type { Readable, Writable } from "node:stream";
import { Readable, Transform, Writable } from "node:stream";

import type { AbstractCursor } from "mongodb";
import { compose as _compose } from "oleoduc";
import streamJson from "stream-json";
import streamers from "stream-json/streamers/StreamArray.js";
import type { z, ZodArray, ZodType, ZodTypeAny } from "zod";

type Options = {
  size: number;
};

export function compose<I extends Readable | Transform, O extends Writable | Transform>(
  ...streams: [I, ...Transform[], O]
): I & O {
  return _compose(...streams);
}

export function createBatchTransformStream(opts: Options): Transform {
  let currentBatch: unknown[] = [];

  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      currentBatch.push(chunk);

      if (currentBatch.length >= opts.size) {
        this.push(currentBatch);
        currentBatch = [];
      }

      callback();
    },
    flush(callback) {
      if (currentBatch.length > 0) {
        this.push(currentBatch);
      }
      callback();
    },
  });
}

export function createChangeBatchCardinalityTransformStream(opts: Options): Transform {
  let currentBatch: unknown[] = [];

  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      if (!Array.isArray(chunk)) {
        callback(new Error("Expected an array"));
      }

      for (const item of chunk) {
        currentBatch.push(item);

        if (currentBatch.length >= opts.size) {
          this.push(currentBatch);
          currentBatch = [];
        }
      }

      callback();
    },
    flush(callback) {
      if (currentBatch.length > 0) {
        this.push(currentBatch);
      }
      callback();
    },
  });
}

export function createJsonLineTransformStream(): Transform {
  return compose(
    streamJson.parser(),
    streamers.streamArray(),
    new Transform({
      objectMode: true,
      transform(chunk, _encoding, callback) {
        callback(null, chunk.value);
      },
    })
  );
}

export function createToJsonTransformStream<T extends ZodTypeAny>({
  schema,
  opt = { noParse: false },
}: {
  schema: ZodArray<T, "many"> | null;
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
        this.push(opt.noParse ? JSON.stringify(chunk) : JSON.stringify(schema ? schema.element.parse(chunk) : chunk));
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

export function createResponseStream<Z extends ZodType>(
  cursor: AbstractCursor<z.output<Z>>,
  schema: ZodArray<Z>
): z.output<Z>[] {
  const transformStream = createToJsonTransformStream({ schema });

  // In order to satisfy typechecker for response.send method we need to cast the transformStream to z.output<Z>[]
  // This is safe because we know that the transformStream will only output z.output<Z> items
  // And we also keep type safety with cursor and response schema
  return (
    cursor
      .stream()
      .on("error", (error) => {
        transformStream.destroy(error);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .pipe(createToJsonTransformStream({ schema })) as any
  );
}
