import { useCallback, useEffect, useState } from "react";
import { todayIsoDate } from "../../application/services/dates";
import type { Application } from "../../domain/application";
import type { ResumeId } from "../../domain/resume";
import { statusOptionsFor } from "../../domain/status";
import { useVocabularyService } from "../hooks/VocabularyServiceContext";
import { isoDateValue, rowStatusClass } from "../applicationView";
import type { SortDirection, SortableField } from "../sortApplications";
import { InlineTextCell } from "./InlineTextCell";
import { DeleteIcon, DetailsIcon } from "./icons";
import { JobTitleCombobox } from "./JobTitleCombobox";
import { StagesCell } from "./StagesCell";

type TableField =
  | "company"
  | "jobTitle"
  | "status"
  | "stages"
  | "jobUrl"
  | "resumeId"
  | "nextStep"
  | "lastUpdated"
  | "salary";

const COLUMNS: { key: TableField; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "jobTitle", label: "Job Title" },
  { key: "status", label: "Status" },
  { key: "stages", label: "Stages" },
  { key: "jobUrl", label: "Job URL" },
  { key: "resumeId", label: "Resume" },
  { key: "nextStep", label: "Next step" },
  { key: "lastUpdated", label: "Last Updated" },
  { key: "salary", label: "Salary" },
];

type ApplicationsTableProps = {
  applications: Application[];
  loading: boolean;
  selectedId: string | null;
  remove: (id: string) => Promise<void> | void;
  update: (application: Application) => Promise<void> | void;
  updateStatus: (id: string, status: string) => Promise<void> | void;
  onOpenDetails: (id: string) => void;
  onRejectRequest: (id: string) => void;
  sortField: SortableField;
  sortDirection: SortDirection;
  sortBy: (field: SortableField) => void;
};

export function ApplicationsTable({
  applications,
  loading,
  selectedId,
  remove,
  update,
  updateStatus,
  onOpenDetails,
  onRejectRequest,
  sortField,
  sortDirection,
  sortBy,
}: ApplicationsTableProps) {
  const { suggestions, remember } = useJobTitleSuggestions();

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

  function persist(row: Application, field: TableField, value: string | string[]) {
    if (field === "status") {
      const status = String(value);
      if (status === "Rejected") {
        onRejectRequest(row.id);
        return;
      }
      if (status !== row.status) {
        void updateStatus(row.id, status);
      }
      return;
    }

    const next: Application = { ...row };
    if (field === "resumeId") {
      next.resumeId = (value === "" ? null : value) as ResumeId | null;
    } else if (field === "stages") {
      next.stages = Array.isArray(value) ? value : [String(value)];
    } else {
      next[field] = String(value);
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
              <th
                key={column.key}
                aria-sort={
                  sortField === column.key
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => sortBy(column.key)}
                >
                  {column.label}
                  {sortField === column.key ? (
                    <span className="sort-indicator" aria-hidden>
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  ) : null}
                </button>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((row) => (
            <tr
              key={row.id}
              className={[
                rowStatusClass(row.status),
                selectedId === row.id ? "is-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {COLUMNS.map((column) => (
                <td key={column.key}>
                  <Field
                    row={row}
                    field={column.key}
                    suggestions={suggestions}
                    remember={remember}
                    label={column.label}
                    onSave={(value) => persist(row, column.key, value)}
                  />
                </td>
              ))}
              <td className="actions-cell">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Open details"
                  onClick={() => onOpenDetails(row.id)}
                >
                  <DetailsIcon />
                </button>
                <button
                  type="button"
                  className="icon-button danger"
                  aria-label="Delete"
                  onClick={() => {
                    if (window.confirm("Delete this application?")) {
                      void remove(row.id);
                    }
                  }}
                >
                  <DeleteIcon />
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
  label,
  suggestions,
  remember,
  onSave,
}: {
  row: Application;
  field: TableField;
  label: string;
  suggestions: string[];
  remember: (value: string) => void;
  onSave: (value: string | string[]) => void;
}) {
  if (field === "jobTitle") {
    return (
      <JobTitleCombobox
        value={row.jobTitle}
        suggestions={suggestions}
        onSave={(value) => onSave(value)}
        onRemember={remember}
      />
    );
  }

  if (field === "status") {
    return (
      <select
        className="inline-cell"
        value={row.status}
        aria-label={label}
        onChange={(event) => onSave(event.target.value)}
      >
        {statusOptionsFor(row.stages, row.status).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    );
  }

  if (field === "stages") {
    return (
      <StagesCell
        stages={row.stages}
        onChange={(stages) => onSave(stages)}
      />
    );
  }

  if (field === "resumeId") {
    return (
      <select
        className="inline-cell"
        value={row.resumeId ?? ""}
        aria-label={label}
        onChange={(event) => onSave(event.target.value)}
      >
        <option value="">None</option>
        <option value="en">EN</option>
        <option value="pt-br">PT-BR</option>
      </select>
    );
  }

  if (field === "nextStep" || field === "lastUpdated") {
    return (
      <InlineTextCell
        type="date"
        value={isoDateValue(row[field])}
        ariaLabel={label}
        onSave={onSave}
      />
    );
  }

  if (field === "jobUrl") {
    return (
      <InlineTextCell
        type="url"
        value={row.jobUrl}
        ariaLabel={label}
        onSave={onSave}
      />
    );
  }

  return (
    <InlineTextCell
      value={row[field]}
      ariaLabel={label}
      onSave={onSave}
    />
  );
}

function useJobTitleSuggestions() {
  const vocabulary = useVocabularyService();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    void vocabulary.listJobTitles().then(setSuggestions);
  }, [vocabulary]);

  const remember = useCallback(
    (title: string) => {
      void vocabulary
        .addJobTitle(title)
        .then(setSuggestions)
        .catch(() => undefined);
    },
    [vocabulary],
  );

  return { suggestions, remember };
}
