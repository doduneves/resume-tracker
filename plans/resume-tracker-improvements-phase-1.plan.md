---
name: "Resume Tracker Improvements — Phase 1: Schema v2 and service"
overview: "Migrate IndexedDB to v2 and add timeline-aware ApplicationService methods."
todos:
  - id: "3f8a1c2e-9b4d-4e71-86c0-1d2e3f4a5b6c"
    content: "T1: Domain types and IndexedDB v2 migration"
    status: pending
  - id: "4a9b2d3f-0c5e-4f82-97d1-2e3f4a5b6c7d"
    content: "T2: ApplicationService — timeline, status, notes, rejection"
    status: pending
isProject: false
---

# Resume Tracker Improvements — Phase 1

**Spec:** [`specs/resume-tracker-improvements.spec.md`](../specs/resume-tracker-improvements.spec.md)  
Full context: [`plans/resume-tracker-improvements.plan.md`](resume-tracker-improvements.plan.md)

**Branch:** `phase/1-schema-v2` (base: `main`)  
**Spec tasks:** T1–T2  
**Shippable:** Yes — migrated data plus Service contract; table UX still Phase 1-like

**Phase boundary:** Domain types, IndexedDB v2 + v1→v2 migration, empty `settings` store, application repository, `ApplicationService` timeline/status/note/reject. Minimal tracker type-compat only. Do not implement table UX, drawer, or capture.

**Migration (this phase):** Required — `DB_VERSION` 1 → 2 (see master plan **Data migration**)

## Execution order

#### Session: T1 — Domain types and IndexedDB v2 migration

**Todo id:** `3f8a1c2e-9b4d-4e71-86c0-1d2e3f4a5b6c`  
**Depends on:** —  
**Focus:** `TimelineEntry` + v2 `Application`; bump DB to 2; migrate stages/stack/notes/timeline/nextStep; create `settings` store; repository tests.

**Verify:** `cd extension && npm test`; load extension with v1 data; rows present; timeline has at least Applied

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/1-schema-v2`

#### Session: T2 — ApplicationService — timeline, status, notes, rejection

**Todo id:** `4a9b2d3f-0c5e-4f82-97d1-2e3f4a5b6c7d`  
**Depends on:** T1  
**Focus:** `create` defaults; `updateStatus`; `addNote`; `reject` (reason optional); validate status; keep `create`/`update`/`delete`/`list` stable.

**Verify:** Unit tests for timeline on status change, Rejected with and without reason, invalid status rejected

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/1-schema-v2`

## Automated tests

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] v1 → v2 migration and repository CRUD (`application.repository.test.ts`, migration module)
- [ ] Service timeline / reject / validation (`application.service.test.ts`)

## Manual tests

1. Fresh install: empty tracker; add a row; reload; data persists.
2. Upgrade a profile with v1 rows: companies and dates survive; timeline bootstrapped.
3. Add / edit / delete still work.

**Regression scope for this phase:** N/A (first improvements phase; Phase 1 CRUD must still work)

## Phase milestone

- [ ] T1–T2 complete; YAML todos `completed`
- [ ] Migration verified (v1 data and fresh install)
- [ ] `npm test` and `npm run build` pass
- [ ] Manual tests pass
- [ ] PR `phase/1-schema-v2` → `main` merged
