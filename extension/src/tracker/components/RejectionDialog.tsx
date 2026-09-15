import { useEffect, useId, useRef, useState } from "react";

type RejectionDialogProps = {
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export function RejectionDialog({
  onCancel,
  onConfirm,
}: RejectionDialogProps) {
  const titleId = useId();
  const [reason, setReason] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId}>Rejection reason</h2>
        <p className="muted">Optional. You can leave this empty.</p>
        <textarea
          ref={textareaRef}
          className="inline-cell"
          rows={3}
          aria-label="Rejection reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => onConfirm(reason)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
