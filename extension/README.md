# Resume Tracker (Chrome extension)

Local-only job application tracker. Phase 1 is a React tracker page with manual add, edit, and delete. Data lives in IndexedDB on the extension origin.

## Prerequisites

- Node.js 20+
- Google Chrome

## Build

```bash
cd extension
npm install
npm run build
```

Output is in `extension/dist/`.

## Load unpacked in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `extension/dist` folder.

## Open the tracker page

Click the Resume Tracker icon in the Chrome toolbar, then **Open tracker**.

Alternatively, copy the extension ID from `chrome://extensions` and open:

```text
chrome-extension://<extension-id>/src/tracker/index.html
```

## Development

```bash
cd extension
npm run dev
```

Load unpacked from `extension/dist` (or the CRXJS dev output) and reload the extension after changes.

```bash
npm test
```
