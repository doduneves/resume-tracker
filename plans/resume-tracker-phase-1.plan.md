---
name: "Resume Tracker — Phase 1: Tracker CRUD"
overview: "Open the tracker via the popup, manage application rows by hand, and persist them in IndexedDB."
todos:
  - id: "7c4a3e2b-9f18-4d5a-a1c8-2e6b0d9f4a11"
    content: "T1: Extension scaffold (tracker-only)"
    status: completed
  - id: "a91d6c3e-4b27-4f80-8e15-3c7a9d2e5b40"
    content: "T2: Domain, infrastructure, and repositories"
    status: completed
  - id: "b2e8f1a4-6c39-4a71-9d02-5f8b3c1e7a56"
    content: "T3: Application service and React tracker (Phase 1 — manual use)"
    status: completed
  - id: "c3f9a2b5-7d4a-4b82-ae13-6a9c4d0f8b67"
    content: "T4: Popup shell and tracker entry point"
    status: completed
isProject: false
---

# Resume Tracker — Phase 1

**Status:** Complete  
**Spec:** [`specs/resume-tracker-phase-1.spec.md`](../specs/resume-tracker-phase-1.spec.md)  
Full context: [`plans/resume-tracker.plan.md`](resume-tracker.plan.md)

**Branch:** `phase/1-tracker` (base: `main`)  
**Spec tasks:** T1–T4  
**Shippable:** Yes — manual tracker replaces spreadsheet/Notion

**Phase boundary:** Scaffold, domain, IndexedDB schema v1 (applications + resume store placeholder), `ApplicationRepository`, stub `ResumeRepository`, `ApplicationService`, React tracker, popup "Open tracker" only.

**Migration (this phase):** Not required — greenfield schema create in T2.

## Execution order

#### Session: T1 — Extension scaffold (tracker-only)

**Todo id:** `7c4a3e2b-9f18-4d5a-a1c8-2e6b0d9f4a11`  
**Depends on:** —  
**Focus:** Vite/TS MV3 scaffold; tracker HTML; SW stub; README load-unpacked.

**Verify:** `npm run build`, load unpacked, tracker opens without errors

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/1-tracker`

#### Session: T2 — Domain, infrastructure, and repositories

**Todo id:** `a91d6c3e-4b27-4f80-8e15-3c7a9d2e5b40`  
**Depends on:** T1  
**Focus:** Domain types/status; IndexedDB v1 both stores; application CRUD; resume interface stub.

**Verify:** CRUD a test application via unit test or temporary debug hook

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/1-tracker`

#### Session: T3 — Application service and React tracker

**Todo id:** `b2e8f1a4-6c39-4a71-9d02-5f8b3c1e7a56`  
**Depends on:** T2  
**Focus:** Service defaults (`Applied` + dates); table + add/edit/delete via hooks; empty state; English copy.

**Verify:** Add/fill/reload persist; change status; delete row

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/1-tracker`

#### Session: T4 — Popup shell and tracker entry point

**Todo id:** `c3f9a2b5-7d4a-4b82-ae13-6a9c4d0f8b67`  
**Depends on:** T1, T3  
**Focus:** Manifest popup; "Open tracker" only.

**Verify:** Icon → Open tracker → tracker loads

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/1-tracker`

## Automated tests

```bash
cd extension && npm test && npm run build
```

- [ ] Application repository CRUD
- [ ] Application service create defaults
- [ ] Six status values on domain enum

## Manual tests

1. Build and load unpacked
2. Empty state → add row → all columns + six statuses → reload persists
3. Edit then delete; popup opens tracker
4. UI/hooks do not import Repository

**Regression:** N/A

## Phase milestone

- [x] T1–T4 complete; YAML todos `completed`
- [x] Spec Phase 1 **Done** checklist
- [x] Phase 1 shipped and in daily use
