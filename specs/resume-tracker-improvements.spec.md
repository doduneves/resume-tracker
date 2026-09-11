# Resume Tracker — Improvements (Tracker UX v2)

**Status:** Planned  
**Depends on:** `specs/resume-tracker-phase-1.spec.md` (complete)  
**Before:** `specs/resume-tracker-capture.spec.md` (Phase 3 capture)

## Why

Phase 1 works but the table is hard to use at scale: always-on inputs, wide columns, and no history of when each pipeline step happened. After real usage, the tracker needs a calmer UI, per-job pipelines, a status timeline, and faster editing before capture features are built.

## What

Upgrade the React tracker: inline edit with soft styling, sortable columns (default `lastUpdated` descending), a left detail drawer (stack, contact, rating, match level, notes timeline), per-row **stages** with creatable multi-select, **status** derived from terminals plus that row’s stages, **next step** as a follow-up **date**, job-title combobox, status-change timeline (plus notes and optional rejection reason), row coloring, and IndexedDB **schema v2 migration**. Done when existing data migrates cleanly and all behaviors below work in manual testing.

## Context

**Relevant files:**

- `extension/src/domain/application.ts` — extend `Application` shape
- `extension/src/domain/status.ts` — terminal status constants (`Applied`, `Offer`, `Rejected`)
- `extension/src/domain/timeline.ts` — `TimelineEntry` types (new)
- `extension/src/storage/db.ts` — bump to schema v2 + migration
- `extension/src/storage/migrations/` — v1 → v2 migration (new)
- `extension/src/storage/repositories/application.repository.ts` — persist new shape
- `extension/src/storage/repositories/settings.repository.ts` — job title / stack tag suggestions (new)
- `extension/src/application/services/application.service.ts` — status changes, timeline, notes, rejection
- `extension/src/tracker/components/ApplicationsTable.tsx` — replace always-on fields
- `extension/src/tracker/components/` — inline cells, drawer, combobox, chips (new components)
- `extension/src/tracker/styles.css` — soft UI, row colors
- `extension/src/tracker/hooks/useApplications.ts` — sorting, drawer state if needed
- `extension/src/tracker/components/AddApplicationRow.tsx` — icon + label

**Architecture:**

| Layer | Location | Responsibility | Depends on |
|---|---|---|---|
| Domain | `extension/src/domain/` | `Application`, `TimelineEntry`, terminals, default stage template | — |
| Infrastructure | `extension/src/storage/db.ts`, `storage/migrations/` | IndexedDB v2, upgrade from v1 | Domain |
| Repository | `extension/src/storage/repositories/` | Applications + settings vocab | Infrastructure, Domain |
| Service | `extension/src/application/services/` | Timeline on status change, validation, migration-safe create/update | Repository, Domain |
| Hooks | `extension/src/tracker/hooks/` | Load/sort, drawer selection | Service |
| UI | `extension/src/tracker/` | Table, inline edit, drawer, dialogs | Hooks, Service |

**Dependency rules:**

- UI must not call Repository directly
- All status changes and timeline appends go through Service (including rejection flow)
- Domain must not import React

**Patterns to follow:**

- Layering from `specs/resume-tracker-phase-1.spec.md`
- English UI copy
- Keep `ApplicationService` public methods stable for future capture: `create`, `update`, `delete`, `list` (extend, do not break callers)

**Key decisions already made:**

- Keep terminal label **Offer** (not “Accepted”)
- Default **stages** on new row (pre-populated on `stages[]`): `Screening`, `Code Test`, `Tech Interview`, `HR Interview`
- **Status** options per row: `Applied`, `Offer`, `Rejected`, plus each value in that row’s `stages[]`
- **Stages** are per row (pipelines differ per job); type + Enter adds a new stage tag to that row only
- **Next step** is a **date** (when to follow up), not free text — same control style as `lastUpdated`
- **Timeline:** every **status change** logs an entry with that date; user can **add notes**; selecting **Rejected** always logs `Rejected` on the timeline; **rejection reason optional** (if empty, still show Rejected entry only)
- **Table columns (left → right):** Company, Job Title, Status, Stages, Job URL, Resume, Next step (date), Last Updated, Salary, Actions
- **Drawer only:** Stack (multi-select creatable), Contact, Rating, Match Level, timeline + add note
- **Row colors:** `Rejected` → red tint; `Applied` → neutral; any other status (including `Offer` and stage names) → green tint
- **Sort:** all table columns sortable; default sort **`lastUpdated` descending**
- **Keyboard:** Tab saves current cell and moves to next **table** column in order; drawer has its own tab order through all fields (no skipping); Enter saves and keeps focus on same cell
- **Actions:** Delete and Open drawer as **icons** only; Add row = **icon + “Add row”** text
- **Job title:** combobox — type, pick existing suggestion, or create new (persist suggestions in settings store)

