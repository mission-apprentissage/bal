import fs from "node:fs/promises";

import { get } from "lodash-es";
import { PDFDocument } from "pdf-lib";

import { PdfField, pdfFields } from "../../common/utils/cerfaUtils";
import { getStaticFilePath } from "../../common/utils/getStaticFilePath";

const PATH_EMPTY_CERFA_PDF = getStaticFilePath("./cerfa/cerfa_10103-11.pdf");

export const getValueForPdf = (formValue: string | undefined, field: PdfField): string | boolean => {
  if (!formValue) return "";
  if (formValue === "") return "";

  return field.getValue?.(formValue) ?? formValue;
};

export const createCerfaPdf = async (data: Record<string, any>) => {
  const pdfCerfaEmpty = await fs.readFile(PATH_EMPTY_CERFA_PDF);

  const pdfDoc = await PDFDocument.load(pdfCerfaEmpty);

  const form = pdfDoc.getForm();
  pdfFields
    .filter((field) => field.attribute && field.type === "PDFTextField")
    .forEach((field) => {
      const pdfField = form.getTextField(field.name);
      const formValue = get(data, field.attribute as string);
      const value = getValueForPdf(formValue, field);

      // console.log({ attribute: field.attribute, name: field.name, formValue, value });

      pdfField.setText(`${value}` as string);
    });

  pdfFields
    .filter((field) => field.attribute && field.type === "PDFCheckBox")
    .forEach((field) => {
      const pdfField = form.getCheckBox(field.name);
      const formValue = get(data, field.attribute as string);
      const value = getValueForPdf(formValue, field);

      if (value) {
        pdfField.check();
      } else {
        pdfField.uncheck();
      }
    });

  return pdfDoc.saveAsBase64({ updateFieldAppearances: false, dataUri: true });
};
