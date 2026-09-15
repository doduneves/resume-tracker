import { useEffect, useState, type KeyboardEvent } from "react";

type InlineTextCellProps = {
  value: string;
  ariaLabel: string;
  onSave: (value: string) => void;
  type?: "text" | "url" | "number" | "date";
  min?: number;
  max?: number;
};

export function InlineTextCell({
  value,
  ariaLabel,
  onSave,
  type = "text",
  min,
  max,
}: InlineTextCellProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit() {
    if (draft !== value) {
      onSave(draft);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      return;
    }
    if (event.key === "Escape") {
      setDraft(value);
    }
  }

  return (
    <input
      className="inline-cell"
      type={type}
      value={draft}
      min={min}
      max={max}
      aria-label={ariaLabel}
      autoComplete="off"
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={onKeyDown}
    />
  );
}
