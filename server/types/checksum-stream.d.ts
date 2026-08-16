declare module "checksum-stream" {
  import type { TransformStream } from "stream"

  interface Options {
    size?: number
    digest?: string
    algorithm: string
  }
  function checksumStream(opt: Options): TransformStream
  export = checksumStream
}
