import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

interface DropdownProps {
  field: string;
  options: { label: string; value: string | number | null }[] | undefined;
  state: Signal;
}

export default function Dropdown({ props }: { props: DropdownProps }) {
  const handleChange = (e: JSX.TargetedEvent) => {
    const selected = (e.target as HTMLInputElement).value;
    props.state.value[props.field] = selected;
    console.log(props.state.value);
  };

  return (
    <select name={props.field} onChange={handleChange}>
      <option value="" hidden disabled selected>{props.field}</option>
      {props?.options?.map((e) => (
        <option value={e.value?.toString() ?? ""}>{e.label}</option>
      ))}
    </select>
  );
}
