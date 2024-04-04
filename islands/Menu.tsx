import { JSX } from "preact/jsx-runtime";
import { Signal } from "@preact/signals";
import { PinyinPartModel } from "../models/pinyin.ts";
import { AnswerModel } from "../models/pinyin.ts";

interface MenuProps {
  section: string;
  model: PinyinPartModel[] | undefined;
  data: Signal<AnswerModel>;
}

export function Menu({ props }: { props: MenuProps }) {
  const handleChange = (e: JSX.TargetedEvent) => {
    const selected = (e.target as HTMLInputElement).value;
    props.data.value = {
      ...props.data.value,
      [`${props.section}_id`]: props.model?.find((e) => e.name == selected)?.id,
    };
    console.log(props.data.value);
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
        {props?.model?.map((e) => <option value={e.name} />)}
      </datalist>
    </>
  );
}
