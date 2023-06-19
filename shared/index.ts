import { ObjectId } from "mongodb";

import { SReqPostOrganisationValidation } from "./routes/v1/organisation.routes";

export type deserialize = [
  {
    pattern: {
      type: "string";
      format: "date-time";
    };
    output: Date;
  },
  {
    pattern: {
      type: "string";
      format: "ObjectId";
    };
    output: ObjectId;
  }
];

export const models = {
  Validation: SReqPostOrganisationValidation,
};
