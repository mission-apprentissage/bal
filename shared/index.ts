import { ObjectId } from "mongodb";

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
