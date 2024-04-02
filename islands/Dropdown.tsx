interface DropdownProps {
  section: string;
  data: { id: number; name: string }[];
}

export function Dropdown({ props }: { props: DropdownProps }) {
  return (
    <select name={props.section}>
      <option value="" hidden disabled selected>{props.section}</option>
      {props.data.map((e) => {
        return <option value={e.id}>{e.name}</option>;
      })}
    </select>
  );
}
