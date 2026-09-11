---
name: "Resume Tracker"
overview: "Ship a local Chrome extension tracker with manual application CRUD, then add resume injection and confirm-to-save capture."
todos:
  - id: "7c4a3e2b-9f18-4d5a-a1c8-2e6b0d9f4a11"
    content: "[Phase 1] T1: Extension scaffold (tracker-only)"
    status: completed
  - id: "a91d6c3e-4b27-4f80-8e15-3c7a9d2e5b40"
    content: "[Phase 1] T2: Domain, infrastructure, and repositories"
    status: completed
  - id: "b2e8f1a4-6c39-4a71-9d02-5f8b3c1e7a56"
    content: "[Phase 1] T3: Application service and React tracker (Phase 1 — manual use)"
    status: completed
  - id: "c3f9a2b5-7d4a-4b82-ae13-6a9c4d0f8b67"
    content: "[Phase 1] T4: Popup shell and tracker entry point"
    status: completed
  - id: "d4a0b3c6-8e5b-4c93-bf24-7b0d5e1a9c78"
    content: "[Phase 3 — Capture] T1: Resume library (EN / PT-BR)"
    status: pending
  - id: "e5b1c4d7-9f6c-4d04-8035-8c1e6f2b0d89"
    content: "[Phase 3 — Capture] T2: File-input overlay and PDF injection"
    status: pending
  - id: "f6c2d5e8-0a7d-4e15-9146-9d2f7a3c1e90"
    content: "[Phase 3 — Capture] T3: Save application flow"
    status: pending
  - id: "07d3e6f9-1b8e-4f26-a257-0e3a8b4d2f01"
    content: "[Phase 3 — Capture] T4: End-to-end wiring and polish"
    status: pending
isProject: true
---

# Resume Tracker — Plan

> **Cursor Plan Mode:** This file uses YAML frontmatter for interactive todos (checkboxes). Open in Plan Mode → review todos → **Build**, or select todos → **Send to New Agent**. There are no phase radio buttons; use the per-phase plan files below to Build one phase at a time.

## Source

- Spec index: `specs/resume-tracker.spec.md`
- Phase 1 spec (complete): `specs/resume-tracker-phase-1.spec.md`
- Capture spec (Phase 3): `specs/resume-tracker-capture.spec.md`
- Improvements spec: not created yet (Phase 2)
- Master plan: `plans/resume-tracker.plan.md` (this file)
- Phase plans: `plans/resume-tracker-phase-1.plan.md`, `plans/resume-tracker-phase-2.plan.md`

## Goal

Phase 1 (manual tracker CRUD) is **complete**. Next: spec and build tracker improvements from real usage (Phase 2), then capture (Phase 3).

## Cursor Plan Mode files

| File | Use when |
|---|---|
| `plans/resume-tracker.plan.md` | Full overview; all phases; track overall progress |
| `plans/resume-tracker-phase-1.plan.md` | Build or review **Phase 1 only** on `phase/1-tracker` |
| `plans/resume-tracker-phase-2.plan.md` | Build or review **Phase 2 only** on `phase/2-capture` |

