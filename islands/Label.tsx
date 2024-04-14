import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { PinyinModel } from "../models/pinyin.ts";
import { AnswerModel } from "../models/pinyin.ts";

interface LabelProps {
  models: PinyinModel[];
  data: Signal<AnswerModel>;
}

export function Label({ props }: { props: LabelProps }) {
  const text = useSignal("-");
  const answer = [
    props.data.value.initial_id,
    props.data.value.final_id,
    props.data.value.tone_id,
  ];

  useEffect(() => {
    if (answer.every((e) => e != 0)) {
      const selected = props.models.find((e) =>
        e.initial_id == answer[0] &&
        e.final_id == answer[1] &&
        e.tone_id == answer[2]
      );
      text.value = selected?.name ?? "N/A";
    }
  }, [props.data.value]);

  return <p>{text}</p>;
}
