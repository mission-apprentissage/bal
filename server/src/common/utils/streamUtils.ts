import { Transform } from "node:stream";
import type { TransformCallback, TransformOptions } from "node:stream";
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

export function createBatchTransformStream(size: number): Transform {
  let currentBatch: unknown[] = [];

  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      currentBatch.push(chunk);

      if (currentBatch.length >= size) {
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

type AccumulateDataOptions<TAcc> = TransformOptions & { accumulator?: TAcc };

type AccumulateDataCallback<TInput, TOutput, TAcc> = (
  acc: TAcc,
  data: TInput,
  flush: (data: TOutput) => void
) => TAcc | Promise<TAcc>;

function accumulateData<TInput, TOutput, TAcc = TInput>(
  accumulate: AccumulateDataCallback<TInput, TOutput, TAcc>,
  options: AccumulateDataOptions<TAcc> = {}
): Transform {
  const { accumulator, ...rest } = options;
  let acc = (accumulator === undefined ? null : accumulator) as TAcc;
  let flushed = false;

  return new Transform({
    objectMode: true,
    ...rest,
    async transform(this: Transform, chunk: TInput, _encoding: BufferEncoding, callback: TransformCallback) {
      try {
        flushed = false;
        acc = await accumulate(acc, chunk, (data: TOutput) => {
          flushed = true;
          this.push(data);
        });

        callback();
      } catch (e) {
        callback(e as Error);
      }
    },
    flush(this: Transform, callback: TransformCallback) {
      if (!flushed && acc !== undefined && acc !== null) {
        this.push(acc);
      }
      callback();
    },
  });
}

type GroupDataOptions<TInput> = {
  size?: number;
} & AccumulateDataOptions<TInput[]>;

/**
 * Groups incoming stream data into batches of a given size.
 *
 * @param options Configuration with group size and optional initial accumulator
 * @returns A Transform stream emitting arrays of grouped items
 */
export function groupStreamData<TInput>(options: GroupDataOptions<TInput> = {}): Transform {
  return accumulateData<TInput, TInput[], TInput[]>(
    (acc, data, flush) => {
      const group = [...acc, data];
      const groupSize = options.size || 1;

      if (group.length === groupSize) {
        flush(group);
        return [];
      }

      return group;
    },
    {
      ...options,
      accumulator: [],
    }
  );
}
