# Resume Tracker — shadcn tracker migration

**Status:** Planned  
**Depends on:** current tracker UI (`specs/resume-tracker-improvements.spec.md` behaviors as implemented)  
**Does not gate:** `specs/resume-tracker-capture.spec.md`

## Why

The tracker is styled with hand-written element rules in `extension/src/tracker/styles.css` (`button`, `input`, `textarea`, `table`). New screens would keep inventing those controls. shadcn gives the tracker page shared, accessible primitives while the extension stays a local Vite + React app.

## What

Add Tailwind and shadcn (Radix primitives) to the extension, theme them to the current light palette, and move tracker chrome onto those primitives: buttons, the rejection dialog, text controls, chips, and the table/drawer layout. Done when the tracker still behaves as it does today and the obsolete element-level rules are gone. The popup and any future content-script UI stay on their own CSS.

## Context

**Relevant files:**

- `extension/package.json` — React 18, Vite, CRXJS; no Tailwind or UI kit yet
- `extension/vite.config.ts` — CRXJS + React; no `@/` alias yet
- `extension/tsconfig.json` — no path alias yet
- `extension/src/tracker/main.tsx` — tracker entry; imports `styles.css`
- `extension/src/tracker/styles.css` — element resets and layout (buttons, inputs, table, drawer, modal, chips)
- `extension/src/tracker/App.tsx` — page shell, drawer column, error alert
- `extension/src/tracker/components/AddApplicationRow.tsx` — primary “Add row” button (keeps `PlusIcon`)
- `extension/src/tracker/components/ApplicationsTable.tsx` — sort headers, icon actions, row color classes
- `extension/src/tracker/components/RejectionDialog.tsx` — hand-rolled modal
- `extension/src/tracker/components/RejectionDialog.test.tsx` — queries `button` / `textarea` inside the render container
- `extension/src/tracker/components/InlineTextCell.tsx` — blur/keyboard save; control only may change
- `extension/src/tracker/components/ChipList.tsx` — chip row plus add input
- `extension/src/tracker/components/DetailDrawer.tsx` — left column, not an overlay
- `extension/src/tracker/components/JobTitleCombobox.tsx` — custom keyboard combobox; do not replace
- `extension/src/tracker/components/TimelineList.tsx` — tests query `.timeline-item` and `.timeline-rejection_reason`
- `extension/src/tracker/components/ApplicationsTable.test.tsx` — queries `tr.row-applied`, `tr.row-in-progress`, `tr.row-rejected`
- `extension/src/popup/main.tsx` — separate entry; imports `popup/styles.css` only
- `extension/src/test/setup.ts` — Vitest setup (`fake-indexeddb`, React act flag)
- `extension/src/components/ui/` — shadcn primitives (new)
- `extension/src/lib/utils.ts` — `cn()` helper (new)

**Architecture:**

| Layer | Location | Responsibility | Depends on |
|---|---|---|---|
| Domain | `extension/src/domain/` | Types, status, timeline | — |
| Infrastructure | `extension/src/storage/` | IndexedDB | Domain |
| Repository | `extension/src/storage/repositories/` | Persistence | Infrastructure, Domain |
| Service | `extension/src/application/services/` | Tracker rules | Repository, Domain |
| Hooks | `extension/src/tracker/hooks/` | React state | Service |
| UI primitives | `extension/src/components/ui/`, `extension/src/lib/utils.ts` | shadcn components and `cn()` | — |
| UI | `extension/src/tracker/`, `extension/src/popup/` | Tracker screens; popup shell | Hooks, Service, UI primitives |

**Dependency rules:**

- UI primitives must not import tracker, popup, hooks, service, or domain
- Tracker UI may import UI primitives; popup does not in this spec
- UI must not call Repository
- Domain must not import React
- No new HTTP or extension-message API

**Patterns to follow:**

- Layering from `specs/resume-tracker-phase-1.spec.md`
- English UI copy; do not change labels
- Tracker behavior from `specs/resume-tracker-improvements.spec.md` (sort, drawer, stages, timeline, rejection, row colors, job-title combobox)
- Tests use Vitest + `react-dom/client` `createRoot` (see `RejectionDialog.test.tsx`). Do not add Testing Library
- Install from the extension package (`extension/`), the only `package.json`

**Key decisions already made:**

