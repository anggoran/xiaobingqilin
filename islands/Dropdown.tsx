import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

interface DropdownProps {
  section: string;
  data: { id: string; name: number }[] | undefined;
  state: Signal<string>;
}

export function Dropdown({ props }: { props: DropdownProps }) {
  const handleChange = (e: JSX.TargetedEvent) => {
    props.state.value = (e.target as HTMLInputElement).value;
  };

  return (
    <select name={props.section} onChange={handleChange}>
      <option value="" hidden disabled selected>{props.section}</option>
      {props?.data?.map((e) => <option value={e.id}>{e.name}</option>)}
    </select>
  );
}
