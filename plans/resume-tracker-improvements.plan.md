---
name: "Resume Tracker Improvements"
overview: "Migrate IndexedDB to schema v2 with a timeline-aware ApplicationService as the first shippable milestone."
todos:
  - id: "3f8a1c2e-9b4d-4e71-86c0-1d2e3f4a5b6c"
    content: "[Phase 1] T1: Domain types and IndexedDB v2 migration"
    status: pending
  - id: "4a9b2d3f-0c5e-4f82-97d1-2e3f4a5b6c7d"
    content: "[Phase 1] T2: ApplicationService — timeline, status, notes, rejection"
    status: pending
  - id: "5b0c3e40-1d6f-4013-a8e2-3f4a5b6c7d8e"
    content: "[Phase 2] T3: Settings vocabulary (job titles, stack tags)"
    status: pending
  - id: "6c1d4f51-2e70-4124-b9f3-4a5b6c7d8e9f"
    content: "[Phase 2] T4: Table shell — column order, sort, row colors, inline edit, keyboard"
    status: pending
  - id: "7d2e5062-3f81-4235-8a04-5b6c7d8e9f0a"
    content: "[Phase 2] T5: Stages, status, job title combobox, next step date"
    status: pending
  - id: "8e3f6173-4092-4346-9b15-6c7d8e9f0a1b"
    content: "[Phase 3] T6: Detail drawer, timeline UI, rejection dialog"
    status: pending
  - id: "9f407284-51a3-4457-ac26-7d8e9f0a1b2c"
    content: "[Phase 3] T7: Actions icons, add row control, polish and regression tests"
    status: pending
isProject: true
---

# Resume Tracker Improvements — Plan

> **Cursor Plan Mode:** This file uses YAML frontmatter for interactive todos (checkboxes). Open in Plan Mode → review todos → **Build**, or select todos → **Send to New Agent**. There are no phase radio buttons; use the per-phase plan files below to Build one phase at a time.

## Source

- Spec: `specs/resume-tracker-improvements.spec.md`
- Master plan: `plans/resume-tracker-improvements.plan.md` (this file)
- Phase plans: `plans/resume-tracker-improvements-phase-1.plan.md`, `plans/resume-tracker-improvements-phase-2.plan.md`, `plans/resume-tracker-improvements-phase-3.plan.md`
- Depends on: `specs/resume-tracker-phase-1.spec.md` (complete)
- Product plan (index): `plans/resume-tracker.plan.md`
- Capture (after this): `specs/resume-tracker-capture.spec.md`

## Goal

Upgrade the Phase 1 tracker to schema v2 with per-row stages, a status timeline, and calmer inline editing; first shippable milestone is migrated data plus `ApplicationService` methods that later capture can call unchanged.

## Cursor Plan Mode files

| File | Use when |
|---|---|
| `plans/resume-tracker-improvements.plan.md` | Full overview; all phases; track overall progress |
| `plans/resume-tracker-improvements-phase-1.plan.md` | Build or review **Phase 1 only** on its branch |
| `plans/resume-tracker-improvements-phase-2.plan.md` | Build or review **Phase 2 only** on its branch |
| `plans/resume-tracker-improvements-phase-3.plan.md` | Build or review **Phase 3 only** on its branch |

