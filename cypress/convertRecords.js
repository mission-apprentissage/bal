import { cypressStringifyChromeRecording } from "@cypress/chrome-recorder";

import { readFileSync } from "node:fs";

const recordingContent = readFileSync(
  "cypress/records/admin/can-access-upload-page.json"
);
console.log(JSON.parse(recordingContent));

let stringifiedContent = await cypressStringifyChromeRecording(
  recordingContent
);
stringifiedContent = stringifiedContent.replace(
  /\.type\(">(.*)"\)/,
  '.should("contain", "$1")'
);
console.log(stringifiedContent);
// return stringifiedContent;