- Tracker page only. `extension/src/popup/styles.css` stays as it is
- Future content-script overlays (capture spec) stay on plain CSS. Do not put Tailwind preflight on job sites
- Use `npx shadcn@latest init` for Vite, with Radix primitives. That CLI’s current Tailwind + Vite plugin is the toolchain; do not pin Tailwind v3
- Use the CLI’s default visual style. Recolor CSS variables to the current light palette (page `#f4f6f9`, text `#1a1f2b`, muted `#5b6475`, primary `#1f4ed8`, danger `#9b1c1c`). No dark mode
- Keep the detail drawer as a left flex column (`layout` / `layout-with-drawer`). Do not switch it to shadcn `Sheet`
- Do not replace `JobTitleCombobox` with the shadcn Combobox. Keyboard, highlight, and “remember title” stay
- `InlineTextCell` and `ChipList` keep their save/add behavior. shadcn `Input`, `Textarea`, `Label`, and `Badge` are the visuals
- Keep `icons.tsx` for add, details, and delete. A shadcn `Dialog` may pull `lucide-react` for its own close icon; do not rewrite `icons.tsx` onto Lucide
- Add the `@/` alias in `extension/tsconfig.json` and `extension/vite.config.ts`. Existing relative imports may stay
- Import the generated CSS from `extension/src/tracker/main.tsx` only
- Global `button` / `input` / `textarea` rules in `styles.css` fight Tailwind. Each task deletes only the rules its components replace. Until then, `styles.css` loads after the Tailwind entry so the current page does not regress
- Popup screens that capture will add later stay on plain CSS unless a later spec says otherwise

## Constraints

**Must:**

- Preserve tracker behavior: add row, inline edit (Tab/Enter/blur), sort, drawer, stages, timeline, notes, rejection (optional reason), row colors, job-title combobox
- Keep test hooks: `tr.row-applied`, `tr.row-in-progress`, `tr.row-rejected`, `.timeline-item`, `.timeline-rejection_reason`, and existing `aria-label`s
- Keep the add-row button’s SVG (`AddApplicationRow.test.tsx` expects an `svg` inside the button)
- Coordinate Escape: while the rejection dialog is open, the drawer must stay open
- Theme primary to `#1f4ed8` before any visible component swap
- `npm test` and `npm run build` in `extension/` pass after every task

**Must not:**

- Change Domain, Service, Repository, or IndexedDB
- Migrate the popup
- Add content scripts or inject Tailwind into other sites
- Replace the drawer with `Sheet` or the combobox with shadcn Combobox
- Add dark mode, a second theme, or a visual redesign beyond the current palette
- Leave element-level resets (`button`, `input`, `select`, `textarea`) applied to elements that use shadcn classes
- Load Tailwind CSS from a CDN or loosen the extension CSP

**Out of scope:**

- Popup restyle, including future capture popup screens
- Capture file-input overlay and confirm toast
- Job-title suggestion behavior
- Timeline data model and status rules
- New tracker features

## Tasks

### T1: Tailwind and shadcn scaffold

**Layers:** UI primitives (+), UI (~)

**Do:** In `extension/`, run the current shadcn Vite init (Radix). Add `@/` in `tsconfig.json` and `vite.config.ts`. Put primitives config at `components.json`, `src/lib/utils.ts`, and the generated CSS. Set CSS variables to the current light palette, primary `#1f4ed8`. Import that CSS from `src/tracker/main.tsx` before `styles.css` so existing element rules still win. Do not mount shadcn components yet. Do not import the CSS from the popup.

**Files:** `extension/package.json`, `extension/components.json`, `extension/vite.config.ts`, `extension/tsconfig.json`, `extension/src/lib/utils.ts`, `extension/src/tracker/main.tsx`, generated CSS entry

**Verify:** `cd extension && npm test && npm run build`. Manual: tracker still matches the current layout (table, drawer, buttons, inputs). Popup unchanged.

### T2: Buttons

**Layers:** UI primitives (+), UI (~)

**Do:** Add shadcn `Button`. Use it for “Add row” (keep `PlusIcon` and the “Add row” label), the details and delete icon buttons, and any other primary/danger buttons that are not sort headers or chip-remove. Before deleting the global `button` rule, give sort headers and chip-remove their own classes so they do not go unstyled. Map primary to `#1f4ed8` and danger to the current red.

