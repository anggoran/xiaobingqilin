interface MenuProps {
  section: string;
  data: { id: number; name: string }[];
}

export function Menu({ props }: { props: MenuProps }) {
  return (
    <>
      <input list={props.section} placeholder={props.section} />
      <datalist id={props.section}>
        {props.data.map((e) => {
          return <option value={e.name} />;
        })}
      </datalist>
    </>
  );
}
