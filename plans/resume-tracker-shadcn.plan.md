---
name: "Resume Tracker shadcn"
overview: "Install shadcn on the tracker and ship themed buttons plus the rejection dialog as the first milestone."
todos:
  - id: "7c2a9e14-6b31-4f08-9d5a-1e8c4b7a0f62"
    content: "[Phase 1] T1: Tailwind and shadcn scaffold"
    status: completed
  - id: "a4e8c1d0-2f57-4b93-8e16-5d9a3c7b1e40"
    content: "[Phase 1] T2: Buttons"
    status: completed
  - id: "b8f3d6a2-91c4-4e70-a25b-6c1d8e9f3a17"
    content: "[Phase 1] T3: Rejection dialog"
    status: completed
  - id: "c1d94e73-5a28-4f6b-b837-2e0a6d4c8b59"
    content: "[Phase 2] T4: Inline fields and chips"
    status: pending
  - id: "d5e07b84-3c19-4a82-9f64-7b2e1a8d0c36"
    content: "[Phase 2] T5: Table, drawer, and leftover CSS"
    status: pending
isProject: true
---

# Resume Tracker shadcn — Plan

> **Cursor Plan Mode:** This file uses YAML frontmatter for interactive todos (checkboxes). Open in Plan Mode → review todos → **Build**, or select todos → **Send to New Agent**. There are no phase radio buttons; use the per-phase plan files below to Build one phase at a time.

## Source

- Spec: `specs/resume-tracker-shadcn.spec.md`
- Master plan: `plans/resume-tracker-shadcn.plan.md` (this file)
- Phase plans: `plans/resume-tracker-shadcn-phase-1.plan.md`, `plans/resume-tracker-shadcn-phase-2.plan.md`
- Tracker behavior to preserve: `specs/resume-tracker-improvements.spec.md` (as implemented)
- Capture stays off this UI kit: `specs/resume-tracker-capture.spec.md`

## Goal

Move tracker chrome onto Tailwind and shadcn while keeping current behavior and the light palette. The first shippable milestone is themed buttons and a shadcn rejection dialog, with the rest of the page still on `styles.css`.

## Cursor Plan Mode files

| File | Use when |
|---|---|
| `plans/resume-tracker-shadcn.plan.md` | Full overview; all phases; track overall progress |
| `plans/resume-tracker-shadcn-phase-1.plan.md` | Build or review **Phase 1 only** on its branch |
| `plans/resume-tracker-shadcn-phase-2.plan.md` | Build or review **Phase 2 only** on its branch |

