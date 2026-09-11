---
name: "Resume Tracker Improvements — Phase 2: Table UX"
overview: "Ship sortable inline-edit table with per-row stages, status options, job-title combobox, and date next-step."
todos:
  - id: "5b0c3e40-1d6f-4013-a8e2-3f4a5b6c7d8e"
    content: "T3: Settings vocabulary (job titles, stack tags)"
    status: pending
  - id: "6c1d4f51-2e70-4124-b9f3-4a5b6c7d8e9f"
    content: "T4: Table shell — column order, sort, row colors, inline edit, keyboard"
    status: pending
  - id: "7d2e5062-3f81-4235-8a04-5b6c7d8e9f0a"
    content: "T5: Stages, status, job title combobox, next step date"
    status: pending
isProject: false
---

# Resume Tracker Improvements — Phase 2

**Spec:** [`specs/resume-tracker-improvements.spec.md`](../specs/resume-tracker-improvements.spec.md)  
Full context: [`plans/resume-tracker-improvements.plan.md`](resume-tracker-improvements.plan.md)

**Branch:** `phase/2-table-ux` (base: `phase/1-schema-v2`, already pushed; do **not** merge to `main` yet)  
**Spec tasks:** T3–T5  
**Shippable:** No — keep Stack/Contact/Rating/Match/notes in the table until Phase 3 T6 adds the drawer

**Phase boundary:** Settings vocabulary repository + service methods; table shell (sort, inline edit, keyboard, row colors); stages/status/job-title/next-step cells. Do not add the detail drawer, rejection dialog, or capture.

**Migration (this phase):** Not required — uses `settings` store from Phase 1

## Execution order

#### Session: T3 — Settings vocabulary (job titles, stack tags)

**Todo id:** `5b0c3e40-1d6f-4013-a8e2-3f4a5b6c7d8e`  
**Depends on:** T1 (on `phase/1-schema-v2`)  
**Focus:** Settings repository; list/add job-title and stack-tag suggestions via Service.

**Verify:** Create a new job title; it is available as a suggestion (full combobox in T5; service/unit test acceptable until then)

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-table-ux`

#### Session: T4 — Table shell — column order, sort, row colors, inline edit, keyboard

**Todo id:** `6c1d4f51-2e70-4124-b9f3-4a5b6c7d8e9f`  
**Depends on:** T2  
**Focus:** Spec column order for the main table; default sort `lastUpdated` desc; soft inline edit; Tab/Enter; row color classes. Do not drop drawer-only columns yet.

**Verify:** Sort columns; Tab through a row; colors match status; soft edit UX

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-table-ux`

#### Session: T5 — Stages, status, job title combobox, next step date

**Todo id:** `7d2e5062-3f81-4235-8a04-5b6c7d8e9f0a`  
**Depends on:** T3, T4  
**Focus:** Stages chips (type+Enter); status = terminals ∪ row stages via Service; job-title combobox; next-step and last-updated dates.

**Verify:** New row has four default stages; custom stage updates status list; next step stores a date

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/2-table-ux`

## Automated tests

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] Vocabulary list/add tests
- [ ] Phase 1 service/repository tests still pass

## Manual tests

1. Default sort lastUpdated descending; other headers sortable.
2. Tab saves and moves; Enter saves and keeps focus; light edit borders.
3. Rejected red; Applied neutral; Offer or stage names green.
4. Default stages on create; custom stage; job-title suggestions persist; next step is a date.

**Regression scope for this phase:** Phase 1 CRUD and v1→v2 migration checks must still pass.

## Phase milestone

- [ ] T3–T5 complete; YAML todos `completed`
- [ ] Automated and manual tests pass
- [ ] Phase 1 regression checks pass
- [ ] Branch pushed; merge to `main` deferred until Phase 3
