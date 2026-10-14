import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RejectionDialog } from "./RejectionDialog";

describe("RejectionDialog", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("confirms with the typed reason and cancels without confirming", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <RejectionDialog onCancel={onCancel} onConfirm={onConfirm} />,
      );
    });

    act(() => {
      document.body.querySelector("button")?.click();
    });
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();

    act(() => {
      root.render(
        <RejectionDialog onCancel={onCancel} onConfirm={onConfirm} />,
      );
    });

    const textarea = document.body.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      setter?.call(textarea, "Headcount freeze");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      const confirm = [...document.body.querySelectorAll("button")].find(
        (button) => button.textContent === "Confirm",
      );
      confirm?.click();
    });

    expect(onConfirm).toHaveBeenCalledWith("Headcount freeze");
  });
});
