import fs from "node:fs/promises";

import { get } from "lodash-es";
import { ColorTypes, PDFDocument, PDFPage } from "pdf-lib";
import cerfaFields from "shared/helpers/cerfa/schema";

import { getStaticFilePath } from "../../../common/utils/getStaticFilePath";

const PATH_CERFA_ERROR_TEMPLATE_FIRST = getStaticFilePath("./cerfa/cerfa_template_error_first.pdf");
const PATH_CERFA_ERROR_TEMPLATE_N = getStaticFilePath("./cerfa/cerfa_template_error_n.pdf");
const PATH_CERFA_ERROR_TEMPLATE_LAST = getStaticFilePath("./cerfa/cerfa_template_error_last.pdf");

type CerfaError = { message: string; type: string };
type NestedError = Record<string, CerfaError>;
type CerfaErrors = Record<string, CerfaError | NestedError>;

const ERROR_LINE_SIZE = 12;
const TITLE_LINE_SIZE = 14;
const LINE_HEIGHT = 24;
const CIRCLE_SIZE = 8;
const LINE_X = 40;
const CIRCLE_X = LINE_X + CIRCLE_SIZE;
const ERROR_X = CIRCLE_X + CIRCLE_SIZE + 5;
const ERROR_Y_OFFSET = CIRCLE_SIZE / 3;
const PAGE_MAX_LINES = 25;
const FIRST_PAGE_OFFSET = 730;
const N_PAGE_OFFSET = 800;

const isError = (error: CerfaError | NestedError): error is CerfaError => {
  if (!error) return false;
  return "type" in error && "message" in error;
};

interface Line {
  type: "block" | "field";
  content: string;
}

const mergedBlocks: Record<string, string> = {
  employeur: "Employeur",
  apprenti: "Apprenti",
  maitre1: "Maître d'apprentissage",
  maitre2: "Maître d'apprentissage",
  contrat: "Contrat",
  formation: "Formation",
  organismeFormation: "Formation",
  etablissementFormation: "Formation",
  signatures: "Signatures",
};

interface PDFPagination {
  pageNumber: number;
  totalPages: number;
  isLast?: boolean;
}

const addTemplateErrorPage = async (cerfaPdfDoc: PDFDocument, pagination: PDFPagination): Promise<PDFPage> => {
  const pageText = { x: 550, y: 28, size: 11 };

  if (pagination.pageNumber === 1) {
    const template = await fs.readFile(PATH_CERFA_ERROR_TEMPLATE_FIRST);
    const document = await PDFDocument.load(template);

    const [page] = await cerfaPdfDoc.copyPages(document, [0]);
    page.drawText(`${pagination.pageNumber}/${pagination.totalPages}`, pageText);
    return cerfaPdfDoc.addPage(page);
  }

  if (pagination.isLast) {
    const template = await fs.readFile(PATH_CERFA_ERROR_TEMPLATE_LAST);
    const document = await PDFDocument.load(template);

    const [page] = await cerfaPdfDoc.copyPages(document, [0]);

    return cerfaPdfDoc.addPage(page);
  }

  const template = await fs.readFile(PATH_CERFA_ERROR_TEMPLATE_N);
  const document = await PDFDocument.load(template);

  const [page] = await cerfaPdfDoc.copyPages(document, [0]);

  // draw page number
  page.drawText(`${pagination.pageNumber}/${pagination.totalPages}`, pageText);
  return cerfaPdfDoc.addPage(page);
};

export const drawCerfaErrors = async (document: PDFDocument, errors: CerfaErrors) => {
  let lines: Line[] = [];

  let newBlock = true;
  let previousBlock = "";
  Object.entries(cerfaFields).map(([name]) => {
    const blockName = name.split(".")[0];
    const blockDisplayName = mergedBlocks[blockName];
    if (previousBlock !== blockDisplayName) {
      newBlock = true;
      previousBlock = blockDisplayName;
    }

    if (newBlock) {
      lines = [...lines, { type: "block", content: blockDisplayName }];
      newBlock = false;
    }
    const error = get(errors, name);
    if (error && isError(error)) {
      lines = [...lines, { type: "field", content: error.message }];
    }
  });

  const totalPages = Math.ceil(lines.length / PAGE_MAX_LINES);
  let page = await addTemplateErrorPage(document, {
    pageNumber: 1,
    totalPages,
  });
  let pageNumber = 1;
  let drawnLines = 0;
  let y = FIRST_PAGE_OFFSET;

  for (const line of lines) {
    if (line.type === "block") {
      y -= LINE_HEIGHT * 2;
      page.drawText(line.content, {
        x: LINE_X,
        y,
        size: TITLE_LINE_SIZE,
      });
      drawnLines += 2;
    } else {
      y -= LINE_HEIGHT;

      page.drawCircle({
        x: CIRCLE_X,
        y: y + ERROR_Y_OFFSET,
        size: CIRCLE_SIZE,
        // #000091
        borderColor: { type: ColorTypes.RGB, red: 0, green: 0, blue: 145 },
        opacity: 0,
      });
      page.drawText(line.content, { x: ERROR_X, y, size: ERROR_LINE_SIZE });
      drawnLines += 1;
    }
    if (drawnLines > PAGE_MAX_LINES) {
      pageNumber += 1;
      page = await addTemplateErrorPage(document, {
        pageNumber,
        totalPages,
        isLast: pageNumber === totalPages,
      });
      y = N_PAGE_OFFSET;
      drawnLines = 0;
    }
  }
};
