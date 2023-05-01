import { renderHook } from "@testing-library/react";
import { useDownloadFile } from "..";

const blobUrl = "blob:http://example.com/550e8400-e29b-41d4-a716-446655440000";
global.URL.createObjectURL = jest.fn(() => blobUrl);
global.URL.revokeObjectURL = jest.fn(() => undefined);

function str2ab(str: string) {
  let buf = new ArrayBuffer(str.length * 2);
  let bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

it("[useDownloadFile] linkProps", () => {
  const { result } = renderHook(() =>
    useDownloadFile({
      fileName: "file.svg",
      format: "image/svg+xml",
      data: "",
    })
  );
  expect(result.current.linkProps).toEqual({
    download: "file.svg",
    href: blobUrl,
  });
});

it("[useDownloadFile] downloadFile", () => {
  const createElement = jest.spyOn(document, "createElement");
  const removeFn = jest.spyOn(Element.prototype, "remove");
  const { result } = renderHook(() =>
    useDownloadFile({
      fileName: "file.svg",
      format: "image/svg+xml",
      data: "",
    })
  );
  result.current.downloadFile();

  expect(createElement).toBeCalledWith("a");
  expect(removeFn).toBeCalledTimes(1);
  expect(document.querySelector("a")).toBeFalsy();
});

it("[useDownloadFile] onCreateBlob", () => {
  const buffer = str2ab("Content for ArrayBuffer");
  const onCreateBlob = jest.fn((_, format) => {
    return new Blob([buffer], { type: format });
  });

  const { result } = renderHook(() =>
    useDownloadFile({
      fileName: "file.svg",
      format: "image/svg+xml",
      data: null,
      onCreateBlob,
    })
  );
  result.current.downloadFile();

  expect(onCreateBlob).toBeCalled();
});
