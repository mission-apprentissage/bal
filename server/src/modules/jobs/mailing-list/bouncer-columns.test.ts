import { describe, expect, it } from "vitest"
import { toBounceColumns } from "./bouncer-columns"

describe("toBounceColumns", () => {
  it("should flatten multi-line SMTP messages", async () => {
    const columns = toBounceColumns({
      status: "error",
      message: "Connection to SMTP server failed",
      responseCode: "554",
      responseMessage: "554-No SMTP service\r\n554-Invalid DNS PTR resource record\r\n554 For explanation visit https://postmaster.example.com",
    })

    expect(columns).toEqual({
      bounce_status: "error",
      bounce_message: "Connection to SMTP server failed",
      bounce_response_code: "554",
      bounce_response_message: "554-No SMTP service | 554-Invalid DNS PTR resource record | 554 For explanation visit https://postmaster.example.com",
    })
    expect(columns.bounce_response_message).not.toMatch(/[\r\n]/)
  })

  it("should handle bare line-feeds and null values", async () => {
    const columns = toBounceColumns({
      status: "valid",
      message: "ligne 1\nligne 2",
      responseCode: null,
      responseMessage: null,
    })

    expect(columns.bounce_message).toBe("ligne 1 | ligne 2")
    expect(columns.bounce_response_code).toBe("")
    expect(columns.bounce_response_message).toBe("")
  })
})