Per-phase files have their own YAML `todos` (that phase's tasks only). Todos are **checkboxes**, not radio buttons — to work on a single phase, open that phase's `.plan.md` in Plan Mode.

## Branch strategy

Every phase on the plan will be a unique branch.

Branch name will follow the name standards: `{category-prefix}/{plan-abreviation}-{phase-number}-{short-desc-of-phase}`

The category-prefix are feat/, fix/, hotfix/, release/ and chore/

**Plan abbreviation:** `rts` (from kebab-name `resume-tracker-shadcn`)

| Phase | Branch | Base branch | Spec tasks | Plan file |
|---|---|---|---|---|
| 1 — Buttons and dialog | `feat/rts-1-buttons-dialog` | `main` | T1–T3 | `plans/resume-tracker-shadcn-phase-1.plan.md` |
| 2 — Fields and layout | `feat/rts-2-fields-layout` | `main` (after phase 1 merge) | T4–T5 | `plans/resume-tracker-shadcn-phase-2.plan.md` |

**Phase independence rules:**

- Each phase owns a bounded set of layers and files (see **Phase boundary** per phase).
- Later phases depend only on **stable contracts** from earlier phases (public types, service methods, message shapes)—not internal implementation details.
- A fix in phase N should change only files owned by phase N (or shared contracts defined up to phase N). It must not require edits to files introduced in phase N+1 or later.
- If testing phase 2 reveals a bug in phase 1: fix on `feat/rts-1-buttons-dialog` (or a patch branch off it), merge to `main`, then rebase `feat/rts-2-fields-layout` onto updated `main`. Later-phase-only code stays untouched.

## Prerequisites

- [x] Spec exists at `specs/resume-tracker-shadcn.spec.md`
- [ ] Node.js available for Vite and TypeScript in `extension/`
- [ ] Chrome available to load the unpacked extension (`extension/README.md`)
- [ ] Current tracker UI is on `main` (inline edit, drawer, stages, timeline, combobox)

## Feature flags

**Use feature flag:** No

- Feature ships without an environment flag; all phases are testable with default config.

## Data migration

**Migration required:** No

- UI and toolchain only. No IndexedDB version bump, no stored JSON change, no one-off scripts.

## Phase 1 — Buttons and dialog

**Outcome:** Tailwind and shadcn are installed and themed to the current light palette. Add row, row icon actions, and the rejection dialog use shadcn. Sort headers and chip-remove stay custom and still look right. Inline cells, the drawer column, and the popup are unchanged in behavior.

**Branch:** `feat/rts-1-buttons-dialog`  
**Spec tasks:** T1, T2, T3  
**Plan file:** `plans/resume-tracker-shadcn-phase-1.plan.md`  
**Shippable:** Yes — the tracker is usable with the new buttons and dialog. Remaining controls still use `styles.css`, loaded after the Tailwind entry.

**Phase boundary:**

- **Layers touched:** UI primitives (+), UI (~)
- **Files owned by this phase:** `extension/package.json`, `extension/package-lock.json`, `extension/components.json`, `extension/vite.config.ts`, `extension/tsconfig.json`, `extension/src/lib/utils.ts`, the generated CSS entry, `extension/src/components/ui/button.tsx`, `dialog.tsx`, `textarea.tsx`, `label.tsx`, `extension/src/tracker/main.tsx` (CSS import order only), `extension/src/tracker/styles.css` (button and modal rules only), `AddApplicationRow.tsx`, `ApplicationsTable.tsx` (button markup only), `ChipList.tsx` (chip-remove class only), `RejectionDialog.tsx`, `RejectionDialog.test.tsx`, `AddApplicationRow.test.tsx`, `extension/src/test/setup.ts` (jsdom polyfill only if Radix needs it)
- **Contract for later phases:** `@/` alias; `cn()` at `@/lib/utils`; CSS variables for the light palette with primary `#1f4ed8`; Tailwind CSS imported from `extension/src/tracker/main.tsx` before `styles.css`; primitives `Button`, `Dialog`, `Textarea`, `Label` under `extension/src/components/ui/`. Popup does not import Tailwind. Drawer stays a left column. `JobTitleCombobox` is not replaced.

**Migration (this phase):** Not required

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `7c2a9e14-6b31-4f08-9d5a-1e8c4b7a0f62` | T1 | completed |
| `a4e8c1d0-2f57-4b93-8e16-5d9a3c7b1e40` | T2 | completed |
| `b8f3d6a2-91c4-4e70-a25b-6c1d8e9f3a17` | T3 | completed |

Update `status` in YAML frontmatter (`pending` | `in-progress` | `completed` | `error`) as work progresses. Cursor Plan Mode reads frontmatter, not markdown checkboxes below.

### Execution order

#### Session: T1 — Tailwind and shadcn scaffold

**Todo id:** `7c2a9e14-6b31-4f08-9d5a-1e8c4b7a0f62`  
**Spec ref:** T1  
**Layers:** UI primitives (+), UI (~)  
**Depends on:** —  
**Focus:**

- Run `npx shadcn@latest init` in `extension/` with Radix primitives
- Add `@/` in `tsconfig.json` and `vite.config.ts`
- Set CSS variables to the current light palette, primary `#1f4ed8`
- Import the generated CSS from the tracker entry before `styles.css`. Do not import it from the popup. Do not mount shadcn components yet

**Verify (from spec):** `cd extension && npm test && npm run build`. Manual: tracker layout unchanged. Popup unchanged.

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed` in this file and `plans/resume-tracker-shadcn-phase-1.plan.md`; [ ] safe to commit on `feat/rts-1-buttons-dialog`

#### Session: T2 — Buttons

**Todo id:** `a4e8c1d0-2f57-4b93-8e16-5d9a3c7b1e40`  
**Spec ref:** T2  
**Layers:** UI primitives (+), UI (~)  
**Depends on:** T1  
**Focus:**

- Add shadcn `Button` for Add row (keep `PlusIcon` and the label), details, and delete
- Give sort headers and chip-remove their own classes before removing the global `button` rule
- Primary `#1f4ed8`, danger the current red

**Verify (from spec):** `cd extension && npm test`. Manual: add row, open details, delete, sort a column, remove a stage chip.

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed` in this file and `plans/resume-tracker-shadcn-phase-1.plan.md`; [ ] safe to commit on `feat/rts-1-buttons-dialog`

#### Session: T3 — Rejection dialog

**Todo id:** `b8f3d6a2-91c4-4e70-a25b-6c1d8e9f3a17`  
**Spec ref:** T3  
**Layers:** UI primitives (+), UI (~)  
**Depends on:** T2  
**Focus:**

- Rebuild `RejectionDialog` with `Dialog`, `Textarea`, and `Label`
- Focus starts in the textarea. Cancel and Escape do not confirm. Confirm passes the typed string
- Drawer stays open while the dialog is open
- Point `RejectionDialog.test.tsx` at `document.body` for the portal. Polyfill jsdom in `extension/src/test/setup.ts` only if Radix throws

**Verify (from spec):** `cd extension && npm test`. Manual: cancel leaves status unchanged and the drawer open; confirm with a reason and with an empty reason; Escape closes the dialog only.

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed` in this file and `plans/resume-tracker-shadcn-phase-1.plan.md`; [ ] safe to commit on `feat/rts-1-buttons-dialog`

### Automated tests

Commands to run before opening a PR for this phase:

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] Existing tracker tests stay green (`AddApplicationRow.test.tsx` still finds an `svg` inside the add button)
- [ ] `RejectionDialog.test.tsx` finds portaled Cancel and Confirm on `document.body` and still covers cancel plus confirm-with-reason

