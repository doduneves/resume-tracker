import { PlusIcon } from "./icons";

type AddApplicationRowProps = {
  onAdd: () => Promise<void> | void;
};

export function AddApplicationRow({ onAdd }: AddApplicationRowProps) {
  return (
    <button type="button" className="primary add-row" onClick={() => void onAdd()}>
      <PlusIcon />
      Add row
    </button>
  );
}