Per-phase files have their own YAML `todos` (that phase's tasks only). Todos are **checkboxes**, not radio buttons — to work on a single phase, open that phase's `.plan.md` in Plan Mode.

## Branch strategy

Each implementation phase maps to its own git branch for review. Branches merge into `main` in order after the phase passes automated and manual tests.

| Phase | Branch | Base branch | Spec | Plan file |
|---|---|---|---|---|
| 1 — Tracker CRUD | `phase/1-tracker` | `main` | `resume-tracker-phase-1.spec.md` | `plans/resume-tracker-phase-1.plan.md` (**complete**) |
| 2 — Improvements | TBD | `main` | *future spec* | TBD |
| 3 — Capture | `phase/2-capture` | `main` (after improvements) | `resume-tracker-capture.spec.md` | `plans/resume-tracker-phase-2.plan.md` |

**Phase independence rules:**

- Each phase owns a bounded set of layers and files (see **Phase boundary** per phase).
- Later phases depend only on **stable contracts** from earlier phases (public types, service methods, message shapes)—not internal implementation details.
- A fix in phase N should change only files owned by phase N (or shared contracts defined up to phase N). It must not require edits to files introduced in phase N+1 or later.
- If testing phase 2 reveals a bug in phase 1: fix on `phase/1-tracker` (or a patch branch off it), merge to `main`, then rebase `phase/2-capture` onto updated `main`. Later-phase-only code stays untouched.

## Prerequisites

- [x] Spec Phase 1 exists and is complete at `specs/resume-tracker-phase-1.spec.md`
- [ ] Node.js available for Vite/TypeScript build in `extension/`
- [ ] Chrome available to load unpacked extension from `chrome://extensions`

## Feature flags

**Use feature flag:** No

- Feature ships without an environment flag; all phases are testable with default config.

## Data migration

**Migration required:** No

- Greenfield repo (git only); no existing user data or prior schema.
- T2 creates IndexedDB from scratch. Include both the applications store and a resume-blob store (or equivalent) in **schema version 1** so T5 implements `ResumeRepository` against an already-defined store and does not need an IndexedDB version bump.
- No one-off scripts.

**Verification after migration:** N/A (no existing records). Fresh install: empty tracker; after T5, empty resume library until upload.

## Phase 1 — Tracker CRUD

**Outcome:** Open the tracker via the popup, add/edit/delete application rows by hand, and see data persist across reloads.

**Branch:** `phase/1-tracker`  
**Spec tasks:** T1, T2, T3, T4  
**Plan file:** `plans/resume-tracker-phase-1.plan.md`  
**Shippable:** Yes — replaces Notion/spreadsheet for manual tracking; capture is not required.

**Phase boundary:**

- **Layers touched:** Extension runtime (scaffold + popup registration), Domain, Infrastructure, Repository (applications + resume stub), Service (`ApplicationService`), Hooks, UI (tracker + popup shell)
- **Files owned by this phase:** `extension/package.json`, `extension/manifest.json`, `extension/vite.config.ts`, `extension/README.md`, `extension/src/background/service-worker.ts`, `extension/src/domain/**`, `extension/src/storage/**`, `extension/src/application/services/application.service.ts`, `extension/src/tracker/**`, `extension/src/popup/**` (open-tracker only)
- **Contract for later phases:** Domain types (`Application`, `Resume`, `ApplicationStatus`); IndexedDB schema v1 including resume store; `ApplicationRepository` CRUD; `ResumeRepository` interface stub; `ApplicationService` list/create/update/delete with defaults (`Applied`, `appliedAt`/`lastUpdated`); tracker page URL; popup can open tracker

**Migration (this phase):** Not required — greenfield IndexedDB create in T2 (see **Data migration**).

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `7c4a3e2b-9f18-4d5a-a1c8-2e6b0d9f4a11` | T1 | pending |
| `a91d6c3e-4b27-4f80-8e15-3c7a9d2e5b40` | T2 | pending |
| `b2e8f1a4-6c39-4a71-9d02-5f8b3c1e7a56` | T3 | pending |
| `c3f9a2b5-7d4a-4b82-ae13-6a9c4d0f8b67` | T4 | pending |

Update `status` in YAML frontmatter (`pending` | `in-progress` | `completed` | `error`) as work progresses. Cursor Plan Mode reads frontmatter, not markdown checkboxes below.

### Execution order

#### Session: T1 — Extension scaffold (tracker-only)

**Todo id:** `7c4a3e2b-9f18-4d5a-a1c8-2e6b0d9f4a11`  
**Spec ref:** T1  
**Layers:** Extension runtime (+), UI (+ shell only)  
**Depends on:** —  
**Focus:**

- Vite + TypeScript MV3 scaffold; tracker HTML entry; service worker stub
- Manifest: tracker page + SW only (popup/content omitted or stubbed)
- README: load unpacked and open tracker

**Verify (from spec):** Manual: `npm run build`, load unpacked in `chrome://extensions`, tracker page opens without errors

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

#### Session: T2 — Domain, infrastructure, and repositories

**Todo id:** `a91d6c3e-4b27-4f80-8e15-3c7a9d2e5b40`  
**Spec ref:** T2  
**Layers:** Domain (+), Infrastructure (+), Repository (+)  
**Depends on:** T1  
**Focus:**

- Domain: `Application`, `Resume`, `ApplicationStatus` (six English values)
- IndexedDB schema v1: applications store + resume store placeholder
- `ApplicationRepository` CRUD; stub `ResumeRepository` interface

**Verify (from spec):** Manual: create/read/update/delete a test application via temporary debug hook or unit test

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

#### Session: T3 — Application service and React tracker (Phase 1 — manual use)

**Todo id:** `b2e8f1a4-6c39-4a71-9d02-5f8b3c1e7a56`  
**Spec ref:** T3  
**Layers:** Service (+), Hooks (+), UI (+)  
**Depends on:** T2  
**Focus:**

- `ApplicationService`: create defaults (`Applied` + dates), update, delete, list
- Tracker table (all English columns), inline edit, add/delete, empty state
- Hooks → Service only (no Repository from UI)

**Verify (from spec):** Manual: open tracker, add a row, fill fields, reload page—data persists; change status, delete a row

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

#### Session: T4 — Popup shell and tracker entry point

**Todo id:** `c3f9a2b5-7d4a-4b82-ae13-6a9c4d0f8b67`  
**Spec ref:** T4  
**Layers:** UI (+), Extension runtime (~)  
**Depends on:** T1, T3  
**Focus:**

- Register popup in manifest
- Button to open tracker page; no resume or capture logic

**Verify (from spec):** Manual: click extension icon → "Open tracker" → tracker loads

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

### Automated tests

Commands to run before opening a PR for this phase (add scripts in T1; tests in T2/T3):

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] `ApplicationRepository` CRUD (create/read/update/delete)
- [ ] `ApplicationService` defaults: status `Applied`, `appliedAt`/`lastUpdated` on create
- [ ] Domain status enum covers all six values
- [ ] Add test paths when created, e.g. `extension/src/storage/repositories/application.repository.test.ts`, `extension/src/application/services/application.service.test.ts`