Per-phase files have their own YAML `todos` (that phase's tasks only). Todos are **checkboxes**, not radio buttons — to work on a single phase, open that phase's `.plan.md` in Plan Mode.

## Branch strategy

Each implementation phase maps to its own git branch. Phases **stack**; **merge to `main` is last** (after Phase 3), not after each phase. PRs may be opened for review; they are not merged until the end.

| Phase | Branch | Base branch | Spec tasks | Plan file |
|---|---|---|---|---|
| 1 — Schema v2 and service | `phase/1-schema-v2` | `main` | T1–T2 | `plans/resume-tracker-improvements-phase-1.plan.md` (**pushed, not merged**) |
| 2 — Table UX | `phase/2-table-ux` | `phase/1-schema-v2` | T3–T5 | `plans/resume-tracker-improvements-phase-2.plan.md` |
| 3 — Drawer and polish | `phase/3-drawer-polish` | `phase/2-table-ux` | T6–T7 | `plans/resume-tracker-improvements-phase-3.plan.md` |

Final merge: `phase/3-drawer-polish` → `main` (contains Phase 1–3).

**Phase independence rules:**

- Each phase owns a bounded set of layers and files (see **Phase boundary** per phase).
- Later phases depend only on **stable contracts** from earlier phases (public types, service methods, message shapes)—not internal implementation details.
- A fix in phase N should change only files owned by phase N (or shared contracts defined up to phase N). It must not require edits to files introduced in phase N+1 or later.
- If testing phase 3 reveals a bug in phase 1: fix on `phase/1-schema-v2` (or a patch branch off it), then rebase `phase/2-table-ux` and `phase/3-drawer-polish` onto that fix. Do **not** merge to `main` until Phase 3 is done.

## Prerequisites

- [x] Spec exists at `specs/resume-tracker-improvements.spec.md`
- [x] Phase 1 tracker is complete (`specs/resume-tracker-phase-1.spec.md`)
- [ ] Node.js 20+ for Vite/TypeScript in `extension/`
- [ ] Chrome available to load unpacked from `extension/dist`
- [ ] At least one profile with existing schema v1 IndexedDB data for migration checks (or seed v1 records before upgrading)

## Feature flags

**Use feature flag:** No

- Feature ships without an environment flag; all phases are testable with default config.
- Spec lists feature flags as out of scope.

## Data migration

**Migration required:** Yes

| Item | Value |
|---|---|
| What changes | IndexedDB `DB_VERSION` 1 → 2. `Application`: `stages` string → `string[]`; `stack` string → `string[]`; remove `notes`; add `timeline: TimelineEntry[]`. `nextStep` non-dates cleared. New empty `settings` object store for job-title and stack-tag vocabulary (used in T3; avoids a later v3 bump). |
| Introduced in phase | Phase 1 — spec task T1 |
| Existing data affected | Yes — all rows in the `applications` store from Phase 1 usage |
| Migration approach | Versioned upgrade in `onupgradeneeded` plus `extension/src/storage/migrations/v1-to-v2.ts` that reads v1 records and writes v2 shape |
| One-off scripts required | No |

v1 → v2 record rules (from spec):

- `stages`: split existing string, or default template `["Screening", "Code Test", "Tech Interview", "HR Interview"]` if empty
- `stack`: comma-split or single-element array
- `notes`: non-empty → one `timeline` entry `{ kind: "note" }` at `lastUpdated` or `appliedAt`
- Bootstrap `timeline` with `status_change` **Applied** at `appliedAt` if no history exists
- `nextStep`: invalid / non-date text → empty string

**Verification after migration:**

- [ ] Existing company, job title, status, salary, URLs, dates, rating, match, contact, resumeId survive
- [ ] Each migrated row has a timeline with at least Applied
- [ ] Fresh install (no prior DB) creates schema v2 stores (`applications`, `resumes`, `settings`) and empty tracker
- [ ] If upgrade fails, keep v1 backup notes: do not bump `DB_VERSION` past 2 in this spec; fix migration and reload extension

## Phase 1 — Schema v2 and service

**Outcome:** Existing v1 rows migrate to v2; `ApplicationService` creates default stages and Applied timeline, appends timeline on status change, and supports notes plus optional rejection reason. Tracker still opens and lists rows.

**Branch:** `phase/1-schema-v2`  
**Spec tasks:** T1, T2  
**Plan file:** `plans/resume-tracker-improvements-phase-1.plan.md`  
**Shippable:** Yes — data and service contract are correct; table UX is still Phase 1-like (type-compat only)

**Phase boundary:**

- **Layers touched:** Domain (+), Infrastructure (+), Repository (~), Service (+)
- **Files owned by this phase:** `extension/src/domain/timeline.ts`, `extension/src/domain/application.ts`, `extension/src/domain/status.ts`, `extension/src/storage/db.ts`, `extension/src/storage/migrations/v1-to-v2.ts`, `extension/src/storage/repositories/application.repository.ts`, `extension/src/storage/repositories/application.repository.test.ts`, `extension/src/application/services/application.service.ts`, `extension/src/application/services/application.service.test.ts`. Minimal type-compat in tracker consumers so `npm run build` stays green (join arrays for display; do not implement T4 UX).
- **Contract for later phases:** `Application` and `TimelineEntry` types; terminals `Applied` / `Offer` / `Rejected`; `DB_VERSION === 2` with `settings` store present; `ApplicationService` `create` / `update` / `delete` / `list` plus `updateStatus`, `addNote`, `reject`; status must be a terminal or a value in that row’s `stages`

**Migration (this phase):** Required — schema v1 → v2 (see **Data migration**)

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `3f8a1c2e-9b4d-4e71-86c0-1d2e3f4a5b6c` | T1 | pending |
| `4a9b2d3f-0c5e-4f82-97d1-2e3f4a5b6c7d` | T2 | pending |

Update `status` in YAML frontmatter (`pending` | `in-progress` | `completed` | `error`) as work progresses. Cursor Plan Mode reads frontmatter, not markdown checkboxes below.

### Execution order

#### Session: T1 — Domain types and IndexedDB v2 migration

**Todo id:** `3f8a1c2e-9b4d-4e71-86c0-1d2e3f4a5b6c`  
**Spec ref:** T1  
**Layers:** Domain (+), Infrastructure (+), Repository (~)  
**Depends on:** —  
**Focus:**

- Add `TimelineEntry` and v2 `Application` (drop persisted `notes`; `stages`/`stack` arrays)
- Bump `DB_VERSION` to 2; migrate v1 records; create empty `settings` store
- Update application repository read/write and tests

**Verify (from spec):** `cd extension && npm test`; manual: load extension with existing v1 data, open tracker, rows present with timeline containing at least Applied

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/1-schema-v2`

#### Session: T2 — ApplicationService — timeline, status, notes, rejection

**Todo id:** `4a9b2d3f-0c5e-4f82-97d1-2e3f4a5b6c7d`  
**Spec ref:** T2  
**Layers:** Service (+), Domain (read-only)  
**Depends on:** T1  
**Focus:**

- `create`: `status = Applied`, default stages template, timeline Applied at `appliedAt`
- `updateStatus`: append `status_change`, set `lastUpdated` to today; validate status ∈ terminals ∪ row `stages`
- `addNote`; `reject` always logs Rejected, optional `rejection_reason`
- Keep `create` / `update` / `delete` / `list` stable for future capture

**Verify (from spec):** Unit tests for status change timeline, Rejected without reason, Rejected with reason, invalid status rejected

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/1-schema-v2`

### Automated tests

Commands to run before opening a PR for this phase:

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] v1 → v2 migration: stages/stack arrays, notes → note entry, Applied bootstrap, nextStep cleanup (`extension/src/storage/migrations/` and/or `application.repository.test.ts`)
- [ ] Repository CRUD with v2 shape (`extension/src/storage/repositories/application.repository.test.ts`)
- [ ] Service: timeline on status change, reject with/without reason, invalid status (`extension/src/application/services/application.service.test.ts`)

