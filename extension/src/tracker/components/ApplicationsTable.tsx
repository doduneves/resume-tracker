import type { ChangeEvent } from "react";
import type { Application } from "../../domain/application";
import type { ResumeId } from "../../domain/resume";
import { APPLICATION_STATUSES } from "../../domain/status";
import { todayIsoDate } from "../../application/services/dates";

const COLUMNS: { key: keyof Application; label: string }[] = [
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

  function patch(row: Application, field: keyof Application, value: string) {
    const next: Application = { ...row };
    if (field === "status") {
      next.status = value as Application["status"];
    } else if (field === "rating") {
      next.rating = value === "" ? null : Number(value);
    } else if (field === "resumeId") {
      next.resumeId = (value === "" ? null : value) as ResumeId | null;
    } else if (field === "id" || field === "appliedAt") {
      return;
    } else {
      next[field] = value as never;
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
  field: keyof Application;
  onChange: (value: string) => void;
}) {
  const handle = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => onChange(event.target.value);

  if (field === "id" || field === "appliedAt") {
    return null;
  }

  if (field === "status") {
    return (
      <select value={row.status} onChange={handle} aria-label="Status">
        {APPLICATION_STATUSES.map((status) => (
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
        value={row.notes}
        onChange={handle}
        aria-label="Notes"
      />
    );
  }

  const value = row[field];
  return (
    <input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={handle}
      aria-label={String(field)}
    />
  );
}
