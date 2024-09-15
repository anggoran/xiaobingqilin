import { Signal, signal } from "@preact/signals";
import { Dropdown } from "../../islands/Dropdown.tsx";
import { Menu } from "../../islands/Menu.tsx";
import { SoundButton } from "../../islands/SoundButton.tsx";
import { Label } from "../../islands/Label.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import {
  AnswerModel,
  PinyinModel,
  PinyinPartModel,
} from "../../models/pinyin.ts";
import { getListening, postListening } from "../../controllers/listening.ts";

interface Data {
  question: string;
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
  GET: async (req, ctx) => await getListening(req, ctx),
  POST: async (req, ctx) => await postListening(req, ctx),
};

export default function ListeningPage(props: PageProps<Data>) {
  const { question, answer, solution, truth, options } = props.data;
  const answerState: Signal<AnswerModel> = signal({ ...answer });

  return (
    <>
      <a href="/">Back to home</a>
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
          <SoundButton
            sound={question}
            text={solution ?? "🔈"}
          />
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
            ? <a href="/listening">Continue</a>
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
    </>
  );
}
