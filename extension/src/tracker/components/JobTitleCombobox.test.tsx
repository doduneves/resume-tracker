import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JobTitleCombobox } from "./JobTitleCombobox";

describe("JobTitleCombobox", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("saves a typed title and remembers new suggestions", () => {
    const onSave = vi.fn();
    const onRemember = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <JobTitleCombobox
          value=""
          suggestions={["Engineer"]}
          onSave={onSave}
          onRemember={onRemember}
        />,
      );
    });

    const input = container.querySelector("input") as HTMLInputElement;
    act(() => {
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "Staff Engineer");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });

    expect(onSave).toHaveBeenCalledWith("Staff Engineer");
    expect(onRemember).toHaveBeenCalledWith("Staff Engineer");
  });
});