### Manual tests

1. Build and load unpacked from `extension/dist`. Open tracker via popup.
2. **Fresh install:** empty table; add a row (type-compat UI is fine); reload; row persists with default stages and Applied timeline (inspect via service/tests if UI does not show timeline yet).
3. **Upgrade:** load a profile that already has v1 rows, then this build; all rows still listed; no data loss on company/title/status/dates.
4. Create / edit / delete still work after migration.

**Regression scope for this phase:** Phase 1 add/edit/delete/persist must still work (N/A beyond that; capture not built).

### Phase milestone

- [ ] All spec tasks for this phase complete (T1–T2)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (v1 data and fresh install)
- [ ] Feature flag behavior verified (N/A — no flag)
- [ ] Automated tests pass (see above)
- [ ] Manual tests pass (see above)
- [ ] `phase/1-schema-v2` pushed (merge to `main` deferred until Phase 3)

---

## Phase 2 — Table UX

**Outcome:** Tracker table uses spec column order, sortable headers (default `lastUpdated` desc), soft inline edit, keyboard Tab/Enter, row colors, per-row stages, status options from terminals plus that row’s stages, job-title combobox, and date next-step.

**Branch:** `phase/2-table-ux`  
**Spec tasks:** T3, T4, T5  
**Plan file:** `plans/resume-tracker-improvements-phase-2.plan.md`  
**Shippable:** No — Stack, Contact, Rating, Match Level, and notes stay in leftover table columns until Phase 3 T6. Do not merge this branch to `main`; stack Phase 3 on it.

