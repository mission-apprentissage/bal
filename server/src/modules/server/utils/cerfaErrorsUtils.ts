import { get } from "lodash-es";
import { ColorTypes, PDFDocument, PDFPage } from "pdf-lib";
import cerfaFields from "shared/helpers/cerfa/schema";

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
const PAGE_OFFSET = 750;

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

export const drawCerfaErrors = (document: PDFDocument, errors: CerfaErrors) => {
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

  let drawnLines = 0;
  let page: PDFPage = document.addPage();
  let y = PAGE_OFFSET;

  lines.forEach((line) => {
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
      page = document.addPage();
      y = PAGE_OFFSET;
      drawnLines = 0;
    }
  });
};
