import { useEffect, useState } from "react";
import { AddApplicationRow } from "./components/AddApplicationRow";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { DetailDrawer } from "./components/DetailDrawer";
import { RejectionDialog } from "./components/RejectionDialog";
import { useApplications } from "./hooks/useApplications";

export function App() {
  const {
    applications,
    error,
    loading,
    add,
    update,
    updateStatus,
    addNote,
    reject,
    remove,
    sortField,
    sortDirection,
    sortBy,
  } = useApplications();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId && !applications.some((row) => row.id === selectedId)) {
      setSelectedId(null);
    }
  }, [applications, selectedId]);

  const selected = applications.find((row) => row.id === selectedId) ?? null;

  return (
    <div className={selected ? "layout layout-with-drawer" : "layout"}>
      {selected ? (
        <DetailDrawer
          application={selected}
          onClose={() => setSelectedId(null)}
          update={update}
          addNote={addNote}
          escapeEnabled={!rejectingId}
        />
      ) : null}
      <main className="page">
        <header className="header">
          <div>
            <h1>Resume Tracker</h1>
            <p className="muted">
              Applications are stored locally in this extension.
            </p>
          </div>
          <AddApplicationRow onAdd={add} />
        </header>
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        <ApplicationsTable
          applications={applications}
          loading={loading}
          selectedId={selectedId}
          remove={remove}
          update={update}
          updateStatus={updateStatus}
          onOpenDetails={setSelectedId}
          onRejectRequest={setRejectingId}
          sortField={sortField}
          sortDirection={sortDirection}
          sortBy={sortBy}
        />
      </main>
      {rejectingId ? (
        <RejectionDialog
          onCancel={() => setRejectingId(null)}
          onConfirm={(reason) => {
            const id = rejectingId;
            setRejectingId(null);
            void reject(id, reason.trim() || undefined);
          }}
        />
      ) : null}
    </div>
  );
}
