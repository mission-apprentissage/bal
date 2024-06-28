import bunyan from "bunyan";
import PrettyStream from "bunyan-prettystream";

import config from "@/config";

const createStreams = () => {
  const { type, level } = config.log;

  if (process.env.NODE_ENV === "test") {
    return [];
  }

  const jsonStream = () => {
    return {
      name: "json",
      level,
      stream: process.stdout,
    };
  };

  const consoleStream = () => {
    const pretty = new PrettyStream();
    pretty.pipe(process.stdout);
    return {
      name: "console",
      level,
      stream: pretty,
    };
  };

  const streams = type === "console" ? [consoleStream()] : [jsonStream()];

  return streams;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorSerialiser(err: any) {
  return {
    ...bunyan.stdSerializers.err(err),
    ...(err.errInfo ? { errInfo: err.errInfo } : {}),
  };
}

export default bunyan.createLogger({
  name: config.appName,
  serializers: {
    ...bunyan.stdSerializers,
    err: errorSerialiser,
    error: errorSerialiser,
  },
  /** @ts-expect-error */
  streams: createStreams(),
});
