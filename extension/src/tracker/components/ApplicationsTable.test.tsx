import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Application } from "../../domain/application";
import { DEFAULT_STAGES, TERMINAL_STATUSES } from "../../domain/status";
import { VocabularyServiceProvider } from "../hooks/VocabularyServiceContext";
import { ApplicationsTable } from "./ApplicationsTable";

describe("ApplicationsTable", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders spec column order, default sort, and status row colors", async () => {
    const view = await renderTable({
      applications: [
        sample({ id: "applied", status: "Applied" }),
        sample({ id: "offer", status: "Offer" }),
        sample({ id: "rejected", status: "Rejected" }),
      ],
    });
    container = view.container;
    root = view.root;

    const headers = [...container.querySelectorAll("th")].map(
      (header) => header.textContent,
    );
    expect(headers).toEqual([
      "Company",
      "Job Title",
      "Status",
      "Stages",
      "Job URL",
      "Resume",
      "Next step",
      "Last Updated▼",
      "Salary",
      "Rating",
      "Match Level",
      "Stack",
      "Contact",
      "Notes",
      "Actions",
    ]);

    const lastUpdated = container.querySelector('th[aria-sort="descending"]');
    expect(lastUpdated?.textContent).toContain("Last Updated");

    expect(container.querySelector("tr.row-applied")).not.toBeNull();
    expect(container.querySelector("tr.row-in-progress")).not.toBeNull();
    expect(container.querySelector("tr.row-rejected")).not.toBeNull();

    expect(container.querySelector('[aria-label="Add stage"]')).not.toBeNull();
    expect(
      container.querySelector('input[aria-label="Next step"][type="date"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('input[aria-label="Last Updated"][type="date"]'),
    ).not.toBeNull();
  });

  it("lists terminals plus that row’s stages and saves status through updateStatus", async () => {
    const update = vi.fn();
    const updateStatus = vi.fn();
    const view = await renderTable({
      applications: [
        sample({
          id: "row-1",
          status: "Applied",
          stages: ["Onsite"],
        }),
      ],
      update,
      updateStatus,
    });
    container = view.container;
    root = view.root;

    const statusSelect = container.querySelector(
      'select[aria-label="Status"]',
    ) as HTMLSelectElement;
    expect([...statusSelect.options].map((option) => option.value)).toEqual([
      ...TERMINAL_STATUSES,
      "Onsite",
    ]);

    act(() => {
      statusSelect.value = "Offer";
      statusSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(updateStatus).toHaveBeenCalledWith("row-1", "Offer");
    expect(update).not.toHaveBeenCalled();
  });
});

async function renderTable({
  applications,
  update = () => undefined,
  updateStatus = () => undefined,
}: {
  applications: Application[];
  update?: () => void;
  updateStatus?: (id: string, status: string) => void;
}) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const vocabulary = {
    listJobTitles: vi.fn().mockResolvedValue(["Engineer"]),
    addJobTitle: vi.fn(),
  };

  act(() => {
    root.render(
      <VocabularyServiceProvider value={vocabulary as never}>
        <ApplicationsTable
          applications={applications}
          loading={false}
          remove={() => undefined}
          update={update}
          updateStatus={updateStatus}
          sortField="lastUpdated"
          sortDirection="desc"
          sortBy={() => undefined}
        />
      </VocabularyServiceProvider>,
    );
  });
  await act(async () => {
    await Promise.resolve();
  });

  return { container, root };
}

function sample(overrides: Partial<Application>): Application {
  return {
    id: "id",
    company: "Acme",
    status: "Applied",
    jobTitle: "Engineer",
    nextStep: "2026-09-12",
    lastUpdated: "2026-09-10",
    salary: "",
    rating: null,
    matchLevel: "",
    stack: [],
    jobUrl: "",
    resumeId: null,
    stages: [...DEFAULT_STAGES],
    contact: "",
    timeline: [],
    appliedAt: "2026-09-01",
    ...overrides,
  };
}
