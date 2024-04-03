import { JSX } from "preact/jsx-runtime";
import { Signal } from "@preact/signals";

interface MenuProps {
  section: string;
  data: { id: string; name: number }[] | undefined;
  state: Signal<string>;
}

export function Menu({ props }: { props: MenuProps }) {
  const handleChange = (e: JSX.TargetedEvent) => {
    props.state.value = (e.target as HTMLInputElement).value;
  };

  return (
    <>
      <input
        placeholder={props.section}
        list={props.section}
        onChange={handleChange}
      />
      <datalist
        id={props.section}
      >
        {props?.data?.map((e) => <option value={e.name} />)}
      </datalist>
    </>
  );
}
