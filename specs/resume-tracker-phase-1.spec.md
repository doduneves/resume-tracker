# Resume Tracker — Phase 1 (Tracker CRUD)

**Status:** Complete  
**Spec:** `specs/resume-tracker-phase-1.spec.md`  
**Plan:** `plans/resume-tracker-phase-1.plan.md`  
**Branch:** `phase/1-tracker` (merged or ready to merge)

## Why

Job applications are tracked manually in spreadsheets and Notion. Phase 1 replaces that with a local Chrome extension tracker: add, edit, and delete application rows by hand with data that persists across reloads.

## What

A Manifest V3 Chrome extension with a React tracker page and popup entry point. Done when you can open the tracker, manage applications manually, and all edits persist in IndexedDB.

## Context

**Relevant files:**

- `extension/manifest.json` — MV3 manifest, service worker, tracker and popup entries
- `extension/src/background/service-worker.ts` — service worker stub
- `extension/src/domain/` — `Application`, `Resume`, `ApplicationStatus`
- `extension/src/storage/db.ts` — IndexedDB schema v1 (applications + resume store placeholder)
- `extension/src/storage/repositories/application.repository.ts` — application CRUD
- `extension/src/storage/repositories/resume.repository.ts` — stub for later capture work
- `extension/src/application/services/application.service.ts` — create/update/delete/list with defaults
- `extension/src/tracker/` — React tracker (table, hooks, add/delete)
- `extension/src/popup/` — popup with "Open tracker"
- `extension/README.md` — load unpacked instructions

**Architecture:**

| Layer | Location | Responsibility | Depends on |
|---|---|---|---|
| Domain | `extension/src/domain/` | Types, status enum | — |
| Infrastructure | `extension/src/storage/db.ts` | IndexedDB open, schema v1 | Domain |
| Repository | `extension/src/storage/repositories/` | Application CRUD; resume stub | Infrastructure, Domain |
| Service | `extension/src/application/services/` | Defaults, validation, orchestration | Repository, Domain |
| Hooks | `extension/src/tracker/hooks/` | React state for tracker | Service |
| UI | `extension/src/tracker/`, `extension/src/popup/` | Tracker table, popup shell | Hooks, Service |
| Extension runtime | `extension/src/background/` | MV3 service worker | — |

**Dependency rules:**

- UI → Hooks → Service → Repository → Infrastructure
- Domain imports nothing from other layers
- Service must not import React

**Patterns to follow:**

- TypeScript, MV3, IndexedDB inside extension origin
- All UI labels and status values in English
- Layering rules above apply to all code in this phase

**Key decisions already made:**

- Chrome extension, local-only, single user
- React for tracker page and popup only
- Manual CRUD only — no content scripts, no resume upload UI, no capture
- Default status `Applied` on new rows; `appliedAt` and `lastUpdated` set on create
- Notion column schema (English); see table below

Reference workflow: [Notion Processos Seletivos](https://app.notion.com/p/1f9eea5bd44980eb85bbf4807e7039bf?v=1f9eea5bd449806185ad000caf5acf3b)

**Application columns (English):**

| Field | Type / notes |
|---|---|
| `company` | string |
| `status` | enum (see below) |
| `jobTitle` | string |
| `nextStep` | string |
| `lastUpdated` | date |
| `salary` | string |
| `rating` | number \| null |
| `matchLevel` | string |
| `stack` | string |
| `jobUrl` | string |
| `resumeId` | `en` \| `pt-br` \| null |
| `stages` | string |
| `contact` | string |
| `notes` | string |
| `appliedAt` | date (set on create) |

**Status values:** `Applied`, `Screening`, `HR Interview`, `Technical Interview`, `Offer`, `Rejected`

**Contract for later work:**

- `ApplicationService`: `list`, `create`, `update`, `delete`
- `ApplicationRepository` CRUD on IndexedDB applications store
- Stub `ResumeRepository` and resume store in schema v1
- Popup opens tracker only — no capture or resume library yet

## Constraints

**Must:**

- Store application data locally in IndexedDB
- Open tracker as extension page (`chrome-extension://…`)
- Manual add, edit, delete of all columns
- Follow layer dependency rules
- Support all six status values

**Must not:**

- Content scripts on job sites
- Resume PDF upload UI
- Auto-save from job application forms
- Cloud sync or Notion API
- Portuguese UI labels
- UI calling Repository directly

**Out of scope:**

- Kanban view
- Capture, file-input overlay, "Save this tab"
- Google Sheet / Notion import

## Tasks

### T1: Extension scaffold (tracker-only)

**Layers:** Extension runtime (+), UI (+ shell only)

**Do:** Initialize extension (TypeScript, Vite). MV3 manifest with service worker and tracker page. Document load unpacked.

**Files:** `extension/package.json`, `extension/manifest.json`, `extension/vite.config.ts`, `extension/src/background/service-worker.ts`, `extension/src/tracker/index.html`, `extension/README.md`

**Verify:** `npm run build`, load unpacked, tracker page opens

### T2: Domain, infrastructure, and repositories

**Layers:** Domain (+), Infrastructure (+), Repository (+)

**Do:** Domain types and status enum. IndexedDB v1. `ApplicationRepository` CRUD. Stub `ResumeRepository`.

**Files:** `extension/src/domain/`, `extension/src/storage/db.ts`, `extension/src/storage/repositories/`

**Verify:** CRUD test application via unit test

### T3: Application service and React tracker

**Layers:** Service (+), Hooks (+), UI (+)

**Do:** `ApplicationService` with defaults. React table, inline edit, add/delete, empty state.

**Files:** `extension/src/application/services/application.service.ts`, `extension/src/tracker/`

**Verify:** Add row, reload, data persists; delete row

### T4: Popup shell and tracker entry point

**Layers:** UI (+), Extension runtime (~)

**Do:** Popup with "Open tracker" button. Register popup in manifest.

**Files:** `extension/src/popup/`, `extension/manifest.json`

**Verify:** Extension icon → Open tracker → tracker loads

## Done

- [x] `npm run build` in `extension/` completes without errors
- [x] Manual: open tracker via popup, add applications, edit all columns, delete a row
- [x] Manual: reload tracker and browser — data persists
- [x] Manual: status dropdown shows all six English values
- [x] Manual: tracker UI uses Service/Hooks only (no direct Repository calls from components)
