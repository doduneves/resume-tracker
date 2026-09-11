import { useCallback, useEffect, useMemo, useState } from "react";
import type { Application } from "../../domain/application";
import { useApplicationService } from "./ApplicationServiceContext";
import {
  compareApplications,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  type SortDirection,
  type SortableField,
} from "../sortApplications";

export function useApplications() {
  const service = useApplicationService();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortableField>(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    DEFAULT_SORT_DIRECTION,
  );

  const refresh = useCallback(async () => {
    try {
      const rows = await service.list();
      setApplications(rows);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sortedApplications = useMemo(
    () =>
      [...applications].sort((a, b) =>
        compareApplications(a, b, sortField, sortDirection),
      ),
    [applications, sortDirection, sortField],
  );

  const sortBy = useCallback((field: SortableField) => {
    setSortField((current) => {
      if (current === field) {
        setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
        return current;
      }
      setSortDirection(field === "lastUpdated" || field === "nextStep" ? "desc" : "asc");
      return field;
    });
  }, []);

  const add = useCallback(async () => {
    try {
      await service.create();
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to add application");
    }
  }, [refresh, service]);

  const update = useCallback(
    async (application: Application) => {
      try {
        await service.update(application);
        await refresh();
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Failed to update application",
        );
      }
    },
    [refresh, service],
  );

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await service.updateStatus(id, status);
        await refresh();
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Failed to update status",
        );
      }
    },
    [refresh, service],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await service.delete(id);
        await refresh();
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Failed to delete application",
        );
      }
    },
    [refresh, service],
  );

  return {
    applications: sortedApplications,
    error,
    loading,
    add,
    update,
    updateStatus,
    remove,
    sortField,
    sortDirection,
    sortBy,
  };
}
