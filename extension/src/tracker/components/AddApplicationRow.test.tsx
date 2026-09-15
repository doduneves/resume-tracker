import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AddApplicationRow } from "./AddApplicationRow";

describe("AddApplicationRow", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("shows a plus icon and Add row label", () => {
    const onAdd = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    act(() => {
      root.render(<AddApplicationRow onAdd={onAdd} />);
    });

    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.textContent).toContain("Add row");
    expect(button.querySelector("svg")).not.toBeNull();

    act(() => {
      button.click();
    });
    expect(onAdd).toHaveBeenCalledOnce();
  });
});
