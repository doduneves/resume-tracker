# Resume Tracker (Chrome extension)

Local-only job application tracker. The React tracker stores applications in IndexedDB on the extension origin, with a sortable table, per-row stages, a status timeline, and a left detail drawer.

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

## Tracker

- **Table columns:** Company, Job Title, Status, Stages, Job URL, Resume, Next step, Last Updated, Salary, Actions.
- **Sorting:** every column is sortable; default is Last Updated, newest first.
- **Job title:** combobox with saved suggestions. Type a new title to add it.
- **Stages:** per-row chips. Type and press Enter to add a stage for that job only. Status options are Applied, Offer, Rejected, plus that row’s stages.
- **Next step** and **Last Updated** are dates.
- **Drawer:** open from the row icon. Stack (creatable tags), Contact, Rating, Match Level, chronological timeline, and Add note live here.
- **Rejected:** choosing Rejected asks for an optional reason. Confirm with an empty reason still records Rejected.
- **Actions:** open-details and delete are icons. Delete asks for confirmation. **Add row** is a plus icon plus the label.

Existing schema v1 data is migrated to v2 on first load (stages/stack arrays and a timeline that starts with Applied).

## Development

```bash
cd extension
npm run dev
```

Load unpacked from `extension/dist` (or the CRXJS dev output) and reload the extension after changes.

```bash
npm test
```
