# Resume Tracker — Capture (Resume library + apply flow)

**Status:** Planned — implement after tracker improvements (future spec)  
**Depends on:** `specs/resume-tracker-phase-1.spec.md` (complete)  
**Plan:** `plans/resume-tracker-phase-2.plan.md` (update when ready to build)  
**Branch:** `phase/2-capture` (base: `main` after Phase 1 + improvements)

## Why

Phase 1 requires manual entry for every application. Capture reduces friction by storing EN/PT-BR PDF resumes, injecting them on job-site file inputs, and confirm-saving a new row when you apply.

## What

Extend the existing extension with: (1) resume library in the popup, (2) file-input overlay on job sites, (3) confirm-to-save on apply, (4) popup "Save this tab" for LinkedIn. Done when applying on a job site can seed a tracker row with resume + job URL + status Applied.

## Context

**Relevant files:**

Phase 1 codebase plus files to create or extend:

- `extension/src/storage/repositories/resume.repository.ts` — PDF blob CRUD (extend stub)
- `extension/src/application/services/resume.service.ts` — upload, replace, get by id
- `extension/src/application/services/application.service.ts` — add `captureFromTab()`
- `extension/src/popup/components/ResumeLibrary.tsx` — EN / PT-BR upload
- `extension/src/popup/components/SaveTabButton.tsx` — manual save current tab
- `extension/src/content/file-input.ts` — overlay + PDF injection
- `extension/src/content/save-prompt.ts` — confirm toast
- `extension/src/content/apply-detection.ts` — apply-like click / submit detection
- `extension/src/content/overlay.css`
- `extension/src/background/messages.ts` — message routing to services
- `extension/manifest.json` — content scripts, host permissions

**Architecture:**

Same layers as Phase 1 (`specs/resume-tracker-phase-1.spec.md`). Capture adds **Extension runtime** (content scripts, messaging) and extends **Service**, **Repository**, **UI**.

**Dependency rules:**

- Extension runtime calls Service via messages — not Repository
- Phase 1 tracker CRUD unchanged except `ApplicationService.captureFromTab()`
- Do not rewrite Phase 1 tracker UI except popup additions

**Patterns to follow:**

- Layering from Phase 1 spec
- English UI copy
- Confirm before writing a row — no silent auto-save

**Key decisions already made:**

- Two resume versions: EN and PT-BR PDFs in IndexedDB
- Row on capture defaults: `status` Applied, `appliedAt`, `lastUpdated`, `jobUrl`, optional `resumeId`
- LinkedIn Easy Apply: manual "Save this tab" only
- Generic file-input overlay + Lever/Ashby/Inhire where possible
- No form autofill beyond resume file injection
- No Gmail parsing, no Google Sheet sync

**Capture row minimum fields:** `appliedAt`, `lastUpdated`, `resumeId`, `jobUrl`, `status` = Applied; other columns empty

## Constraints

**Must:**

- Reuse Phase 1 IndexedDB schema v1 resume store (or migrate if improvements changed schema)
- Require user confirmation before creating a row from a job site
- Popup "Save this tab" without prior file inject (LinkedIn)
- Content script: EN/PT-BR picker on `input[type=file]`, inject via `DataTransfer`

**Must not:**

- Autofill application form fields (name, LinkedIn, etc.)
- Save a row on file attach alone
- Break Phase 1 manual tracker behavior

**Out of scope:**

- Automated LinkedIn Easy Apply
- ATS field scraping (optional nice-to-have only)
- Duplicate detection
- Job description snapshots
- Chrome Web Store publishing

## Tasks

### T1: Resume library (EN / PT-BR)

**Layers:** Repository (+), Service (+), UI (+)

**Do:** Implement `ResumeRepository` blob storage. `ResumeService` upload/replace/get. Popup UI for two labeled resumes.

**Files:** `extension/src/storage/repositories/resume.repository.ts`, `extension/src/application/services/resume.service.ts`, `extension/src/popup/components/ResumeLibrary.tsx`

**Verify:** Upload two PDFs, reload extension, both remain

### T2: File-input overlay and PDF injection

**Layers:** Extension runtime (+), Service (read-only)

**Do:** Content script on `http(s)://*`: file-input overlay, fetch PDF via service, `DataTransfer` inject, arm tab via background messaging.

**Files:** `extension/src/content/file-input.ts`, `extension/src/content/overlay.css`, `extension/src/background/messages.ts`, `extension/manifest.json`

**Verify:** Picker on file input; EN/PT-BR fills stored PDF

### T3: Save application flow

**Layers:** Extension runtime (+), Service (+), UI (+)

**Do:** `ApplicationService.captureFromTab()`. Confirm toast on apply. Popup "Save this tab". Background routes messages.

**Files:** `extension/src/application/services/application.service.ts`, `extension/src/content/save-prompt.ts`, `extension/src/content/apply-detection.ts`, `extension/src/popup/components/SaveTabButton.tsx`, `extension/src/background/`

**Verify:** Armed tab → confirm → row in tracker; LinkedIn manual save creates row with URL

### T4: End-to-end wiring and polish

**Layers:** Extension runtime (~), UI (~), Service (~)

**Do:** Tab armed indicator, error toasts, `npm run dev`, README update, remove debug hooks.

**Files:** `extension/src/popup/App.tsx`, `extension/src/background/service-worker.ts`, `extension/README.md`

**Verify:** Full capture flow; Phase 1 tracker still works

## Done

- [ ] Manual: upload EN and PT-BR PDFs, inject on file input, confirm save, row has URL + resume + Applied + today's date
- [ ] Manual: LinkedIn job view → "Save this tab" → row with job URL
- [ ] Manual: Phase 1 tracker CRUD still works after browser restart
- [ ] `npm test && npm run build` in `extension/` pass
