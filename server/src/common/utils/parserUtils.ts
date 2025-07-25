import Boom from "@hapi/boom";
import { captureException } from "@sentry/node";
import type { Options } from "csv-parse";
import { parse } from "csv-parse";
import { isEmpty, pickBy } from "lodash-es";
import type { WorkSheet } from "xlsx";
import XLSX from "xlsx";

export const DEFAULT_DELIMITER = ";";

const readXLSXData = (
  data: unknown,
  readOpt: XLSX.ParsingOptions = {
    codepage: 65001,
    cellDates: true,
    dateNF: "dd/MM/yyyy",
  }
) => {
  const workbook = XLSX.read(data, readOpt);
  return { sheet_name_list: workbook.SheetNames, workbook };
};

export const getJsonFromXlsxData = (
  data: unknown,
  opt: XLSX.Sheet2JSONOpts = { raw: false },
  readOpt: XLSX.ParsingOptions = {
    codepage: 65001,
    cellDates: true,
    dateNF: "dd/MM/yyyy",
  }
) => {
  try {
    const { sheet_name_list, workbook } = readXLSXData(data, readOpt);

    const firstSheet = sheet_name_list[0];
    if (!firstSheet) {
      throw Boom.badRequest("Le fichier excel ne contient aucune feuille de calcul");
    }

    const worksheet = workbook.Sheets[firstSheet] as WorkSheet;
    const json = XLSX.utils.sheet_to_json<unknown>(worksheet, opt);

    return json;
  } catch (err) {
    captureException(err);
    return null;
  }
};

export function parseCsv(options: Options = {}) {
  return parse({
    trim: true,
    delimiter: DEFAULT_DELIMITER,
    columns: true,
    bom: true,
    relax_column_count: true,
    on_record: (record) => {
      return pickBy(record, (v) => {
        return !isEmpty(v) && v.trim().length;
      });
    },
    ...options,
  });
}
