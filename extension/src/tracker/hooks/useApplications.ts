import { useCallback, useEffect, useState } from "react";
import type { Application } from "../../domain/application";
import { useApplicationService } from "./ApplicationServiceContext";

export function useApplications() {
  const service = useApplicationService();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return { applications, error, loading, add, update, remove };
}
