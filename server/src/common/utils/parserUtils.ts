import type { Options } from "csv-parse";
import { parse } from "csv-parse";
import { isEmpty, pickBy } from "lodash-es";

export const DEFAULT_DELIMITER = ";";

export function parseCsv(options: Options = {}) {
  return parse({
    trim: true,
    delimiter: DEFAULT_DELIMITER,
    columns: true,
    bom: true,
    relax_column_count: true,
    on_record: ((record: Record<string, string>) => {
      return pickBy(record, (v) => {
        return !isEmpty(v) && v.trim().length;
      });
    }) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    ...options,
  });
}
