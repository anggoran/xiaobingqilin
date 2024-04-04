import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { PinyinPartModel } from "../models/pinyin.ts";
import { AnswerModel } from "../models/pinyin.ts";

interface DropdownProps {
  section: string;
  model: PinyinPartModel[] | undefined;
  data: Signal<AnswerModel>;
}

export function Dropdown({ props }: { props: DropdownProps }) {
  const handleChange = (e: JSX.TargetedEvent) => {
    const selected = (e.target as HTMLInputElement).value;
    props.data.value = {
      ...props.data.value,
      [`${props.section}_id`]: Number.parseInt(selected),
    };
    console.log(props.data.value);
  };

  return (
    <select name={props.section} onChange={handleChange}>
      <option value="" hidden disabled selected>{props.section}</option>
      {props?.model?.map((e) => <option value={e.id}>{e.name}</option>)}
    </select>
  );
}
