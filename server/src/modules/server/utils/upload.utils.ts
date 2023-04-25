import { PassThrough } from "stream";

export const noop = () => {
  return new PassThrough();
};
