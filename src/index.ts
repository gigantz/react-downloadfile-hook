import { useCallback, useEffect, useState } from "react";
import { HintedString, MimeType } from "./interface";

function forceDownload(fileName: string, blobUrl: string) {
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
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
  const [blobUrl, setBlobUrl] = useState<string>("");

  useEffect(() => {
    const isBlob = data instanceof Blob;

    setBlobUrl(
      URL.createObjectURL(
        isBlob
          ? data
          : onCreateBlob
          ? onCreateBlob(data as T, format)
          : new Blob([data as string], { type: format })
      )
    );

    return () => URL.revokeObjectURL(blobUrl);
  }, [format, data, onCreateBlob]);

  const downloadFile = useCallback(
    () => forceDownload(fileName, blobUrl),
    [fileName, blobUrl]
  );

  const linkProps = {
    download: fileName,
    href: blobUrl,
  };

  return {
    downloadFile,
    linkProps,
  };
}