### Manual tests

Step-by-step checks on the phase branch before merge. Load the extension as in `extension/README.md` (`npm run dev` or load `extension/dist` unpacked).

1. Open the tracker from the popup. Layout, table, drawer, and inputs still match the pre-migration page aside from buttons and the rejection dialog.
2. Add a row. The control still shows the plus icon and “Add row”.
3. Sort a column. Open details. Delete a row.
4. Remove a stage chip. The chip-remove control is still usable.
5. Set a row to Rejected, then Cancel. Drawer stays open and status is unchanged.
6. Reject with a reason, and reject with an empty reason. Escape closes the dialog and leaves the drawer open.
7. Popup stylesheet and popup layout are unchanged.

**Regression scope for this phase:** Inline edit, job-title combobox, timeline, and row colors still behave as they do on `main`.

### Phase milestone

- [ ] All spec tasks for this phase complete (T1–T3)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (if **Migration (this phase)** is Required)
- [ ] Feature flag behavior verified (if **Use feature flag** is Yes and this phase is gated)
- [ ] Automated tests pass (see above)
- [ ] Manual tests pass (see above)
- [ ] PR from `feat/rts-1-buttons-dialog` → `main` reviewed and merged

---

## Phase 2 — Fields and layout

**Outcome:** Inline fields and chips use shadcn visuals without changing save behavior. Table, empty state, error, and the drawer column use Tailwind. Global `button` / `input` / `select` / `textarea` rules are gone. The drawer is still a left column. The popup is unchanged.

**Branch:** `feat/rts-2-fields-layout`  
**Spec tasks:** T4, T5  
**Plan file:** `plans/resume-tracker-shadcn-phase-2.plan.md`  
**Shippable:** Yes — this finishes the spec. Stop here.

**Phase boundary:**

- **Layers touched:** UI primitives (+), UI (~)
- **Files owned by this phase:** `extension/src/components/ui/input.tsx`, `badge.tsx`, `InlineTextCell.tsx`, `ChipList.tsx` (badge visuals; keep the phase 1 chip-remove control), `DetailDrawer.tsx`, `JobTitleCombobox.tsx` (restyle only if a deleted rule would leave it unstyled), `ApplicationsTable.tsx` (table chrome; keep phase 1 buttons and `tr.row-*` classes), `TimelineList.tsx` (keep `.timeline-item` and `.timeline-rejection_reason`), `App.tsx`, `extension/src/tracker/styles.css`, `extension/src/tracker/main.tsx` (drop the `styles.css` import only if the file is empty)
- **Contract for later phases:** None. Capture content scripts and the popup stay off this kit. Do not add `Sheet` or replace the combobox.

**Migration (this phase):** Not required

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `c1d94e73-5a28-4f6b-b837-2e0a6d4c8b59` | T4 | pending |
| `d5e07b84-3c19-4a82-9f64-7b2e1a8d0c36` | T5 | pending |

Update `status` in YAML frontmatter (`pending` | `in-progress` | `completed` | `error`) as work progresses. Cursor Plan Mode reads frontmatter, not markdown checkboxes below.

### Execution order

#### Session: T4 — Inline fields and chips

**Todo id:** `c1d94e73-5a28-4f6b-b837-2e0a6d4c8b59`  
**Spec ref:** T4  
**Layers:** UI primitives (+), UI (~)  
**Depends on:** T3 (phase 1 merged)  
**Focus:**

- Add `Input` and `Badge`. Reuse `Textarea` and `Label` from phase 1
- Use them inside inline cells, drawer fields, and the chip add box. Do not change blur, Enter, or Tab commit behavior
- Badge for chip visuals. Chip-remove stays the custom button from phase 1
- Delete `input` / `textarea` / `.inline-cell` rules those components no longer need
- Leave combobox behavior and its tests alone