**Data model (post-migration):**

```typescript
type TimelineEntryKind = "status_change" | "note" | "rejection_reason";

type TimelineEntry = {
  id: string;
  at: string; // ISO date (use date portion for display DD/MM/YYYY)
  kind: TimelineEntryKind;
  text: string; // status label, note body, or rejection reason
};

type Application = {
  id: string;
  company: string;
  status: string; // Applied | Offer | Rejected | ∈ stages
  jobTitle: string;
  nextStep: string; // ISO date — follow-up date
  lastUpdated: string;
  salary: string;
  rating: number | null;
  matchLevel: string;
  stack: string[]; // multi-value; drawer
  jobUrl: string;
  resumeId: "en" | "pt-br" | null;
  stages: string[]; // per-row pipeline
  contact: string;
  timeline: TimelineEntry[];
  appliedAt: string;
};
```

Remove persisted `notes: string` (migrate into `timeline`).

**Timeline example (UI):**

```text
10/09/2026 — Applied
11/09/2026 — Screening
14/09/2026 — HR Interview
14/09/2026 — [note text]
15/09/2026 — Rejected
           — [optional reason]
```

**Migration (v1 → v2):**

- Bump `DB_VERSION` to 2
- `stages`: string → `string[]` (split or default template if empty)
- `nextStep`: invalid/non-date text → empty string or omit
- `notes`: non-empty → one `timeline` entry `kind: note` at `lastUpdated` or `appliedAt`
- Bootstrap `timeline` with `status_change` **`Applied`** at `appliedAt` if no history exists
- `stack`: string → `string[]` (comma-split or single-element array)
- One-off migration runs in `onupgradeneeded` or dedicated migration module reading v1 records

## Constraints

**Must:**

- Migrate existing user data without data loss for core fields
- Append timeline on every status change in Service (not only in UI)
- Validate `status` ∈ { `Applied`, `Offer`, `Rejected` } ∪ `stages`
- On create: `status = Applied`, default `stages` template, timeline entry `Applied` at `appliedAt`
- Rejected flow: optional reason dialog; always append `status_change` Rejected; append `rejection_reason` entry only when reason provided
- Default table sort: `lastUpdated` desc
- Phase 3 capture spec must still be able to create rows with `Applied` + timeline entry via Service

**Must not:**

- Content scripts, resume library, or capture flows (Phase 3)
- Change popup beyond tracker-related needs
- Break layer rules (UI → Service → Repository)
- Require rejection reason text

**Out of scope:**

- Kanban view
- Global shared stage templates across rows (only default on create)
- Feature flags
- Notion import

## Tasks

Break into tasks that:
- Can each be completed in one session
- Have a clear verify step
- Are safe to commit independently

### T1: Domain types and IndexedDB v2 migration

**Layers:** Domain (+), Infrastructure (+), Repository (~)

**Do:** Add `TimelineEntry`, terminal constants, updated `Application` type. Bump DB to v2. Implement v1→v2 migration (stages array, stack array, timeline bootstrap, notes → note entry, nextStep cleanup). Update repository read/write for new shape.

**Files:** `extension/src/domain/timeline.ts`, `extension/src/domain/application.ts`, `extension/src/domain/status.ts`, `extension/src/storage/db.ts`, `extension/src/storage/migrations/v1-to-v2.ts`, `extension/src/storage/repositories/application.repository.ts`, `extension/src/storage/repositories/application.repository.test.ts`

**Verify:** `cd extension && npm test`; manual: load extension with existing v1 data, open tracker, rows present with timeline containing at least Applied

### T2: ApplicationService — timeline, status, notes, rejection

