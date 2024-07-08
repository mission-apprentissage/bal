import { IMailingList } from "../models/mailingList.model";

export const MAILING_LIST_COMPUTED_COLUMNS = {
  WEBHOOK_LBA: {
    key: "WEBHOOK_LBA",
    columns: [
      { column: "lien_lba", output: "lien_lba", simple: true },
      { column: "lien_prdv", output: "lien_prdv", simple: true },
    ] as IMailingList["output_columns"],
    sample: "Données récupérées depuis LBA",
  },
  BOUNCER: {
    key: "BOUNCER",
    columns: [
      { column: "bounce_status", output: "bounce_status", simple: true },
      { column: "bounce_message", output: "bounce_message", simple: true },
      { column: "bounce_response_code", output: "bounce_response_code", simple: true },
      { column: "bounce_response_message", output: "bounce_response_message", simple: true },
    ] as IMailingList["output_columns"],
    sample: "Données générées par le bouncer BAL",
  },
};

export type IMailingListComputedColumns = typeof MAILING_LIST_COMPUTED_COLUMNS;
export type IMailingListComputedColumnsKeys = keyof IMailingListComputedColumns;

export const MAILING_LIST_COMPUTED_COLUMNS_KEYS = Object.keys(
  MAILING_LIST_COMPUTED_COLUMNS
) as IMailingListComputedColumnsKeys[];

export function isComputedColumns(column: string): column is IMailingListComputedColumnsKeys {
  return MAILING_LIST_COMPUTED_COLUMNS_KEYS.includes(column as IMailingListComputedColumnsKeys);
}

export function getMailingOutputColumns(
  mailingList: Pick<IMailingList, "output_columns">
): IMailingList["output_columns"] {
  const outputColumns: IMailingList["output_columns"] = [];

  for (const column of mailingList.output_columns) {
    if (isComputedColumns(column.column)) {
      outputColumns.push(...MAILING_LIST_COMPUTED_COLUMNS[column.column].columns);
    } else {
      outputColumns.push(column);
    }
  }

  return outputColumns;
}
