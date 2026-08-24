import { buildComputedLineFixture, buildMailingListFixture } from "@tests/utils/mailing-list.test.utils"
import { useMongo } from "@tests/utils/mongo.utils"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { getDbCollection } from "@/common/utils/mongodbUtils"
import { buildLine } from "@/modules/jobs/mailing-list/exporter/mailing-list-exporter"

const mongo = useMongo()

beforeAll(async () => {
  await mongo.beforeAll()
})

beforeEach(async () => {
  await mongo.beforeEach()
})

afterAll(async () => {
  await mongo.afterAll()
})

describe("buildLine", () => {
  it("should group valid lines by email and reconcile every counter, including merged duplicates", async () => {
    const mailingList = buildMailingListFixture()
    await getDbCollection("mailingListsV2").insertOne(mailingList)

    await getDbCollection("mailingList.computed").insertMany([
      // deux lignes valides partageant le même email normalisé → fusionnées en un seul groupe
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 1, email: "a@exemple.fr", emailStatus: "valid" }),
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 2, email: "a@exemple.fr", emailStatus: "valid" }),
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 3, email: "b@exemple.fr", emailStatus: "valid" }),
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 4, email: "pas-un-email", emailStatus: "invalid" }),
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 5, email: "", emailStatus: "empty" }),
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 6, email: "black@exemple.fr", emailStatus: "blacklisted" }),
    ])

    const lines: Record<string, string>[] = []
    for await (const line of buildLine(mailingList, new AbortController().signal)) {
      lines.push(line)
    }

    expect(lines.map((line) => line.email).toSorted()).toEqual(["a@exemple.fr", "b@exemple.fr"])

    const updated = await getDbCollection("mailingListsV2").findOne({ _id: mailingList._id })
    expect(updated?.output).toEqual({
      lines: 2,
      empty_source_lines: 1,
      blacklisted_email_count: 1,
      invalid_email_count: 1,
      // réconciliation : 6 lignes source = 2 exportées + 1 vide + 1 invalide + 1 blacklistée + 1 doublon fusionné
      duplicate_email_count: 1,
    })
  })
})
