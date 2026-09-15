import type { TimelineEntry } from "../../domain/timeline";
import {
  chronologicalTimeline,
  formatDisplayDate,
} from "../applicationView";

type TimelineListProps = {
  entries: TimelineEntry[];
};

export function TimelineList({ entries }: TimelineListProps) {
  const ordered = chronologicalTimeline(entries);

  if (ordered.length === 0) {
    return <p className="muted">No timeline entries yet.</p>;
  }

  return (
    <ol className="timeline-list">
      {ordered.map((entry) => (
        <li
          key={entry.id}
          className={`timeline-item timeline-${entry.kind}`}
        >
          <span className="timeline-date">
            {entry.kind === "rejection_reason"
              ? ""
              : formatDisplayDate(entry.at)}
          </span>
          <span className="timeline-sep" aria-hidden>
            —
          </span>
          <span className="timeline-text">{entry.text}</span>
        </li>
      ))}
    </ol>
  );
}
