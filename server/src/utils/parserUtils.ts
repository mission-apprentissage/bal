// @ts-ignore
import csvToJson from "convert-csv-to-json";
import XLSX from "xlsx";

const readXLSXData = (
  data: unknown,
  readOpt = { codepage: 65001, cellDates: true, dateNF: "dd/MM/yyyy" }
) => {
  const workbook = XLSX.read(data, readOpt);
  return { sheet_name_list: workbook.SheetNames, workbook };
};

export const getJsonFromXlsxData = (
  data: unknown,
  opt: { raw: boolean } = { raw: false },
  readOpt: { codepage: number; cellDates: boolean; dateNF: string } = {
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
    return null;
  }
};

export const getJsonFromCsvFile = (fileInputName: string, delimiter = ";") => {
  csvToJson.fieldDelimiter(delimiter);
  return csvToJson.getJsonFromCsv(fileInputName);
};

export const getJsonFromCsvData = (data: string, delimiter = ";") => {
  csvToJson.fieldDelimiter(delimiter);
  return csvToJson.latin1Encoding().csvStringToJson(data);
};
