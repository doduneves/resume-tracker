---
name: "Resume Tracker shadcn — Phase 2: Fields and layout"
overview: "Move inline fields and chips onto shadcn and delete leftover tracker CSS."
todos:
  - id: "c1d94e73-5a28-4f6b-b837-2e0a6d4c8b59"
    content: "T4: Inline fields and chips"
    status: pending
  - id: "d5e07b84-3c19-4a82-9f64-7b2e1a8d0c36"
    content: "T5: Table, drawer, and leftover CSS"
    status: pending
isProject: false
---

# Resume Tracker shadcn — Phase 2

**Spec:** [`specs/resume-tracker-shadcn.spec.md`](../specs/resume-tracker-shadcn.spec.md)  
Full context: [`plans/resume-tracker-shadcn.plan.md`](resume-tracker-shadcn.plan.md)

**Branch:** `feat/rts-2-fields-layout` (base: `main` after phase 1 merge)  
**Spec tasks:** T4–T5  
**Shippable:** Yes — this finishes the migration.

**Phase boundary:** `Input` and `Badge`, then Tailwind for the table shell, empty state, error, and drawer column. Keep phase 1 buttons, the chip-remove control, the Tailwind import, row color classes, and timeline classes. Drawer stays a left column. Combobox behavior stays. Popup CSS stays.

**Migration (this phase):** Not required

## Execution order

#### Session: T4 — Inline fields and chips

**Todo id:** `c1d94e73-5a28-4f6b-b837-2e0a6d4c8b59`  
**Depends on:** Phase 1 merged (T3)  
**Focus:** `Input` and `Badge` inside inline cells, drawer fields, and the chip add box. Blur, Enter, and Tab behavior unchanged. Delete obsolete `input` / `textarea` / `.inline-cell` rules. Combobox tests stay.

**Verify:** `cd extension && npm test`. Manual: cell keyboard and blur; add and remove a stage; drawer stack, contact, note; combobox suggests and remembers.

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `feat/rts-2-fields-layout`

#### Session: T5 — Table, drawer, and leftover CSS

**Todo id:** `d5e07b84-3c19-4a82-9f64-7b2e1a8d0c36`  
**Depends on:** T4  
**Focus:** Tailwind for page shell, table wrap, empty state, error, and drawer column. Keep `tr.row-*` and `.timeline-*` hooks. Delete unused `styles.css`. Drop the import if the file is empty.

**Verify:** `cd extension && npm test && npm run build`. Manual: empty state, error, row tints, selected row, drawer beside the table, timeline. Popup still opens the tracker.

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `feat/rts-2-fields-layout`

## Automated tests

```bash
cd extension && npm test && npm run build
```

- [ ] `InlineTextCell.test.tsx`, `StagesCell.test.tsx`, and `JobTitleCombobox.test.tsx` pass
- [ ] `ApplicationsTable.test.tsx` still finds `tr.row-applied`, `tr.row-in-progress`, and `tr.row-rejected`
- [ ] `TimelineList.test.tsx` still finds `.timeline-item` and `.timeline-rejection_reason`

## Manual tests

Load the extension as in `extension/README.md`.

1. Text cell: Enter keeps focus, Tab moves on, blur saves.
2. Add and remove a stage. Drawer stack, contact, and note still save. Escape closes the drawer when the dialog is closed.
3. Combobox picks a suggestion and remembers a new title across reload.
4. Row tints and the selected-row inset still show. Empty state and timeline are readable.
5. Re-run Phase 1 manual tests (add, sort, details, delete, reject with and without a reason).
6. Popup unchanged and still opens the tracker.

**Regression scope:** Phase 1 buttons and rejection dialog.

## Phase milestone

- [ ] T4–T5 complete
- [ ] YAML todos in this file and the master plan are `completed`
- [ ] Automated tests pass
- [ ] Manual tests pass
- [ ] Phase 1 regression checks pass
- [ ] PR from `feat/rts-2-fields-layout` → `main` reviewed and merged
