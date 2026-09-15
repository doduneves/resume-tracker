import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";

type JobTitleComboboxProps = {
  value: string;
  suggestions: string[];
  onSave: (value: string) => void;
  onRemember: (value: string) => void;
};

export function JobTitleCombobox({
  value,
  suggestions,
  onSave,
  onRemember,
}: JobTitleComboboxProps) {
  const listId = useId();
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [useHighlight, setUseHighlight] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const filtered = useMemo(() => {
    const query = draft.trim().toLowerCase();
    if (!query) {
      return suggestions;
    }
    return suggestions.filter((item) => item.toLowerCase().includes(query));
  }, [draft, suggestions]);

  function commit(next = draft) {
    const trimmed = next.trim();
    setDraft(trimmed);
    setOpen(false);
    if (trimmed !== value) {
      onSave(trimmed);
    }
    const known = suggestions.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase(),
    );
    if (trimmed && !known) {
      onRemember(trimmed);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlight((index) => {
        if (!useHighlight) {
          return 0;
        }
        return filtered.length === 0
          ? 0
          : Math.min(index + 1, filtered.length - 1);
      });
      setUseHighlight(true);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setUseHighlight(true);
      setHighlight((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Escape") {
      setDraft(value);
      setOpen(false);
      setUseHighlight(false);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const picked = open && useHighlight ? filtered[highlight] : undefined;
      commit(picked ?? draft);
    }
  }

  return (
    <div className="combobox">
      <input
        className="inline-cell"
        role="combobox"
        aria-label="Job Title"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setHighlight(0);
          setUseHighlight(false);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => commit()}
        onKeyDown={onKeyDown}
      />
      {open && filtered.length > 0 ? (
        <ul className="combobox-list" id={listId} role="listbox">
          {filtered.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={useHighlight && index === highlight}
              className={
                useHighlight && index === highlight
                  ? "combobox-option is-active"
                  : "combobox-option"
              }
              onMouseDown={(event) => {
                event.preventDefault();
                commit(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
