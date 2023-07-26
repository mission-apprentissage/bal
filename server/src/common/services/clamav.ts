import NodeClam from "clamscan";
import tcpPortUsed from "tcp-port-used";

let promise: Promise<NodeClam> | undefined;
async function getClamscan(uri: string) {
  if (promise) {
    return promise;
  }

  const [host, port] = uri.split(":");
  if (!host) {
    throw new Error("Clamav: Missing host");
  }
  if (!port) {
    throw new Error("Clamav: Missing port");
  }

  return new Promise<NodeClam>((resolve, reject) => {
    tcpPortUsed
      .waitUntilUsedOnHost(parseInt(port), host, 500, 30000)
      .then(() => {
        const clamscan = new NodeClam().init({
          clamdscan: {
            host,
            port: parseInt(port),
          },
        });
        resolve(clamscan);
      })
      .catch(reject);
  });
}

export const createClamav = (uri: string) => {
  async function getScanner() {
    const clamscan = await getClamscan(uri);
    const scanStream = clamscan.passthrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scanResults = new Promise<any>((resolve) => {
      scanStream.on("scan-complete", (res) => {
        resolve(res);
      });
    });

    return {
      scanStream,
      getScanResults: () => scanResults,
    };
  }

  return { getScanner };
};
