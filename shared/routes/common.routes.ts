export const SResError = {
  type: "object",
  properties: {
    type: { type: "string" },
    message: { type: "string" },
  },
  required: ["type", "message"],
} as const;
