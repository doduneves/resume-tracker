---
name: "Resume Tracker Improvements — Phase 3: Drawer and polish"
overview: "Add the left detail drawer, timeline UI, rejection dialog, action icons, and regression pass."
todos:
  - id: "8e3f6173-4092-4346-9b15-6c7d8e9f0a1b"
    content: "T6: Detail drawer, timeline UI, rejection dialog"
    status: pending
  - id: "9f407284-51a3-4457-ac26-7d8e9f0a1b2c"
    content: "T7: Actions icons, add row control, polish and regression tests"
    status: pending
isProject: false
---

# Resume Tracker Improvements — Phase 3

**Spec:** [`specs/resume-tracker-improvements.spec.md`](../specs/resume-tracker-improvements.spec.md)  
Full context: [`plans/resume-tracker-improvements.plan.md`](resume-tracker-improvements.plan.md)

**Branch:** `phase/3-drawer-polish` (base: `main` after Phase 2 merge)  
**Spec tasks:** T6–T7  
**Shippable:** Yes — tracker UX v2 complete; capture still out of scope

**Phase boundary:** Detail drawer, timeline list, rejection dialog, table action icons, add-row control, README, test/build polish. Move Stack/Contact/Rating/Match/notes out of the table. Do not add capture or content scripts.

**Migration (this phase):** Not required

## Execution order

#### Session: T6 — Detail drawer, timeline UI, rejection dialog

**Todo id:** `8e3f6173-4092-4346-9b15-6c7d8e9f0a1b`  
**Depends on:** T2, T4  
**Focus:** Left drawer; stack/contact/rating/match; chronological timeline; add note via Service; Rejected modal (reason optional); drawer tab order; remove those fields from the table.

**Verify:** Timeline example flow; note added; Rejected with and without reason; drawer fields persist

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/3-drawer-polish`

#### Session: T7 — Actions icons, add row control, polish and regression tests

**Todo id:** `9f407284-51a3-4457-ac26-7d8e9f0a1b2c`  
**Depends on:** T6  
**Focus:** Icon-only drawer/delete (confirm delete); Add row icon + “Add row”; README; full test/build pass.

**Verify:** `cd extension && npm test && npm run build`; add/edit/delete still persist across reload

**Done when:** [ ] Verify passes; [ ] todo status → `completed`; [ ] commit on `phase/3-drawer-polish`

## Automated tests

```bash
cd extension && npm test && npm run build
```

**Coverage for this phase:**

- [ ] Full suite green after fields move to the drawer
- [ ] Service note/reject tests still pass

## Manual tests

1. Drawer fields persist; timeline chronological; add note.
2. Rejected with empty reason vs with reason.
3. Final column order per spec; icon actions; Add row label.
4. Data survives extension reload / browser restart.

**Regression scope for this phase:** Phase 1 and Phase 2 manual tests must still pass.

## Phase milestone

- [ ] T6–T7 complete; YAML todos `completed`
- [ ] Automated and manual tests pass
- [ ] Phase 1–2 regression checks pass
- [ ] Spec **Done** checklist complete
- [ ] PR `phase/3-drawer-polish` → `main` merged
