import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTrackerServices } from "../bootstrap";
import { App } from "./App";
import { ApplicationServiceProvider } from "./hooks/ApplicationServiceContext";
import { VocabularyServiceProvider } from "./hooks/VocabularyServiceContext";
import "./styles.css";

async function boot() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Tracker root element is missing");
  }

  const { applications, vocabulary } = await createTrackerServices();

  createRoot(rootElement).render(
    <StrictMode>
      <ApplicationServiceProvider value={applications}>
        <VocabularyServiceProvider value={vocabulary}>
          <App />
        </VocabularyServiceProvider>
      </ApplicationServiceProvider>
    </StrictMode>,
  );
}

void boot();
