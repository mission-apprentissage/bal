import fs from "node:fs/promises";

import Zip from "adm-zip";
import { get } from "lodash-es";
import { PDFBool, PDFDocument, PDFName } from "pdf-lib";

import { PdfField, pdfFields } from "../../common/utils/cerfaUtils";
import { getStaticFilePath } from "../../common/utils/getStaticFilePath";
import { drawCerfaErrors } from "../server/utils/cerfaErrorsUtils";

const PATH_EMPTY_CERFA_PDF = getStaticFilePath("./cerfa/cerfa_10103-11_modif.pdf");
const PATH_CERFA_GUIDE_PDF = getStaticFilePath("./cerfa/guide_cerfa_apprentissage.pdf");

export const getValueForPdf = (formValue: string | undefined, field: PdfField): string | boolean => {
  if (!formValue) return "";
  if (formValue === "") return "";

  return field.getValue?.(formValue) ?? formValue;
};

type remItem = {
  taux: number;
  tauxMinimal: number;
  typeSalaire: string;
  salaireBrut: number;
  ordre: "1.1" | "1.2" | "2.1" | "2.2" | "3.1" | "3.2" | "4.1" | "4.2";
};

type remOrderedBy = {
  "11": remItem;
  "12": remItem;
  "21"?: remItem;
  "22"?: remItem;
  "31"?: remItem;
  "32"?: remItem;
  "41"?: remItem;
  "42"?: remItem;
};

export const createCerfaPdf = async (rawData: Record<string, any>) => {
  const pdfCerfaEmpty = await fs.readFile(PATH_EMPTY_CERFA_PDF);

  const pdfDoc = await PDFDocument.load(pdfCerfaEmpty);

  const remunerationsOrdered = rawData.contrat.remunerationsAnnuelles?.reduce((acc: remOrderedBy, item: remItem) => {
    return {
      ...acc,
      [item.ordre.replace(".", "")]: item,
    };
  }, {} as remOrderedBy);

  const data = {
    ...rawData,
    contrat: {
      ...rawData.contrat,
      remunerationsAnnuelles: remunerationsOrdered,
    },
  };

  const form = pdfDoc.getForm();

  if (rawData.apprenti.adresse?.repetitionVoie) {
    const addr = rawData.apprenti.adresse;
    rawData.apprenti.adresse.complement = `${addr.numero ?? ""} ${addr.repetitionVoie}/${addr.complement ?? ""}`;
  }
  if (rawData.apprenti.responsableLegal?.adresse?.repetitionVoie) {
    const addr = rawData.apprenti.responsableLegal.adresse;
    rawData.apprenti.responsableLegal.adresse.complement = `${addr.numero ?? ""} ${addr.repetitionVoie}/${
      addr.complement ?? ""
    }`;
  }
  if (rawData.employeur?.adresse?.repetitionVoie) {
    const addr = rawData.employeur.adresse;
    rawData.employeur.adresse.complement = `${addr.numero ?? ""} ${addr.repetitionVoie}/${addr.complement ?? ""}`;
  }
  if (rawData.organismeFormation?.adresse?.repetitionVoie) {
    const addr = rawData.organismeFormation.adresse;
    rawData.organismeFormation.adresse.complement = `${addr.numero ?? ""} ${addr.repetitionVoie}/${
      addr.complement ?? ""
    }`;
  }
  if (rawData.etablissementFormation?.adresse?.repetitionVoie) {
    const addr = rawData.etablissementFormation.adresse;
    rawData.etablissementFormation.adresse.complement = `${addr.numero ?? ""} ${addr.repetitionVoie}/${
      addr.complement ?? ""
    }`;
  }

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

  form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.False);

  return pdfDoc.save();
};

export const createCerfaErrorsPdf = async (errors: Record<string, any>) => {
  const pdfDoc = await PDFDocument.create();

  await drawCerfaErrors(pdfDoc, errors);

  return pdfDoc.save();
};

export const createCerfaGuidePdf = async () => {
  return fs.readFile(PATH_CERFA_GUIDE_PDF);
};

interface CerfaZipOptions {
  includeErrors?: boolean;
  includeGuide?: boolean;
}

export const createCerfaZip = async (pdf: Buffer, errors: Record<string, any>, options: CerfaZipOptions) => {
  const zip = new Zip();

  zip.addFile("cerfa.pdf", pdf);

  if (options.includeErrors) {
    const errorsPdf = await createCerfaErrorsPdf(errors);
    zip.addFile("cerfa-errors.pdf", errorsPdf as Buffer);
  }

  if (options.includeGuide) {
    const guidePdf = await createCerfaGuidePdf();
    zip.addFile("cerfa-guide.pdf", guidePdf);
  }

  return zip.toBuffer();
};
