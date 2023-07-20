import { cypressStringifyChromeRecording } from "@cypress/chrome-recorder";

import { readFileSync } from "node:fs";

const recordingContent = readFileSync(
  "cypress/records/admin/canSeeUploadPage.json"
);
// console.log(JSON.parse(recordingContent));

const stringifiedContent = await cypressStringifyChromeRecording(
  recordingContent
);
console.log(stringifiedContent);
// cy.get("h1").should("contain", "BAL");
// return stringifiedContent;
