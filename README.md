<div align="center">
    <br/>
    <br/>
    <h1>⚛️ React "download hook"<br /><br /></h1>
    <br />
    <pre>npm i react-download-hook</pre>
    <br />
    <br />
</div>

## Description

Simple React hook to handle data downloading as a file without any dependencies and with typescript support.

## Examples

### Download properly through a link

This is a recommended method to handle downloading. You need to provide required `fileName`, `format/mime-type`, `data` properties into the hook.

```jsx
import { useDownloadFile } from "react-download-hook";

const { linkProps } = useDownloadFile({
  fileName,
  format: "image/svg+xml",
  data: `<svg><circle cx="50" cy="50" r="40"fill="red" /></svg>`,
});

<a {...linkProps}>Download SVG File</a>;
```

### Download on click

The simplest way to handle downloading. It also named as a "force download a file". It uses old-school method, adding a link into the DOM and click it.

```jsx
import { useDownloadFile } from "react-download-hook";

const { downloadFile } = useDownloadFile({
  fileName,
  format: "image/svg+xml",
  data: `<svg><circle cx="50" cy="50" r="40"fill="red" /></svg>`,
});

<Button onClick={downloadFile}>Download SVG File</Button>;
```

### Advanced handling

If your data is not a `string` type (`ArrayBuffer`, `Uint8Array`, etc), you may need to replace the built-in handler.
You need provide `onCreateBlob` callback that returns `Blob`.

```jsx
import { useDownloadFile } from "react-download-hook";

const { downloadFile, linkProps } = useDownloadFile({
  fileName,
  format: "image/svg+xml",
  data: new Uint8Array([1, 2, 3]),
  onCreateBlob: (data: uint8Array, format) => {
    const arrayBuffer = uint8Array.buffer;
    return new Blob([arrayBuffer], { type: format });
  },
});

<a {...linkProps}>Download File</a>;
<Button onClick={downloadFile}>Download File</Button>;
```

### Cheers!