**Phase boundary:**

- **Layers touched:** Infrastructure (+ settings store usage), Repository (+), Service (~), Hooks (~), UI (+)
- **Files owned by this phase:** `extension/src/storage/repositories/settings.repository.ts`, `extension/src/application/services/application.service.ts` or `vocabulary.service.ts`, `extension/src/tracker/components/ApplicationsTable.tsx`, `extension/src/tracker/components/InlineTextCell.tsx`, `extension/src/tracker/components/StagesCell.tsx`, `extension/src/tracker/components/JobTitleCombobox.tsx`, `extension/src/tracker/hooks/useApplications.ts`, `extension/src/tracker/styles.css`
- **Contract for later phases:** Settings vocabulary list/add for job titles and stack tags; table column keys and sort API in `useApplications`; status/stages/job-title/next-step cells call Service only

**Migration (this phase):** Not required — uses `settings` store created in Phase 1; no application record shape change

T4 vs T6: implement new table columns and inline UX in T4, but **keep** Rating, Match Level, Stack, Contact, and a notes affordance in the table until T6 moves them into the drawer so Phase 2 never drops fields.

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `5b0c3e40-1d6f-4013-a8e2-3f4a5b6c7d8e` | T3 | pending |
| `6c1d4f51-2e70-4124-b9f3-4a5b6c7d8e9f` | T4 | pending |
| `7d2e5062-3f81-4235-8a04-5b6c7d8e9f0a` | T5 | pending |

### Execution order

#### Session: T3 — Settings vocabulary (job titles, stack tags)

**Todo id:** `5b0c3e40-1d6f-4013-a8e2-3f4a5b6c7d8e`  
**Spec ref:** T3  
**Layers:** Infrastructure (+), Repository (+), Service (~)  
**Depends on:** T1  
**Focus:**

- Settings repository for job-title and stack-tag suggestions
- Service methods to list/add when the user creates a new combobox/tag value
- Prefer methods on `ApplicationService` or a small `vocabulary.service.ts`; do not add a third persistence style

**Verify (from spec):** Manual: create new job title, new row shows it in combobox suggestions (full UI in T5; until then, verify via service/unit test or temporary call)

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/2-table-ux`

#### Session: T4 — Table shell — column order, sort, row colors, inline edit, keyboard

**Todo id:** `6c1d4f51-2e70-4124-b9f3-4a5b6c7d8e9f`  
**Spec ref:** T4  
**Layers:** UI (+), Hooks (~)  
**Depends on:** T2  
**Focus:**

- Column order per spec for the v2 table; sortable headers; default `lastUpdated` descending
- Inline display vs edit with light borders; Tab saves and moves to next table column; Enter saves and keeps focus
- Row classes: Rejected red tint; Applied neutral; any other status green
- Defer removing drawer-only columns until T6

**Verify (from spec):** Manual: sort columns; Tab through row; colors match status; soft edit UX

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/2-table-ux`

#### Session: T5 — Stages, status, job title combobox, next step date

**Todo id:** `7d2e5062-3f81-4235-8a04-5b6c7d8e9f0a`  
**Spec ref:** T5  
**Layers:** UI (+), Hooks (~), Service (read-only)  
**Depends on:** T3, T4  
**Focus:**