If no test runner exists yet, add a minimal one in T1/T2 (Vitest aligned with Vite) before merge.

### Manual tests

Step-by-step checks on the phase branch before merge:

1. `cd extension && npm run build`; load unpacked from the build output in `chrome://extensions`
2. Open tracker page → empty state shown
3. Add a row → fill columns including status dropdown (all six English values) → reload tracker → row persists
4. Edit fields (e.g. Salary, Notes) → reload → values persist
5. Delete a row → gone after reload
6. Click extension icon → "Open tracker" → tracker loads
7. Confirm tracker components call Service/Hooks only (no Repository imports in UI)

**Regression scope for this phase:** N/A

### Phase milestone

- [ ] All spec tasks for this phase complete (T1–T4)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (if **Migration (this phase)** is Required)
- [ ] Feature flag behavior verified (if **Use feature flag** is Yes and this phase is gated)
- [ ] Automated tests pass (see above)
- [ ] Manual tests pass (see above)
- [ ] Spec **Done** Phase 1 checklist satisfied
- [ ] PR from `phase/1-tracker` → `main` reviewed and merged

---

## Phase 2 — Resume capture

**Outcome:** Upload EN/PT-BR PDFs, inject a resume into job-site file inputs, and confirm-save a tracker row (or save the current tab from the popup).

**Branch:** `phase/2-capture`  
**Spec tasks:** T5, T6, T7, T8  
**Plan file:** `plans/resume-tracker-phase-2.plan.md`  
**Shippable:** Yes — Phase 2 **Done** checklist in the spec

