import { Handlers, PageProps } from "$fresh/server.ts";
import { signal } from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";
import { getReadingQuiz, postReadingQuiz } from "../../controllers/reading.ts";
import { Dropdown } from "../../islands/Dropdown.tsx";
import { Label } from "../../islands/Label.tsx";
import { Menu } from "../../islands/Menu.tsx";
import {
  AnswerModel,
  HanziModel,
  PinyinModel,
  PinyinPartModel,
} from "../../models/pinyin.ts";

interface Data {
  hanzi: HanziModel;
  answer: AnswerModel;
  truth: boolean | null;
  pinyins: PinyinModel[];
  initials: PinyinPartModel[];
  finals: PinyinPartModel[];
  tones: PinyinPartModel[];
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    return await getReadingQuiz(req, ctx);
  },
  async POST(req, ctx) {
    return await postReadingQuiz(req, ctx);
  },
};

export default function ReadingQuizPage(props: PageProps<Data>) {
  const currentURL = decodeURIComponent(props.url.pathname);
  const { hanzi, answer, truth, pinyins, initials, finals, tones } = props.data;
  const { character: question, pinyin: solution, definition } = hanzi;
  const nextURL = currentURL.replace(question, "");

  const { initial_id, final_id, tone_id } = answer;
  const myAnswer = signal({ initial_id, final_id, tone_id });

  return (
    <div
      className={`h-screen content-center ${
        truth === true
          ? "bg-green-300"
          : truth === false
          ? "bg-red-300"
          : "bg-white"
      } `}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p>
            <b>Question:</b> {question} - {definition}
          </p>
          {truth !== null
            ? (
              <p>
                <b>Solution:</b> {solution}
              </p>
            )
            : <></>}
        </div>
        <Label
          props={{
            models: pinyins,
            data: myAnswer,
          }}
        />
        <form id="quiz">
          <input type="hidden" name="question" value={question} />
          <div className="flex flex-row space-x-8">
            <Menu
              props={{
                section: "initial",
                model: initials,
                data: myAnswer,
              }}
            />
            <Menu
              props={{
                section: "final",
                model: finals,
                data: myAnswer,
              }}
            />
            <Dropdown
              props={{
                section: "tone",
                model: tones,
                data: myAnswer,
              }}
            />
          </div>
        </form>
        {truth !== null
          ? <a href={nextURL}>Continue</a>
          : (
            <div className="flex flex-row space-x-8">
              <button form="quiz" type="reset">Clear</button>
              <button form="quiz" type="submit" formmethod="POST">
                Submit
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
