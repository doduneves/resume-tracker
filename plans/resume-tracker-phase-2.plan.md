---
name: "Resume Tracker — Capture (Phase 3)"
overview: "Upload EN/PT-BR PDFs, inject them into job-site file inputs, and confirm-save application rows."
todos:
  - id: "d4a0b3c6-8e5b-4c93-bf24-7b0d5e1a9c78"
    content: "T1: Resume library (EN / PT-BR)"
    status: pending
  - id: "e5b1c4d7-9f6c-4d04-8035-8c1e6f2b0d89"
    content: "T2: File-input overlay and PDF injection"
    status: pending
  - id: "f6c2d5e8-0a7d-4e15-9146-9d2f7a3c1e90"
    content: "T3: Save application flow"
    status: pending
  - id: "07d3e6f9-1b8e-4f26-a257-0e3a8b4d2f01"
    content: "T4: End-to-end wiring and polish"
    status: pending
isProject: false
---

# Resume Tracker — Capture (Phase 3)

**Status:** On hold — implement after tracker improvements (Phase 2)  
**Spec:** [`specs/resume-tracker-capture.spec.md`](../specs/resume-tracker-capture.spec.md)  
Full context: [`plans/resume-tracker.plan.md`](resume-tracker.plan.md)

**Branch:** `phase/2-capture` (base: `main` after improvements merge)  
**Spec tasks:** T1–T4 (capture spec)  
**Shippable:** Yes — capture + resume library

**Phase boundary:** Resume repository/service, popup library and Save this tab, content scripts (overlay + save prompt + apply detection), background messages, badge/errors/README. Do not rewrite Phase 1 tracker CRUD except `captureFromTab` on `ApplicationService`.

**Migration (this phase):** Not required — use schema v1 resume store from T2.

## Execution order

#### Session: T1 — Resume library (EN / PT-BR)

**Todo id:** `d4a0b3c6-8e5b-4c93-bf24-7b0d5e1a9c78`  
**Depends on:** Phase 1 complete; tracker improvements merged  
**Focus:** Blob CRUD; upload/replace/get; popup preview for `en` and `pt-br`.

**Verify:** Upload two PDFs, reload extension, both remain

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-capture`

#### Session: T2 — File-input overlay and PDF injection

**Todo id:** `e5b1c4d7-9f6c-4d04-8035-8c1e6f2b0d89`  
**Depends on:** T1  
**Focus:** Content script overlay; DataTransfer inject; arm tab via background; manifest hosts.

**Verify:** File input picker fills stored PDF for EN/PT-BR

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-capture`

#### Session: T3 — Save application flow

**Todo id:** `f6c2d5e8-0a7d-4e15-9146-9d2f7a3c1e90`  
**Depends on:** Phase 1 tracker, T2  
**Focus:** `captureFromTab()` defaults; confirm toast when armed; popup Save this tab; no save on attach alone.

**Verify:** Armed submit → confirm → tracker row; LinkedIn Save this tab → URL row

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-capture`

#### Session: T4 — End-to-end wiring and polish

**Todo id:** `07d3e6f9-1b8e-4f26-a257-0e3a8b4d2f01`  
**Depends on:** T1–T3  
**Focus:** Armed badge; error toasts; `npm run dev`; remove debug hooks; README.

**Verify:** Upload → inject → save → edit in tracker; README matches

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-capture`

## Automated tests

```bash
cd extension && npm test && npm run build
```

- [ ] Resume store/retrieve by id
- [ ] `captureFromTab` field defaults
- [ ] Phase 1 tests still pass

## Manual tests

1. Rebuild unpacked (no feature flag)
2. Resume library persists; file-input inject works
3. Confirm toast creates row; attach-only does not
4. Save this tab on LinkedIn; edit in tracker; browser restart

**Regression:** Re-run Phase 1 manual tests.

## Phase milestone

- [ ] T1–T4 complete; YAML todos `completed`
- [ ] Spec capture **Done** checklist
- [ ] Phase 1 regression passes
- [ ] PR `phase/2-capture` → `main` merged
