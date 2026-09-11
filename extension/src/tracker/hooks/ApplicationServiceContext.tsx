import { createContext, useContext } from "react";
import type { ApplicationService } from "../../application/services/application.service";

const ApplicationServiceContext = createContext<ApplicationService | null>(
  null,
);

export const ApplicationServiceProvider = ApplicationServiceContext.Provider;

export function useApplicationService(): ApplicationService {
  const service = useContext(ApplicationServiceContext);
  if (!service) {
    throw new Error("ApplicationService is not provided");
  }
  return service;
}