- Stages chips; type + Enter adds a tag on that row only
- Status dropdown = Applied, Offer, Rejected + that row’s stages (status changes via Service)
- Job title combobox with persisted suggestions
- Next step and Last Updated as date inputs; Resume select unchanged

**Verify (from spec):** Manual: new row has four default stages; add custom stage; status list updates; next step stores date

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/2-table-ux`

### Automated tests

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] Vocabulary list/add (repository or service test)
- [ ] Sort default `lastUpdated` desc if covered in hook/unit tests
- [ ] No broken Phase 1/T2 service tests

If UI tests do not exist, add the minimum service/repository tests for T3 before merge; T4–T5 rely on manual tests.

### Manual tests

1. Load unpacked build; open tracker.
2. Default sort is last updated, newest first; click other headers to sort.
3. Tab through a row; Enter keeps focus; cells look like text until focused.
4. Rejected rows red; Applied neutral; Offer or a stage name green.
5. New row shows four default stages; add a custom stage; status list includes it.
6. Type a new job title; it appears as a suggestion on another row.
7. Next step stores a date (same control style as last updated).

**Regression scope for this phase:** Phase 1 add/edit/delete/persist and Phase 1 migration checks must still pass.

### Phase milestone

- [ ] All spec tasks for this phase complete (T3–T5)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (N/A)
- [ ] Feature flag behavior verified (N/A)
- [ ] Automated tests pass
- [ ] Manual tests pass
- [ ] Phase 1 regression checks pass
- [ ] `phase/2-table-ux` pushed (merge to `main` deferred until Phase 3)

---

## Phase 3 — Drawer and polish

**Outcome:** Left detail drawer holds stack, contact, rating, match level, chronological timeline, and add-note; Rejected opens an optional-reason dialog; action buttons are icons; add row is icon plus label; full suite and Phase 1 flows still pass.

**Branch:** `phase/3-drawer-polish`  
**Spec tasks:** T6, T7  
**Plan file:** `plans/resume-tracker-improvements-phase-3.plan.md`  
**Shippable:** Yes — tracker UX v2 is complete; capture remains out of scope

**Phase boundary:**

- **Layers touched:** UI (+/~), Hooks (~), Service (~)
- **Files owned by this phase:** `extension/src/tracker/components/DetailDrawer.tsx`, `extension/src/tracker/components/TimelineList.tsx`, `extension/src/tracker/components/RejectionDialog.tsx`, `extension/src/tracker/App.tsx`, `extension/src/tracker/styles.css`, `extension/src/tracker/components/AddApplicationRow.tsx`, `extension/src/tracker/components/ApplicationsTable.tsx`, `extension/README.md`
- **Contract for later phases:** Capture (Phase 3 of the product) continues to call `ApplicationService.create` / `update` / `list` with Applied + timeline; do not add capture or content scripts here

**Migration (this phase):** Not required

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `8e3f6173-4092-4346-9b15-6c7d8e9f0a1b` | T6 | pending |
| `9f407284-51a3-4457-ac26-7d8e9f0a1b2c` | T7 | pending |

### Execution order

#### Session: T6 — Detail drawer, timeline UI, rejection dialog

**Todo id:** `8e3f6173-4092-4346-9b15-6c7d8e9f0a1b`  
**Spec ref:** T6  
**Layers:** UI (+), Hooks (~), Service (read-only)  
**Depends on:** T2, T4  
**Focus:**

- Left drawer from row icon; stack creatable multi-select; Contact; Rating; Match Level
- Timeline chronological ascending (spec example); add note via Service
- Status → Rejected opens modal; reason optional; always append Rejected
- Remove drawer-only fields from the table; drawer Tab order visits every control

**Verify (from spec):** Manual: full timeline example flow; note added; Rejected with and without reason; drawer fields persist

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/3-drawer-polish`

#### Session: T7 — Actions icons, add row control, polish and regression tests

