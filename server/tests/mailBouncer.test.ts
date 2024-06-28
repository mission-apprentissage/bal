import { createReadStream, createWriteStream } from "fs";
import { join } from "path";
import { describe, it } from "vitest";

import { verifyCsv } from "../src/common/services/mailer/mailBouncer";
import { __dirname } from "../src/common/utils/esmUtils";

describe("verifyCsv", () => {
  it("should verify csv", async () => {
    const input = createReadStream(join(__dirname(import.meta.url), "lba_campagne_1.csv"));
    const output = createWriteStream(join(__dirname(import.meta.url), "lba_campagne_2_out.csv"));
    await verifyCsv(input, output);
  }, 900_000);
});
