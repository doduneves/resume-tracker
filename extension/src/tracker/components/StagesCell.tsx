import { ChipList } from "./ChipList";

type StagesCellProps = {
  stages: string[];
  onChange: (stages: string[]) => void;
};

export function StagesCell({ stages, onChange }: StagesCellProps) {
  return (
    <ChipList
      values={stages}
      onChange={onChange}
      inputLabel="Add stage"
      placeholder="Add stage"
    />
  );
}