**Phase boundary:**

- **Layers touched:** Repository (resume impl), Service (`ResumeService`, `captureFromTab`), UI (popup resume library + save tab), Extension runtime (content scripts, messaging, badge)
- **Files owned by this phase:** `extension/src/storage/repositories/resume.repository.ts`, `extension/src/application/services/resume.service.ts`, `extension/src/application/services/application.service.ts` (`captureFromTab` only plus needed defaults), `extension/src/popup/components/**`, `extension/src/popup/App.tsx` (resume + save + errors), `extension/src/content/**`, `extension/src/background/messages.ts`, `extension/src/background/service-worker.ts`, `extension/manifest.json` (content scripts + host permissions), `extension/README.md`
- **Contract for later phases:** `ResumeService` upload/replace/get; `ApplicationService.captureFromTab()`; message types for arm/save; content-script behavior (picker + confirm toast). No follow-on phases in this spec.

**Migration (this phase):** Not required — resume store already in schema v1 from T2; T5 implements blob CRUD only.

### Todo IDs (sync with frontmatter)

| Todo ID | Spec task | Status |
|---|---|---|
| `d4a0b3c6-8e5b-4c93-bf24-7b0d5e1a9c78` | T5 | pending |
| `e5b1c4d7-9f6c-4d04-8035-8c1e6f2b0d89` | T6 | pending |
| `f6c2d5e8-0a7d-4e15-9146-9d2f7a3c1e90` | T7 | pending |
| `07d3e6f9-1b8e-4f26-a257-0e3a8b4d2f01` | T8 | pending |

### Execution order

#### Session: T5 — Resume library (EN / PT-BR)

**Todo id:** `d4a0b3c6-8e5b-4c93-bf24-7b0d5e1a9c78`  
**Spec ref:** T5  
**Layers:** Repository (+), Service (+), UI (+)  
**Depends on:** Phase 1 merge (T2 stub, T4 popup)  
**Focus:**

- Implement `ResumeRepository` PDF blob store
- `ResumeService` upload, replace, get by `en` / `pt-br`
- Popup upload + preview

**Verify (from spec):** Manual: upload two PDFs, reload extension, both resumes still available

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

#### Session: T6 — File-input overlay and PDF injection

**Todo id:** `e5b1c4d7-9f6c-4d04-8035-8c1e6f2b0d89`  
**Spec ref:** T6  
**Layers:** Extension runtime (+), Service (read-only)  
**Depends on:** T5  
**Focus:**

- Content script on `http(s)://*`: file-input overlay, EN/PT-BR picker, `DataTransfer` inject
- Background messaging; mark tab armed
- Manifest permissions for content scripts

**Verify (from spec):** Manual: on a page with `<input type="file">`, picker appears, selecting EN/PT-BR fills the input with the stored PDF

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

#### Session: T7 — Save application flow

**Todo id:** `f6c2d5e8-0a7d-4e15-9146-9d2f7a3c1e90`  
**Spec ref:** T7  
**Layers:** Extension runtime (+), Service (+), UI (+)  
**Depends on:** T3, T6  
**Focus:**

- `ApplicationService.captureFromTab()`: `appliedAt`, `lastUpdated`, `resumeId`, `jobUrl`, status `Applied`
- Confirm toast on apply-like actions when armed; no silent save; no save on file attach alone
- Popup "Save this tab" without arming (LinkedIn)

**Verify (from spec):** Manual: arm tab with resume → submit-like action → confirm → new row in tracker; popup "Save this tab" on LinkedIn job page creates row with URL

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

#### Session: T8 — End-to-end wiring and polish

**Todo id:** `07d3e6f9-1b8e-4f26-a257-0e3a8b4d2f01`  
**Spec ref:** T8  
**Layers:** Extension runtime (~), UI (~), Service (~)  
**Depends on:** T5–T7  
**Focus:**

