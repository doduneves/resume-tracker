import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RejectionDialogProps = {
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export function RejectionDialog({
  onCancel,
  onConfirm,
}: RejectionDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const content = event.currentTarget;
          if (content instanceof HTMLElement) {
            content.querySelector("textarea")?.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Rejection reason</DialogTitle>
          <DialogDescription>
            Optional. You can leave this empty.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="rejection-reason" className="sr-only">
          Rejection reason
        </Label>
        <Textarea
          id="rejection-reason"
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onConfirm(reason)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
