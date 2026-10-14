# Resume Tracker — Spec index

The product spec is split into focused documents. **Phase 1 is complete.**

| Spec | Scope | Status |
|---|---|---|
| [`resume-tracker-phase-1.spec.md`](resume-tracker-phase-1.spec.md) | Manual tracker CRUD (T1–T4) | **Complete** |
| [`resume-tracker-improvements.spec.md`](resume-tracker-improvements.spec.md) | Tracker UX v2 (timeline, drawer, migration) | **Planned** |
| [`resume-tracker-capture.spec.md`](resume-tracker-capture.spec.md) | Resume library + apply capture (T1–T4) | Planned (Phase 3) |
| [`resume-tracker-shadcn.spec.md`](resume-tracker-shadcn.spec.md) | Tracker page shadcn/ui migration | Planned (not a phase gate) |

## Roadmap

1. **Phase 1 — Tracker CRUD** — done (`resume-tracker-phase-1.spec.md`)
2. **Phase 2 — Improvements** — `resume-tracker-improvements.spec.md` (implement before capture)
3. **Phase 3 — Capture** — `resume-tracker-capture.spec.md` after improvements land on `main`

`resume-tracker-shadcn.spec.md` restyles the tracker page only. It does not sit between Phase 2 and Phase 3, and capture content scripts stay off shadcn.

## Plans

| Plan | Spec |
|---|---|
| `plans/resume-tracker-phase-1.plan.md` | Phase 1 (closed) |
| *Phase 2 improvements plan* | Create via `/create-plan @specs/resume-tracker-improvements.spec.md` |
| `plans/resume-tracker-phase-2.plan.md` | Capture (Phase 3) — `resume-tracker-capture.spec.md` |
| `plans/resume-tracker.plan.md` | Master overview |
