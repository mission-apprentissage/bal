import { atom } from "recoil";

interface DownloadOptions {
  includeErrors?: boolean;
  includeGuide?: boolean;
}

export const downloadOptionsState = atom<DownloadOptions>({
  key: "downloadOptions",
  default: {
    includeErrors: undefined,
    includeGuide: undefined,
  },
});
