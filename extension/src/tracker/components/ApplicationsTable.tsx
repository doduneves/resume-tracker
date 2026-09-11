import type { ChangeEvent } from "react";
import type { Application } from "../../domain/application";
import type { ResumeId } from "../../domain/resume";
import { DEFAULT_STAGES, TERMINAL_STATUSES } from "../../domain/status";
import { createTimelineEntry } from "../../domain/timeline";
import { todayIsoDate } from "../../application/services/dates";

type TableField =
  | "company"
  | "status"
  | "jobTitle"
  | "nextStep"
  | "lastUpdated"
  | "salary"
  | "rating"
  | "matchLevel"
  | "stack"
  | "jobUrl"
  | "resumeId"
  | "stages"
  | "contact"
  | "notes";

const COLUMNS: { key: TableField; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "status", label: "Status" },
  { key: "jobTitle", label: "Job Title" },
  { key: "nextStep", label: "Next Step" },
  { key: "lastUpdated", label: "Last Updated" },
  { key: "salary", label: "Salary" },
  { key: "rating", label: "Rating" },
  { key: "matchLevel", label: "Match Level" },
  { key: "stack", label: "Stack" },
  { key: "jobUrl", label: "Job URL" },
  { key: "resumeId", label: "Resume" },
  { key: "stages", label: "Stages" },
  { key: "contact", label: "Contact" },
  { key: "notes", label: "Notes" },
];

type ApplicationsTableProps = {
  applications: Application[];
  loading: boolean;
  remove: (id: string) => Promise<void> | void;
  update: (application: Application) => Promise<void> | void;
};

export function ApplicationsTable({
  applications,
  loading,
  remove,
  update,
}: ApplicationsTableProps) {
  if (loading) {
    return <p className="muted">Loading applications…</p>;
  }

  if (applications.length === 0) {
    return (
      <p className="empty-state">
        No applications yet. Add a row to start tracking.
      </p>
    );
  }

  function patch(row: Application, field: TableField, value: string) {
    const next: Application = { ...row, timeline: [...row.timeline] };
    if (field === "status") {
      next.status = value;
    } else if (field === "rating") {
      next.rating = value === "" ? null : Number(value);
    } else if (field === "resumeId") {
      next.resumeId = (value === "" ? null : value) as ResumeId | null;
    } else if (field === "stages") {
      next.stages = splitList(value);
    } else if (field === "stack") {
      next.stack = splitList(value);
    } else if (field === "notes") {
      next.timeline = timelineWithNotes(row.timeline, value);
    } else {
      next[field] = value;
    }
    if (field !== "lastUpdated") {
      next.lastUpdated = todayIsoDate();
    }
    void update(next);
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((row) => (
            <tr key={row.id}>
              {COLUMNS.map((column) => (
                <td key={column.key}>
                  <Field
                    row={row}
                    field={column.key}
                    onChange={(value) => patch(row, column.key, value)}
                  />
                </td>
              ))}
              <td>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void remove(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({
  row,
  field,
  onChange,
}: {
  row: Application;
  field: TableField;
  onChange: (value: string) => void;
}) {
  const handle = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => onChange(event.target.value);

  if (field === "status") {
    return (
      <select value={row.status} onChange={handle} aria-label="Status">
        {statusOptionsFor(row).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    );
  }

  if (field === "resumeId") {
    return (
      <select
        value={row.resumeId ?? ""}
        onChange={handle}
        aria-label="Resume"
      >
        <option value="">None</option>
        <option value="en">EN</option>
        <option value="pt-br">PT-BR</option>
      </select>
    );
  }

  if (field === "lastUpdated") {
    return (
      <input
        type="date"
        value={row.lastUpdated}
        onChange={handle}
        aria-label="Last Updated"
      />
    );
  }

  if (field === "rating") {
    return (
      <input
        type="number"
        min={1}
        max={5}
        value={row.rating ?? ""}
        onChange={handle}
        aria-label="Rating"
      />
    );
  }

  if (field === "jobUrl") {
    return (
      <input
        type="url"
        value={row.jobUrl}
        onChange={handle}
        aria-label="Job URL"
      />
    );
  }

  if (field === "notes") {
    return (
      <textarea
        rows={2}
        value={notesText(row)}
        onChange={handle}
        aria-label="Notes"
      />
    );
  }

  if (field === "stages" || field === "stack") {
    return (
      <input
        type="text"
        value={row[field].join(", ")}
        onChange={handle}
        aria-label={field}
      />
    );
  }

  return (
    <input
      type="text"
      value={row[field]}
      onChange={handle}
      aria-label={field}
    />
  );
}

function statusOptionsFor(row: Application): string[] {
  const seen = new Set<string>();
  const options: string[] = [];
  for (const value of [
    ...TERMINAL_STATUSES,
    ...DEFAULT_STAGES,
    ...row.stages,
    row.status,
  ]) {
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    options.push(value);
  }
  return options;
}

function splitList(value: string): string[] {
  return value.split(",").map((part) => part.trim()).filter(Boolean);
}

function notesText(row: Application): string {
  return row.timeline
    .filter((entry) => entry.kind === "note")
    .map((entry) => entry.text)
    .join("\n");
}

function timelineWithNotes(
  timeline: Application["timeline"],
  text: string,
): Application["timeline"] {
  const rest = timeline.filter((entry) => entry.kind !== "note");
  if (text === "") {
    return rest;
  }
  const existing = timeline.find((entry) => entry.kind === "note");
  const note = existing
    ? { ...existing, text }
    : createTimelineEntry("note", text, todayIsoDate());
  return [...rest, note];
}