**Files:** `extension/src/components/ui/button.tsx`, `extension/src/tracker/components/AddApplicationRow.tsx`, `extension/src/tracker/components/ApplicationsTable.tsx`, `extension/src/tracker/components/ChipList.tsx`, `extension/src/tracker/styles.css`, `extension/src/tracker/components/AddApplicationRow.test.tsx`

**Verify:** `cd extension && npm test`. Manual: add row, open details, delete, sort a column, remove a stage chip.

### T3: Rejection dialog

**Layers:** UI primitives (+), UI (~)

**Do:** Add shadcn `Dialog`, `Textarea`, and `Label`. Rebuild `RejectionDialog` with them: title “Rejection reason”, optional copy, Cancel, Confirm. Focus starts in the textarea. Escape and Cancel call `onCancel` and do not confirm. Confirm passes the typed string. The drawer Escape listener stays disabled while the dialog is open. Update `RejectionDialog.test.tsx` to query portaled nodes on `document.body` (the dialog is no longer inside the render container). If Radix throws under jsdom (`hasPointerCapture` or similar), polyfill in `extension/src/test/setup.ts`.

**Files:** `extension/src/components/ui/dialog.tsx`, `extension/src/components/ui/textarea.tsx`, `extension/src/components/ui/label.tsx`, `extension/src/tracker/components/RejectionDialog.tsx`, `extension/src/tracker/components/RejectionDialog.test.tsx`, `extension/src/test/setup.ts`, `extension/src/tracker/styles.css`

**Verify:** `cd extension && npm test`. Manual: choose Rejected, cancel (drawer still open, status unchanged); confirm with a reason and with an empty reason; Escape closes the dialog only.

### T4: Inline fields and chips

**Layers:** UI primitives (+), UI (~)

**Do:** Add shadcn `Input` and `Badge` if T3 did not already add `Textarea` / `Label`. Use `Input` / `Textarea` inside `InlineTextCell`, drawer fields, and the chip add box without changing commit behavior (blur, Enter, Tab). Use `Badge` for chip visuals; the remove control stays the custom chip-remove button. Delete the `input` / `textarea` / `.inline-cell` rules that those components no longer need. Leave `JobTitleCombobox` behavior and its tests unchanged; only restyle it if a deleted rule would otherwise leave it unstyled.

**Files:** `extension/src/components/ui/input.tsx`, `extension/src/components/ui/badge.tsx`, `extension/src/tracker/components/InlineTextCell.tsx`, `extension/src/tracker/components/ChipList.tsx`, `extension/src/tracker/components/DetailDrawer.tsx`, `extension/src/tracker/components/JobTitleCombobox.tsx`, `extension/src/tracker/styles.css`

**Verify:** `cd extension && npm test`. Manual: edit a text cell (Enter keeps focus, Tab moves on, blur saves), add and remove a stage, edit drawer stack/contact/note, job-title combobox still suggests and remembers.

### T5: Table, drawer, and leftover CSS

**Layers:** UI (~)

**Do:** Restyle the page shell, table wrap, empty state, error alert, and drawer column with Tailwind. Keep the drawer a left column. Keep row color classes and timeline classes the tests query. Delete `styles.css` rules that no component still uses. If the file is empty, remove the import. Popup CSS stays.

**Files:** `extension/src/tracker/App.tsx`, `extension/src/tracker/components/ApplicationsTable.tsx`, `extension/src/tracker/components/DetailDrawer.tsx`, `extension/src/tracker/components/TimelineList.tsx`, `extension/src/tracker/styles.css`, `extension/src/tracker/main.tsx`

**Verify:** `cd extension && npm test && npm run build`. Manual: empty state, error still readable, row tints (rejected / applied / in progress), selected row, drawer layout beside the table, timeline readable. Popup still opens the tracker.

## Done

- [ ] Tracker uses shadcn `Button`, `Dialog`, `Input`, `Textarea`, `Label`, and `Badge` where T2–T4 say so
- [ ] `styles.css` no longer restyles `button`, `input`, `select`, or `textarea` globally
- [ ] Drawer is still a left column; job-title combobox behavior unchanged
- [ ] Popup and its stylesheet unchanged
- [ ] Manual: add, edit, sort, drawer, stages, note, reject (with and without reason), delete
- [ ] `cd extension && npm test && npm run build` pass
