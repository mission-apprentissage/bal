import NodeClam from "clamscan";
import tcpPortUsed from "tcp-port-used";

let promise: Promise<NodeClam> | undefined;
async function getClamscan(uri: string) {
  if (promise) {
    return promise;
  }

  return new Promise<NodeClam>((resolve, reject) => {
    const [host, port] = uri.split(":");
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
