import type { Readable, Writable } from "node:stream";
import { Transform } from "node:stream";

import type { AbstractCursor } from "mongodb";
import { compose as _compose, transformData } from "oleoduc";
import streamJson from "stream-json";
import jsonFilters from "stream-json/filters/Pick.js";
import streamers from "stream-json/streamers/StreamArray.js";
import type { z } from "zod/v4-mini";
import { parse } from "zod/v4/core";
import type { $ZodType, $ZodArray } from "zod/v4/core";

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

export function createResponseStream<Z extends $ZodType>(
  cursor: AbstractCursor<z.output<Z>>,
  schema: $ZodArray<Z>
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

// @ts-expect-error
export function streamNestedJsonArray(arrayPropertyName) {
  return _compose(
    streamJson.parser(),
    jsonFilters.pick({ filter: arrayPropertyName }),
    streamers.streamArray(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformData((data: any) => data.value)
  );
}

export function streamJsonArray() {
  return _compose(
    streamJson.parser(),
    streamers.streamArray(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformData((data: any) => data.value)
  );
}

export const streamGroupByCount = (count: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let group: any[] = [];
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      group.push(chunk);
      if (group.length === count) {
        this.push(group);
        group = [];
      }
      callback();
    },
    flush(callback) {
      if (group.length > 0) {
        this.push(group);
      }
      callback();
    },
  });
};
