import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createApplicationService } from "../bootstrap";
import { App } from "./App";
import { ApplicationServiceProvider } from "./hooks/ApplicationServiceContext";
import "./styles.css";

async function boot() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Tracker root element is missing");
  }

  const service = await createApplicationService();

  createRoot(rootElement).render(
    <StrictMode>
      <ApplicationServiceProvider value={service}>
        <App />
      </ApplicationServiceProvider>
    </StrictMode>,
  );
}

void boot();
