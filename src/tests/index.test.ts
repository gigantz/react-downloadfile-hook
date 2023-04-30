import { renderHook } from "@testing-library/react";
import { useDownloadFile } from "..";

const blobUrl = "blob:http://example.com/550e8400-e29b-41d4-a716-446655440000";
global.URL.createObjectURL = jest.fn(() => blobUrl);

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
  const creatElement = jest.spyOn(document, "createElement");
  const removeFn = jest.spyOn(Element.prototype, "remove");
  const { result } = renderHook(() =>
    useDownloadFile({
      fileName: "file.svg",
      format: "image/svg+xml",
      data: "",
    })
  );
  result.current.downloadFile();

  expect(creatElement).toBeCalledWith("a");
  expect(removeFn).toBeCalledTimes(1);
  expect(document.querySelector("a")).toBeFalsy();
});
