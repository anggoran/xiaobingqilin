import { Signal } from "@preact/signals";
import { AnswerModel, PinyinModel } from "../models/pinyin.ts";

interface SubmitProps {
  question: PinyinModel | undefined;
  answer: Signal<AnswerModel>;
}

export function SubmitButton({ props }: { props: SubmitProps }) {
  const handleClick = () => {
    if (props.question != undefined) {
      const { initial_id, final_id, tone_id } = props.question;
      const solution: AnswerModel = { initial_id, final_id, tone_id };
      console.log("solution:", solution);
      console.log("answer:", props.answer.value);
      console.log(
        "match:",
        JSON.stringify(solution) === JSON.stringify(props.answer.value),
      );
    }
  };

  return <button type="submit" onClick={handleClick}>Submit</button>;
}
