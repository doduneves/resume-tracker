type AddApplicationRowProps = {
  onAdd: () => Promise<void> | void;
};

export function AddApplicationRow({ onAdd }: AddApplicationRowProps) {
  return (
    <button type="button" className="primary" onClick={() => void onAdd()}>
      Add row
    </button>
  );
}
