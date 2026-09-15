import { useCallback, useEffect, useRef, useState } from "react";
import { todayIsoDate } from "../../application/services/dates";
import type { Application } from "../../domain/application";
import { useVocabularyService } from "../hooks/VocabularyServiceContext";
import { ChipList } from "./ChipList";
import { InlineTextCell } from "./InlineTextCell";
import { TimelineList } from "./TimelineList";

type DetailDrawerProps = {
  application: Application;
  onClose: () => void;
  update: (application: Application) => Promise<void> | void;
  addNote: (id: string, text: string) => Promise<void> | void;
  escapeEnabled?: boolean;
};

export function DetailDrawer({
  application,
  onClose,
  update,
  addNote,
  escapeEnabled = true,
}: DetailDrawerProps) {
  const [note, setNote] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const { remember } = useStackTagSuggestions();

  useEffect(() => {
    panelRef.current?.focus();
    setNote("");
  }, [application.id]);

  useEffect(() => {
    if (!escapeEnabled) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [escapeEnabled, onClose]);

  function patch(next: Partial<Application>) {
    void update({
      ...application,
      ...next,
      lastUpdated: todayIsoDate(),
    });
  }

  function submitNote() {
    const text = note.trim();
    if (!text) {
      return;
    }
    void addNote(application.id, text);
    setNote("");
  }

  return (
    <aside
      ref={panelRef}
      className="drawer"
      role="dialog"
      aria-label="Application details"
      tabIndex={-1}
    >
      <header className="drawer-header">
        <p className="drawer-kicker">{application.status}</p>
        <h2>{application.company || "Untitled company"}</h2>
        <p className="muted">{application.jobTitle || "No job title"}</p>
      </header>

      <div className="drawer-field">
        <span>Stack</span>
        <ChipList
          values={application.stack}
          onChange={(stack) => patch({ stack })}
          inputLabel="Add stack tag"
          placeholder="Add tag"
          onCreate={remember}
        />
      </div>

      <label className="drawer-field">
        <span>Contact</span>
        <InlineTextCell
          value={application.contact}
          ariaLabel="Contact"
          onSave={(contact) => patch({ contact })}
        />
      </label>

      <label className="drawer-field">
        <span>Rating</span>
        <InlineTextCell
          type="number"
          min={1}
          max={5}
          value={application.rating == null ? "" : String(application.rating)}
          ariaLabel="Rating"
          onSave={(value) =>
            patch({ rating: value === "" ? null : Number(value) })
          }
        />
      </label>

      <label className="drawer-field">
        <span>Match Level</span>
        <InlineTextCell
          value={application.matchLevel}
          ariaLabel="Match Level"
          onSave={(matchLevel) => patch({ matchLevel })}
        />
      </label>

      <section className="drawer-timeline">
        <h3>Timeline</h3>
        <TimelineList entries={application.timeline} />
      </section>

      <label className="drawer-field">
        <span>Add note</span>
        <textarea
          className="inline-cell"
          rows={3}
          aria-label="Add note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submitNote();
            }
          }}
        />
      </label>
      <button type="button" className="primary" onClick={submitNote}>
        Add note
      </button>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </aside>
  );
}

function useStackTagSuggestions() {
  const vocabulary = useVocabularyService();
  const remember = useCallback(
    (tag: string) => {
      void vocabulary.addStackTag(tag).catch(() => undefined);
    },
    [vocabulary],
  );
  return { remember };
}
