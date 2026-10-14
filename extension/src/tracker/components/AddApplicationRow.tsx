import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";

type AddApplicationRowProps = {
  onAdd: () => Promise<void> | void;
};

export function AddApplicationRow({ onAdd }: AddApplicationRowProps) {
  return (
    <Button type="button" onClick={() => void onAdd()}>
      <PlusIcon />
      Add row
    </Button>
  );
}
