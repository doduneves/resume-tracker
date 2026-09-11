import { AddApplicationRow } from "./components/AddApplicationRow";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { useApplications } from "./hooks/useApplications";

export function App() {
  const {
    applications,
    error,
    loading,
    add,
    update,
    updateStatus,
    remove,
    sortField,
    sortDirection,
    sortBy,
  } = useApplications();

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Resume Tracker</h1>
          <p className="muted">Applications are stored locally in this extension.</p>
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
        remove={remove}
        update={update}
        updateStatus={updateStatus}
        sortField={sortField}
        sortDirection={sortDirection}
        sortBy={sortBy}
      />
    </main>
  );
}
