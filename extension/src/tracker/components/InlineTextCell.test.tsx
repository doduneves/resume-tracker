import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InlineTextCell } from "./InlineTextCell";

describe("InlineTextCell", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("saves on Enter and keeps the current value", () => {
    const onSave = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <InlineTextCell value="Acme" ariaLabel="Company" onSave={onSave} />,
      );
    });

    const input = container.querySelector("input") as HTMLInputElement;
    act(() => {
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "Globex");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });

    expect(onSave).toHaveBeenCalledWith("Globex");
    expect(document.activeElement).toBe(input);
  });
});