**Verify (from spec):** `cd extension && npm test`. Manual: Enter keeps focus, Tab moves on, blur saves; add and remove a stage; edit drawer stack, contact, and note; combobox still suggests and remembers.

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed` in this file and `plans/resume-tracker-shadcn-phase-2.plan.md`; [ ] safe to commit on `feat/rts-2-fields-layout`

#### Session: T5 — Table, drawer, and leftover CSS

**Todo id:** `d5e07b84-3c19-4a82-9f64-7b2e1a8d0c36`  
**Spec ref:** T5  
**Layers:** UI (~)  
**Depends on:** T4  
**Focus:**

- Restyle page shell, table wrap, empty state, error alert, and the drawer column with Tailwind
- Keep the drawer a left column
- Keep `tr.row-applied`, `tr.row-in-progress`, `tr.row-rejected`, `.timeline-item`, and `.timeline-rejection_reason`
- Delete unused `styles.css` rules. Remove the import if the file is empty
- Do not edit popup CSS

**Verify (from spec):** `cd extension && npm test && npm run build`. Manual: empty state, readable error, row tints, selected row, drawer beside the table, readable timeline. Popup still opens the tracker.

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed` in this file and `plans/resume-tracker-shadcn-phase-2.plan.md`; [ ] safe to commit on `feat/rts-2-fields-layout`

### Automated tests

Commands to run before opening a PR for this phase:

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] `InlineTextCell.test.tsx`, `StagesCell.test.tsx`, and `JobTitleCombobox.test.tsx` still pass without behavior changes
- [ ] `ApplicationsTable.test.tsx` still finds `tr.row-applied`, `tr.row-in-progress`, and `tr.row-rejected`
- [ ] `TimelineList.test.tsx` still finds `.timeline-item` and `.timeline-rejection_reason`

### Manual tests

Step-by-step checks on the phase branch before merge. Load the extension as in `extension/README.md`.

1. Edit a text cell: Enter keeps focus and saves, Tab saves and moves to the next table column, blur saves.
2. Add a stage tag and remove one. Chip-remove still works.
3. Open the drawer. Edit stack, contact, and a note. Escape closes the drawer when the rejection dialog is not open.
4. Job title: pick a suggestion and create a new one. Reload the tracker and confirm the new title is still suggested.
5. Confirm row tints: Rejected red, Applied neutral, any other status green. Selected row still shows the blue inset.
6. Empty tracker shows the empty state. Force the error path if practical and confirm the message is readable.
7. Timeline entries, including a rejection reason, are readable.
8. Popup still opens the tracker and its own stylesheet is unchanged.

**Regression scope for this phase:** Phase 1 behavior must still pass (run Phase 1 manual tests).

### Phase milestone

- [ ] All spec tasks for this phase complete (T4–T5)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (if **Migration (this phase)** is Required)
- [ ] Feature flag behavior verified (if **Use feature flag** is Yes and this phase is gated)
- [ ] Automated tests pass
- [ ] Manual tests pass
- [ ] Phase 1 regression checks pass
- [ ] PR from `feat/rts-2-fields-layout` → `main` reviewed and merged

---

## Dependencies

| Task / Phase | Blocked by | Notes |
|---|---|---|
| T2 | T1 | `Button` needs the Tailwind entry, alias, and theme variables |
| T3 | T2 | Dialog actions use `Button`. Global `button` rules must already be gone or scoped |
| Phase 2 | Phase 1 merge | Uses `@/`, theme variables, `Button`, `Textarea`, `Label`, and the chip-remove class from phase 1 |
| T5 | T4 | Layout cleanup deletes input rules only after fields have moved off them |

## Risks and notes

- Importing Tailwind applies preflight. `styles.css` must load after it until T5 deletes the old element rules, or the page restyles early.
- `ApplicationsTable.tsx`, `ChipList.tsx`, `styles.css`, and `tracker/main.tsx` are touched in both phases. Phase 2 edits must keep phase 1 button markup, the chip-remove class, and the Tailwind import.
- Radix `Dialog` portals to `document.body`. The existing dialog test queries the render container and will fail until T3 updates it. jsdom may also lack `hasPointerCapture`.
- Drawer Escape and dialog Escape both listen. T3 must keep the drawer listener off while the dialog is open.
- Do not switch the drawer to `Sheet` or the job-title field to shadcn Combobox.
- Do not import Tailwind from the popup or from future content scripts. Preflight would restyle the popup and job sites.
- CRXJS must keep bundling the generated CSS. No CDN and no CSP exceptions.
- Cursor Plan Mode todo sync: update YAML `todos[].status` in both master and phase plan files when a task completes; keep todo `id` values stable when regenerating this plan. After edits, confirm the frontmatter still parses (known Plan Mode YAML corruption).

## Progress

Track via YAML frontmatter `todos[].status` (source of truth for Plan Mode). Summary:

| Phase | Plan file | Tasks | Done |
|---|---|---|---|
| 1 — Buttons and dialog | `plans/resume-tracker-shadcn-phase-1.plan.md` | T1–T3 | 3 / 3 |
| 2 — Fields and layout | `plans/resume-tracker-shadcn-phase-2.plan.md` | T4–T5 | 0 / 2 |
