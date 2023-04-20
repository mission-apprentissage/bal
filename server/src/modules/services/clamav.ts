import NodeClam from "clamscan";
import tcpPortUsed from "tcp-port-used";

// @ts-ignore
let promise;
async function getClamscan(uri: string) {
  // @ts-ignore
  if (promise) {
    // @ts-ignore
    return promise;
  }

  return new Promise((resolve, reject) => {
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
    const scanResults = new Promise<any>((resolve) => {
      scanStream.on("scan-complete", (res: any) => {
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
