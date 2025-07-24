import type { Stream } from "stream";

declare module "checksum-stream" {
  interface Options {
    size?: number;
    digest?: string;
    algorithm: string;
  }
  function checksumStream(opt: Options): Stream;
  export = checksumStream;
}
