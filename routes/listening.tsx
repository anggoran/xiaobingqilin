import { signal } from "@preact/signals";
import { Dropdown } from "../islands/Dropdown.tsx";
import { Menu } from "../islands/Menu.tsx";
import { SoundButton } from "../islands/SoundButton.tsx";
import { Label } from "../islands/Label.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { AnswerModel, PinyinModel, PinyinPartModel } from "../models/pinyin.ts";
import { getListening, postListening } from "../controllers/listening.ts";

interface Data {
  pinyins: PinyinModel[];
  initials: PinyinPartModel[];
  finals: PinyinPartModel[];
  tones: PinyinPartModel[];
  question: PinyinModel;
  answer: AnswerModel;
  truth: boolean | null;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    return await getListening(req, ctx);
  },
  async POST(req, ctx) {
    return await postListening(req, ctx);
  },
};

export default function ListeningPage(props: PageProps<Data>) {
  const { pinyins, initials, finals, tones, question, answer, truth } =
    props.data;

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
      <div // f-client-nav
       className="flex flex-col items-center space-y-4">
        <SoundButton
          sound_id={question.sound_id}
          text={truth !== null ? question.name : "🔈"}
        />
        <Label
          props={{
            models: pinyins,
            data: myAnswer,
          }}
        />
        <form id="quiz">
          <input type="hidden" name="question_id" value={question.id} />
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
  );
}
