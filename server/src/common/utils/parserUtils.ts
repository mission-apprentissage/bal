// @ts-ignore
import { captureException } from "@sentry/node";
import csvToJson from "convert-csv-to-json";
import { parse } from "csv-parse";
import { isEmpty, pickBy } from "lodash-es";
import XLSX from "xlsx";

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
    const worksheet = workbook.Sheets[sheet_name_list[0]];
    const json = XLSX.utils.sheet_to_json<unknown>(worksheet, opt);

    return json;
  } catch (err) {
    captureException(err);
    return null;
  }
};

export const getJsonFromCsvFile = (fileInputName: string, delimiter = ";") => {
  csvToJson.fieldDelimiter(delimiter);
  return csvToJson.getJsonFromCsv(fileInputName);
};

export const getJsonFromCsvData = <T>(data: string, delimiter = ";"): T[] => {
  csvToJson.fieldDelimiter(delimiter);
  return csvToJson.latin1Encoding().csvStringToJson(data);
};

export function parseCsv(options = {}) {
  return parse({
    trim: true,
    delimiter: ";",
    columns: true,
    on_record: (record) => {
      return pickBy(record, (v) => {
        return !isEmpty(v) && v.trim().length;
      });
    },
    ...options,
  });
}