**Todo id:** `9f407284-51a3-4457-ac26-7d8e9f0a1b2c`  
**Spec ref:** T7  
**Layers:** UI (~), Service (~)  
**Depends on:** T6  
**Focus:**

- Icon-only drawer and delete (confirm delete); Add row = plus icon + “Add row”
- README tracker section; fix broken tests; full suite

**Verify (from spec):** `cd extension && npm test && npm run build`; manual Phase 1 flows still work (add/edit/delete, persist reload)

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on `phase/3-drawer-polish`

### Automated tests

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] Full existing suite green after UI moves fields to the drawer
- [ ] Service rejection/note tests still pass (no UI-only timeline writes)

### Manual tests

1. Open drawer from row icon; stack/contact/rating/match persist after reload.
2. Timeline shows Applied then later status lines dated; add a note; order matches spec example (chronological).
3. Set status Rejected, cancel/empty reason → Rejected line only; with reason → extra reason line.
4. Table columns left → right: Company, Job Title, Status, Stages, Job URL, Resume, Next step, Last Updated, Salary, Actions.
5. Delete and open-drawer are icons; Add row shows icon + text.
6. Restart Chrome / reload extension; rows still there.

**Regression scope for this phase:** Phase 1 and Phase 2 manual tests must still pass.

### Phase milestone

- [ ] All spec tasks for this phase complete (T6–T7)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (N/A)
- [ ] Feature flag behavior verified (N/A)
- [ ] Automated tests pass
- [ ] Manual tests pass
- [ ] Phase 1 and Phase 2 regression checks pass
- [ ] PR from `phase/3-drawer-polish` → `main` reviewed and merged (only merge to `main` in this plan)

---

## Dependencies

| Task / Phase | Blocked by | Notes |
|---|---|---|
| Phase 2 | Phase 1 branch (`phase/1-schema-v2`) | Uses v2 `Application`, Service methods, `settings` store; no `main` merge required |
| Phase 3 | Phase 2 branch (`phase/2-table-ux`) | Drawer replaces leftover table fields; uses `addNote` / `reject`; then PR to `main` |
| T2 | T1 | Service needs v2 types and repository |
| T3 | T1 | Settings store created in v2 upgrade |
| T4 | T2 | Status/row colors assume Service-updated status |
| T5 | T3, T4 | Combobox needs vocabulary; cells land in table shell |
| T6 | T2, T4 | Timeline/reject APIs; table has a row to attach drawer |
| T7 | T6 | Icons and README after drawer exists |
| Capture spec | This plan’s Phase 3 merge | Must keep `ApplicationService.create` Applied + timeline |

Migration ordering: run v1 → v2 only in Phase 1 T1; later phases must not bump `DB_VERSION` unless a new store is unavoidable (settings store is included in v2).

## Risks and notes

- T1 changes `Application` while the Phase 1 table still treats `stages`/`stack`/`notes` as strings — include minimal type-compat so the tracker compiles before T4.
- Do not remove drawer-only columns in T4; T6 owns that move so users never lose stack/contact/notes on `main` between Phase 2 and Phase 3.
- All status changes and timeline appends go through Service (including rejection), not only UI handlers.
- Keep terminal label **Offer**; do not rename to Accepted.
- Capture (`specs/resume-tracker-capture.spec.md`) is blocked until this work merges; do not add content scripts here.
- Cursor Plan Mode YAML corruption: validate frontmatter after edits; keep todo `id` values stable; update `status` in both master and phase plan files when a task completes.

## Progress

Track via YAML frontmatter `todos[].status` (source of truth for Plan Mode). Summary:

| Phase | Plan file | Tasks | Done |
|---|---|---|---|
| 1 — Schema v2 and service | `plans/resume-tracker-improvements-phase-1.plan.md` | T1–T2 | 0 / 2 |
| 2 — Table UX | `plans/resume-tracker-improvements-phase-2.plan.md` | T3–T5 | 0 / 3 |
| 3 — Drawer and polish | `plans/resume-tracker-improvements-phase-3.plan.md` | T6–T7 | 0 / 2 |
