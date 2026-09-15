import { useState, type FocusEvent, type KeyboardEvent } from "react";

type ChipListProps = {
  values: string[];
  onChange: (values: string[]) => void;
  inputLabel: string;
  placeholder: string;
  onCreate?: (value: string) => void;
};

export function ChipList({
  values,
  onChange,
  inputLabel,
  placeholder,
  onCreate,
}: ChipListProps) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const tag = draft.trim();
    if (!tag || values.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...values, tag]);
    onCreate?.(tag);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addValue();
    }
  }

  function onBlur(event: FocusEvent<HTMLInputElement>) {
    const parent = event.currentTarget.closest(".chip-list");
    const next = event.relatedTarget;
    if (next instanceof Node && parent?.contains(next)) {
      return;
    }
    if (draft.trim()) {
      addValue();
    }
  }

  return (
    <div className="chip-list">
      {values.map((value) => (
        <span className="chip" key={value}>
          {value}
          <button
            type="button"
            className="chip-remove"
            tabIndex={-1}
            aria-label={`Remove ${value}`}
            onClick={() => onChange(values.filter((item) => item !== value))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="inline-cell"
        value={draft}
        aria-label={inputLabel}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
