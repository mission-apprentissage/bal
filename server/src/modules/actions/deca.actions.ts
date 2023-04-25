// @ts-ignore
import { accumulateData, oleoduc, writeData } from "oleoduc";
import { SIRET_REGEX } from "shared/constants";
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";

import * as crypto from "../../utils/cryptoUtils";
import { getFromStorage } from "../../utils/ovhUtils";
import { getJsonFromCsvData } from "../../utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import { createDocumentContent } from "./documentContent.actions";

interface ContentLine {
  SIRET: string;
  EMAIL?: string;
}

interface ParsedContentLine {
  siret: string;
  emails: string[];
}

export const parseContentLine = (
  line: ContentLine
): ParsedContentLine | undefined => {
  if (!line.EMAIL) return;
  if (!SIRET_REGEX.test(line.SIRET)) return;

  const { SIRET: siret } = line;

  // remove {}
  const cleanedEmailLine = line.EMAIL?.replace(/[{}]/g, "") ?? "";
  // split emails and remove non valid emails
  let emails = cleanedEmailLine
    .split(",")
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  // remove duplicates
  emails = [...new Set(emails)];

  if (!emails.length) return;

  return { siret, emails };
};

export const handleDecaFileContent = async (document: IDocument) => {
  const stream = await getFromStorage(document.chemin_fichier);

  let content: ContentLine[] = [];

  await oleoduc(
    stream,
    crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
    accumulateData(
      (acc: Uint8Array, value: ArrayBuffer) => {
        return Buffer.concat([acc, Buffer.from(value)]);
      },
      { accumulator: Buffer.from(new Uint8Array()) }
    ),
    writeData(async (data: Buffer) => {
      if (document.ext_fichier === "csv") {
        content = getJsonFromCsvData(data.toString(), "|");
      }
    })
  );

  let documentContents: IDocumentContent[] = [];

  for (const line of content) {
    const contentLine = parseContentLine(line);

    if (!contentLine) {
      continue;
    }

    const documentContent = await createDocumentContent({
      content: contentLine,
      document_id: document._id.toString(),
      updated_at: new Date(),
      created_at: new Date(),
    });

    if (!documentContent) continue;

    documentContents = [...documentContents, documentContent];
  }

  // Create or update person

  return documentContents;
};
