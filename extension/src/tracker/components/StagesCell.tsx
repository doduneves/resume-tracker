import { useState, type FocusEvent, type KeyboardEvent } from "react";

type StagesCellProps = {
  stages: string[];
  onChange: (stages: string[]) => void;
};

export function StagesCell({ stages, onChange }: StagesCellProps) {
  const [draft, setDraft] = useState("");

  function addStage() {
    const tag = draft.trim();
    if (!tag || stages.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...stages, tag]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addStage();
    }
  }

  function onBlur(event: FocusEvent<HTMLInputElement>) {
    const parent = event.currentTarget.closest(".stages-cell");
    const next = event.relatedTarget;
    if (next instanceof Node && parent?.contains(next)) {
      return;
    }
    if (draft.trim()) {
      addStage();
    }
  }

  return (
    <div className="stages-cell">
      {stages.map((stage) => (
        <span className="chip" key={stage}>
          {stage}
          <button
            type="button"
            className="chip-remove"
            tabIndex={-1}
            aria-label={`Remove ${stage}`}
            onClick={() => onChange(stages.filter((item) => item !== stage))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="inline-cell"
        value={draft}
        aria-label="Add stage"
        placeholder="Add stage"
        autoComplete="off"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
