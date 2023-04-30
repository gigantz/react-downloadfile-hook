import { useMemo } from "react";
import { HintedString } from "./interface";
import { MimeType } from "./interface";

function forceDownload(fileName, blobUrl) {
  var anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
}

interface UseDownloadFileProps<T> {
  /**
   * Provide file name with extension (e.g. file.pdf)
   * @type {string}
   */
  fileName: string;
  /**
   * Provide mime type (e.g. image/png)
   * @type {string}
   */
  format: HintedString<MimeType>;
  /**
   * Data to put into blob instance (e.g. string, Uint8Array, ArrayBuffer)
   * @type {any}
   */
  data: string | T;
  /**
   * Callback to handle blob creation
   * @type {function}
   */
  onCreateBlob?: (data: T, format: HintedString<MimeType>) => Blob;
}

export function useDownloadFile<T = Blob>({
  fileName,
  format,
  data,
  onCreateBlob,
}: UseDownloadFileProps<T>) {
  const blobUrl = useMemo(() => {
    let blob;
    if (!(data instanceof Blob)) {
      blob = onCreateBlob
        ? onCreateBlob(data as T, format)
        : new Blob([data as string], { type: format });
    } else {
      blob = data;
    }
    return URL.createObjectURL(blob);
  }, [format, data, onCreateBlob]);

  const downloadFile = () => forceDownload(fileName, blobUrl);

  const linkProps = {
    download: fileName,
    href: blobUrl,
  };

  return {
    downloadFile,
    linkProps,
  };
}
