import { buildBouncerEmailFixture, buildBouncerPing, buildComputedLineFixture, buildMailingListFixture } from "@tests/utils/mailing-list.test.utils"
import { useMongo } from "@tests/utils/mongo.utils"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { getDbCollection } from "@/common/utils/mongodbUtils"
import { refreshBouncerStatuses } from "@/modules/jobs/mailing-list/bouncer-refresh"

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

describe("refreshBouncerStatuses", () => {
  it("should update only the error lines whose cached ping got resolved, with sanitized columns", async () => {
    const mailingList = buildMailingListFixture()
    await getDbCollection("mailingListsV2").insertOne(mailingList)

    await getDbCollection("mailingList.computed").insertMany([
      // e1 : en erreur, résolu dans le cache (avec message multi-ligne à aplatir)
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 1, email: "e1@exemple.fr", emailStatus: "valid", bounceStatus: "error" }),
      // e2 : en erreur, toujours en erreur dans le cache
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 2, email: "e2@exemple.fr", emailStatus: "valid", bounceStatus: "error" }),
      // e3 : déjà valide — ne doit pas être touché même si le cache a une autre valeur
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 3, email: "e3@exemple.fr", emailStatus: "valid", bounceStatus: "valid" }),
    ])

    await getDbCollection("bouncer.email").insertMany([
      buildBouncerEmailFixture("e1@exemple.fr", buildBouncerPing("valid", "250 OK\r\n250 Accepted")),
      buildBouncerEmailFixture("e2@exemple.fr", buildBouncerPing("error")),
      buildBouncerEmailFixture("e3@exemple.fr", buildBouncerPing("invalid")),
    ])

    const refreshedCount = await refreshBouncerStatuses(mailingList, new AbortController().signal)

    expect(refreshedCount).toBe(1)

    const lines = await getDbCollection("mailingList.computed").find({ mailing_list_id: mailingList._id }).sort({ line_number: 1 }).toArray()

    expect(lines[0].data.bounce_status).toBe("valid")
    expect(lines[0].data.bounce_response_message).toBe("250 OK | 250 Accepted")
    expect(lines[1].data.bounce_status).toBe("error")
    expect(lines[1].data.bounce_message).toBe("message initial")
    expect(lines[2].data.bounce_status).toBe("valid")
    expect(lines[2].data.bounce_message).toBe("message initial")
  })

  it("should update every line sharing a resolved email, and not touch other lists", async () => {
    const mailingList = buildMailingListFixture()
    const otherList = buildMailingListFixture()
    await getDbCollection("mailingListsV2").insertMany([mailingList, otherList])

    await getDbCollection("mailingList.computed").insertMany([
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 1, email: "dup@exemple.fr", emailStatus: "valid", bounceStatus: "error" }),
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 2, email: "dup@exemple.fr", emailStatus: "valid", bounceStatus: "error" }),
      buildComputedLineFixture({ mailingListId: otherList._id, lineNumber: 1, email: "dup@exemple.fr", emailStatus: "valid", bounceStatus: "error" }),
    ])

    await getDbCollection("bouncer.email").insertOne(buildBouncerEmailFixture("dup@exemple.fr", buildBouncerPing("valid")))

    const refreshedCount = await refreshBouncerStatuses(mailingList, new AbortController().signal)

    expect(refreshedCount).toBe(2)

    const otherLine = await getDbCollection("mailingList.computed").findOne({ mailing_list_id: otherList._id })
    expect(otherLine?.data.bounce_status).toBe("error")
  })

  it("should be a no-op when the list has no error line", async () => {
    const mailingList = buildMailingListFixture()
    await getDbCollection("mailingListsV2").insertOne(mailingList)
    await getDbCollection("mailingList.computed").insertOne(
      buildComputedLineFixture({ mailingListId: mailingList._id, lineNumber: 1, email: "ok@exemple.fr", emailStatus: "valid", bounceStatus: "valid" })
    )

    await expect(refreshBouncerStatuses(mailingList, new AbortController().signal)).resolves.toBe(0)
  })
})
