import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { createTimelineEntry } from "../../domain/timeline";
import { TimelineList } from "./TimelineList";

describe("TimelineList", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders chronological dates and indents rejection reasons", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <TimelineList
          entries={[
            createTimelineEntry("status_change", "Rejected", "2026-09-15"),
            createTimelineEntry("status_change", "Applied", "2026-09-10"),
            createTimelineEntry(
              "rejection_reason",
              "Headcount freeze",
              "2026-09-15",
            ),
          ]}
        />,
      );
    });

    const items = [...container.querySelectorAll(".timeline-item")];
    expect(items.map((item) => item.textContent)).toEqual([
      "10/09/2026—Applied",
      "15/09/2026—Rejected",
      "—Headcount freeze",
    ]);
    expect(
      container.querySelector(".timeline-rejection_reason .timeline-date")
        ?.textContent,
    ).toBe("");
  });
});
