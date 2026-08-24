import { buildComputedLineFixture } from "@tests/utils/mailing-list.test.utils"
import { useMongo } from "@tests/utils/mongo.utils"
import { ObjectId } from "mongodb"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { getDbCollection } from "@/common/utils/mongodbUtils"
import { up } from "@/migrations/20260824090000-mailing-list-output-refinements"

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

describe("20260824090000-mailing-list-output-refinements", () => {
  it("should sanitize multi-line SMTP messages in existing computed lines", async () => {
    const mailingListId = new ObjectId()

    const multiLine = buildComputedLineFixture({ mailingListId, lineNumber: 1, email: "a@exemple.fr", emailStatus: "valid", bounceStatus: "error" })
    multiLine.data.bounce_response_message = "554-No SMTP service\r\n554-Invalid DNS PTR resource record\r\n554 For explanation visit https://postmaster.example.com"

    const cleanLine = buildComputedLineFixture({ mailingListId, lineNumber: 2, email: "b@exemple.fr", emailStatus: "valid", bounceStatus: "valid" })

    // Ligne sans colonnes bounce (liste sans colonne BOUNCER) : la migration ne doit pas créer les champs
    const noBounceLine = buildComputedLineFixture({ mailingListId, lineNumber: 3, email: "c@exemple.fr", emailStatus: "valid" })

    await getDbCollection("mailingList.computed").insertMany([multiLine, cleanLine, noBounceLine])

    await up()

    const lines = await getDbCollection("mailingList.computed").find({ mailing_list_id: mailingListId }).sort({ line_number: 1 }).toArray()

    expect(lines[0].data.bounce_response_message).toBe("554-No SMTP service | 554-Invalid DNS PTR resource record | 554 For explanation visit https://postmaster.example.com")
    expect(lines[0].data.bounce_message).toBe("message initial")
    expect(lines[1].data.bounce_response_message).toBe("")
    expect(lines[2].data.bounce_message).toBeUndefined()
    expect(lines[2].data.bounce_response_message).toBeUndefined()
  })
})