**Layers:** Service (+), Domain (read-only)

**Do:** Centralize `updateStatus` (append timeline, set `lastUpdated` to today), `addNote`, `reject` (optional reason entries), `create` with default stages + Applied timeline. Validate status against row stages + terminals. Update tests.

**Files:** `extension/src/application/services/application.service.ts`, `extension/src/application/services/application.service.test.ts`

**Verify:** Unit tests for status change timeline, Rejected without reason, Rejected with reason, invalid status rejected

### T3: Settings vocabulary (job titles, stack tags)

**Layers:** Infrastructure (+), Repository (+), Service (~)

**Do:** Settings store (or keyed records) for job title and stack tag suggestions. Service methods to list/add suggestions when user creates new combobox/tag values.

**Files:** `extension/src/storage/repositories/settings.repository.ts`, `extension/src/application/services/application.service.ts` or `vocabulary.service.ts`

**Verify:** Manual: create new job title, new row shows it in combobox suggestions

### T4: Table shell — column order, sort, row colors, inline edit, keyboard

**Layers:** UI (+), Hooks (~)

**Do:** Reorder columns per spec. Sortable headers; default `lastUpdated` desc. Inline display mode vs edit mode with light borders. Row classes: rejected / applied / in-progress green. Tab saves and moves to next column; Enter saves same cell. Remove Rating/Match Level/Stack/Contact/Notes from table cells.

**Files:** `extension/src/tracker/components/ApplicationsTable.tsx`, `extension/src/tracker/components/InlineTextCell.tsx` (new), `extension/src/tracker/hooks/useApplications.ts`, `extension/src/tracker/styles.css`

**Verify:** Manual: sort columns; Tab through row; colors match status; soft edit UX

### T5: Stages, status, job title combobox, next step date

**Layers:** UI (+), Hooks (~), Service (read-only)

**Do:** Stages multi-select with chips; type + Enter adds tag to row. Status dropdown = Applied, Offer, Rejected + row stages. Job title combobox with suggestions. Next step and Last Updated as date inputs. Resume select unchanged.

**Files:** `extension/src/tracker/components/StagesCell.tsx`, `extension/src/tracker/components/JobTitleCombobox.tsx`, `extension/src/tracker/components/ApplicationsTable.tsx`

**Verify:** Manual: new row has four default stages; add custom stage; status list updates; next step stores date

### T6: Detail drawer, timeline UI, rejection dialog

**Layers:** UI (+), Hooks (~), Service (read-only)

**Do:** Left drawer opened from row icon. Read-only summary optional. Stack multi-select creatable; Contact; Rating; Match Level. Timeline list newest-first or chronological per design (spec: chronological ascending like example). “Add note” appends via Service. On status → Rejected, modal for optional reason. Drawer tab order through all controls.

**Files:** `extension/src/tracker/components/DetailDrawer.tsx`, `extension/src/tracker/components/TimelineList.tsx`, `extension/src/tracker/components/RejectionDialog.tsx`, `extension/src/tracker/App.tsx`, `extension/src/tracker/styles.css`

**Verify:** Manual: full timeline example flow; note added; Rejected with and without reason; drawer fields persist

### T7: Actions icons, add row control, polish and regression tests

**Layers:** UI (~), Service (~)

**Do:** Icon buttons for drawer and delete (confirm delete). Add row with plus icon + text. Update README tracker section. Fix/update any broken tests; run full suite.

**Files:** `extension/src/tracker/components/AddApplicationRow.tsx`, `extension/src/tracker/components/ApplicationsTable.tsx`, `extension/README.md`

**Verify:** `cd extension && npm test && npm run build`; manual Phase 1 flows still work (add/edit/delete, persist reload)

## Done

- [ ] `cd extension && npm test && npm run build` pass
- [ ] Manual: v1 data migrated; timeline shows Applied at minimum
- [ ] Manual: status changes append dated timeline lines; optional rejection reason
- [ ] Manual: default sort lastUpdated desc; Tab/Enter behavior; row colors
- [ ] Manual: drawer fields + timeline; table columns match spec order
- [ ] Manual: job title combobox and per-row stages behave as specified
- [ ] No regression: create/delete row, data survives browser restart
