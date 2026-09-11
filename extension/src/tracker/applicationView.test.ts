import { describe, expect, it } from "vitest";
import { rowStatusClass } from "./applicationView";

describe("rowStatusClass", () => {
  it("uses a red tint for Rejected, neutral for Applied, and green otherwise", () => {
    expect(rowStatusClass("Rejected")).toBe("row-rejected");
    expect(rowStatusClass("Applied")).toBe("row-applied");
    expect(rowStatusClass("Offer")).toBe("row-in-progress");
    expect(rowStatusClass("Screening")).toBe("row-in-progress");
  });
});
