import { Handlers, PageProps } from "$fresh/server.ts";
import {
  Signal,
  signal,
} from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";
import { getReadingQuiz, postReadingQuiz } from "../../controllers/reading.ts";
import { Dropdown } from "../../islands/Dropdown.tsx";
import { Label } from "../../islands/Label.tsx";
import { Menu } from "../../islands/Menu.tsx";
import {
  AnswerModel,
  PinyinModel,
  PinyinPartModel,
} from "../../models/pinyin.ts";

interface Data {
  question: string;
  hint: string;
  answer: AnswerModel;
  solution: string | null;
  truth: boolean | null;
  options: {
    pinyins: PinyinModel[];
    initials: PinyinPartModel[];
    finals: PinyinPartModel[];
    tones: PinyinPartModel[];
  };
}

export const handler: Handlers<Data> = {
  GET: async (req, ctx) => await getReadingQuiz(req, ctx),
  POST: async (req, ctx) => await postReadingQuiz(req, ctx),
};

export default function ReadingQuizPage(props: PageProps<Data>) {
  const currentURL = decodeURIComponent(props.url.pathname);
  const { question, hint, answer, solution, truth, options } = props.data;
  const nextURL = currentURL.replace(question, "");

  const answerState: Signal<AnswerModel> = signal({ ...answer });

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
            <b>Hint:</b> {hint}
          </p>
          <p>
            <b>Question:</b> {question}
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
            models: options.pinyins,
            data: answerState,
          }}
        />
        <form id="quiz">
          <input type="hidden" name="question" value={question} />
          <div className="flex flex-row space-x-8">
            <Menu
              props={{
                section: "initial",
                model: options.initials,
                data: answerState,
              }}
            />
            <Menu
              props={{
                section: "final",
                model: options.finals,
                data: answerState,
              }}
            />
            <Dropdown
              props={{
                section: "tone",
                model: options.tones,
                data: answerState,
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
