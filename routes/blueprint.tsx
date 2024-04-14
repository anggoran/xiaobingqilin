import { signal } from "@preact/signals";
import { Dropdown } from "../islands/Dropdown.tsx";
import { Menu } from "../islands/Menu.tsx";
import { SoundButton } from "../islands/SoundButton.tsx";
import { Label } from "../islands/Label.tsx";
import { randomize } from "../utils/randomize.ts";
import { readJSON } from "../utils/read-json.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { AnswerModel, PinyinModel, PinyinPartModel } from "../models/pinyin.ts";

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
    const url = new URL(req.url);
    const questionParams = url.searchParams.get("question");
    const answerParams = url.searchParams.get("answer");
    const truthParams = url.searchParams.get("truth");
    const pinyins: PinyinModel[] = await readJSON("pinyins");
    const initials: PinyinPartModel[] = await readJSON("initials");
    const finals: PinyinPartModel[] = await readJSON("finals");
    const tones: PinyinPartModel[] = await readJSON("tones");
    const question = pinyins.find((e) => e.name === questionParams) ??
      randomize(pinyins);
    const { initial_id, final_id, tone_id } =
      pinyins.find((e) => e.name === answerParams) ??
        { initial_id: 0, final_id: 0, tone_id: 0 };
    const answer = { initial_id, final_id, tone_id };
    const truth = truthParams === "true"
      ? true
      : truthParams === "false"
      ? false
      : null;

    return ctx.render({
      pinyins,
      initials,
      finals,
      tones,
      question,
      answer,
      truth,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const pinyins: PinyinModel[] = await readJSON("pinyins");
    const initials: PinyinPartModel[] = await readJSON("initials");
    const finals: PinyinPartModel[] = await readJSON("finals");
    const question_id = form.get("question_id");
    const initial = form.get("initial");
    const final = form.get("final");
    const question = pinyins.find((e) => e.id.toString() === (question_id!));
    const { initial_id, final_id, tone_id } = question!;
    const solution = { initial_id, final_id, tone_id };
    const answer = {
      initial_id: initials.find((e) => e.name == initial)!.id,
      final_id: finals.find((e) => e.name == final)!.id,
      tone_id: Number(form.get("tone")!.toString()),
    };
    const proposed = pinyins.find((e) =>
      e.initial_id === answer.initial_id &&
      e.final_id === answer.final_id &&
      e.tone_id === answer.tone_id
    );

    const myQuestion = encodeURIComponent(question!.name);
    let myAnswer = "N.A.";

    if (proposed !== undefined) {
      myAnswer = encodeURIComponent(proposed.name);
    }

    const headers = new Headers();
    const params = `question=${myQuestion}&answer=${myAnswer}&` +
      `truth=${JSON.stringify(solution) === JSON.stringify(answer)}`;
    headers.set("location", `/blueprint?${params}`);
    return new Response(null, {
      status: 303,
      headers: headers,
    });
  },
};

export default function Page(props: PageProps<Data>) {
  const { pinyins, initials, finals, tones, question, answer, truth } =
    props.data;

  const { initial_id, final_id, tone_id } = answer;
  const myAnswer = signal({ initial_id, final_id, tone_id });

  console.log(question);

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
          ? <a href="/blueprint">Continue</a>
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
