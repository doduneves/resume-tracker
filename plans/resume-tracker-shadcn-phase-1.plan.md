---
name: "Resume Tracker shadcn — Phase 1: Buttons and dialog"
overview: "Install themed shadcn and move tracker buttons plus the rejection dialog onto it."
todos:
  - id: "7c2a9e14-6b31-4f08-9d5a-1e8c4b7a0f62"
    content: "T1: Tailwind and shadcn scaffold"
    status: completed
  - id: "a4e8c1d0-2f57-4b93-8e16-5d9a3c7b1e40"
    content: "T2: Buttons"
    status: completed
  - id: "b8f3d6a2-91c4-4e70-a25b-6c1d8e9f3a17"
    content: "T3: Rejection dialog"
    status: completed
isProject: false
---

# Resume Tracker shadcn — Phase 1

**Spec:** [`specs/resume-tracker-shadcn.spec.md`](../specs/resume-tracker-shadcn.spec.md)  
Full context: [`plans/resume-tracker-shadcn.plan.md`](resume-tracker-shadcn.plan.md)

**Branch:** `feat/rts-1-buttons-dialog` (base: `main`)  
**Spec tasks:** T1–T3  
**Shippable:** Yes — buttons and the rejection dialog use shadcn. Other controls stay on `styles.css`.

**Phase boundary:** UI primitives and tracker chrome for buttons and the dialog only. Includes Tailwind init, `@/` alias, light palette (primary `#1f4ed8`), and CSS imported from the tracker entry before `styles.css`. Do not restyle inline fields, the drawer layout, or the popup. Do not replace the combobox or switch the drawer to `Sheet`.

**Migration (this phase):** Not required

## Execution order

#### Session: T1 — Tailwind and shadcn scaffold

**Todo id:** `7c2a9e14-6b31-4f08-9d5a-1e8c4b7a0f62`  
**Depends on:** —  
**Focus:** shadcn Vite init (Radix) in `extension/`; `@/` alias; palette variables; tracker CSS import before `styles.css`. No components mounted. Popup does not import Tailwind.

**Verify:** `cd extension && npm test && npm run build`. Manual: tracker layout unchanged. Popup unchanged.

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `feat/rts-1-buttons-dialog`

#### Session: T2 — Buttons

**Todo id:** `a4e8c1d0-2f57-4b93-8e16-5d9a3c7b1e40`  
**Depends on:** T1  
**Focus:** shadcn `Button` for Add row (keep `PlusIcon`), details, and delete. Sort headers and chip-remove get their own classes before the global `button` rule goes. Primary `#1f4ed8`.

**Verify:** `cd extension && npm test`. Manual: add row, open details, delete, sort, remove a stage chip.

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `feat/rts-1-buttons-dialog`

#### Session: T3 — Rejection dialog

**Todo id:** `b8f3d6a2-91c4-4e70-a25b-6c1d8e9f3a17`  
**Depends on:** T2  
**Focus:** `Dialog`, `Textarea`, `Label`. Cancel and Escape do not confirm. Drawer stays open while the dialog is open. Test queries `document.body`. Polyfill jsdom only if Radix throws.

**Verify:** `cd extension && npm test`. Manual: cancel (status unchanged, drawer open); confirm with and without a reason; Escape closes the dialog only.

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `feat/rts-1-buttons-dialog`

## Automated tests

```bash
cd extension && npm test && npm run build
```

- [ ] `AddApplicationRow.test.tsx` still finds an `svg` in the add button
- [ ] `RejectionDialog.test.tsx` uses `document.body` for the portal and covers cancel plus confirm

## Manual tests

Load the extension as in `extension/README.md`.

1. Tracker layout matches `main` aside from buttons and the rejection dialog. Popup unchanged.
2. Add row (icon + “Add row”), sort, open details, delete, remove a stage chip.
3. Rejected → Cancel leaves status and drawer as they were. Confirm with a reason and with an empty reason. Escape closes the dialog only.

**Regression scope:** Inline edit, combobox, timeline, and row colors still match `main`.

## Phase milestone

- [ ] T1–T3 complete
- [ ] YAML todos in this file and the master plan are `completed`
- [ ] Automated tests pass
- [ ] Manual tests pass
- [ ] PR from `feat/rts-1-buttons-dialog` → `main` reviewed and merged