- Armed-tab badge/indicator; error toasts (storage failure, PDF missing)
- `npm run dev` watch; remove T2 debug hooks if still present; README matches flow

**Verify (from spec):** Manual: full Phase 2 flow from upload resumes → apply on external site → save → edit in tracker; README steps match behavior

**Done when:** [ ] Verify passes; [ ] changes limited to phase boundary; [ ] todo status → `completed`; [ ] safe to commit on phase branch

### Automated tests

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] `ResumeService` / `ResumeRepository` store and retrieve blobs by `en` and `pt-br`
- [ ] `ApplicationService.captureFromTab()` sets required capture fields and default `Applied`
- [ ] Capture does not persist without confirmation (service/message-level if testable without DOM)
- [ ] Phase 1 service/repository tests still pass

### Manual tests

1. Enable Phase 2 content scripts via rebuilt unpacked extension (no feature flag)
2. Upload EN and PT-BR PDFs in popup; reload extension; both still available
3. On a page with `<input type="file">`, picker injects the chosen PDF
4. Armed apply-like submit → toast "Save to tracker?" → confirm → tracker row with URL, resume label, Applied, today's date
5. File attach alone does not create a row
6. LinkedIn job view → popup "Save this tab" → row with job URL (resume may be empty)
7. Edit Status to HR Interview, add Salary and Notes → reload → persist
8. Restart browser: tracker, resume library, and capture still work

**Regression scope for this phase:** Phase 1 behavior must still pass (run Phase 1 manual tests).

### Phase milestone

- [ ] All spec tasks for this phase complete (T5–T8)
- [ ] All phase todos in YAML frontmatter are `completed`
- [ ] Migration for this phase verified (if **Migration (this phase)** is Required)
- [ ] Feature flag behavior verified (if **Use feature flag** is Yes and this phase is gated)
- [ ] Automated tests pass
- [ ] Manual tests pass
- [ ] Phase 1 regression checks pass
- [ ] Spec **Done** Phase 2 checklist satisfied
- [ ] PR from `phase/2-capture` → `main` reviewed and merged

---

## Dependencies

| Task / Phase | Blocked by | Notes |
|---|---|---|
| Phase 2 | Phase 1 merge | Uses Domain types, schema v1, `ApplicationService`, popup shell |
| T2 | T1 | Needs extension/build scaffold |
| T3 | T2 | Service and tracker need Repository + Domain |
| T4 | T1, T3 | Popup opens tracker page from T1/T3 |
| T5 | T2, T4 | Resume store + popup shell |
| T6 | T5 | Injection reads stored PDFs via Service |
| T7 | T3, T6 | Capture writes via `ApplicationService`; arming from T6 |
| T8 | T5–T7 | Polish after capture path exists |

## Risks and notes

- Content-script `DataTransfer` injection and apply detection will vary by ATS (Lever/Ashby/Inhire are best-effort; LinkedIn Easy Apply is popup-only). Keep T6/T7 scoped to spec Musts, not extra scraping.
- Do not save on file attach; confirm toast or "Save this tab" only.
- Layering: UI/hooks/content must not call Repository; Service must not import React/DOM.
- If T2 omits the resume object store, T5 would need an IndexedDB version bump (treat as a phase-2 migration). Avoid that by defining the store in v1.
- Cursor Plan Mode todo sync: update YAML `todos[].status` in both master and phase plan files when a task completes; keep todo `id` values stable when regenerating this plan
- Validate YAML frontmatter after Plan Mode edits (known corruption risk)

## Progress

Track via YAML frontmatter `todos[].status` (source of truth for Plan Mode). Summary:

| Phase | Plan file | Tasks | Done |
|---|---|---|---|
| 1 — Tracker CRUD | `plans/resume-tracker-phase-1.plan.md` | T1–T4 | 0 / 4 |
| 2 — Resume capture | `plans/resume-tracker-phase-2.plan.md` | T5–T8 | 0 / 4 |
