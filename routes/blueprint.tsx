import { signal } from "@preact/signals";
import { Dropdown } from "../islands/Dropdown.tsx";
import { Menu } from "../islands/Menu.tsx";
import { SoundButton } from "../islands/SoundButton.tsx";
import { Label } from "../islands/Label.tsx";
import { randomize } from "../utils/randomize.ts";
import { readJSON } from "../utils/read-json.ts";
import { SubmitButton } from "../islands/SubmitButton.tsx";
import { Handlers } from "$fresh/server.ts";
import { PinyinModel, PinyinPartModel } from "../models/pinyin.ts";

export const handler: Handlers = {
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
      initial_id: initials.find((e) => e.name == initial)?.id,
      final_id: finals.find((e) => e.name == final)?.id,
      tone_id: Number(form.get("tone")!.toString()),
    };

    return new Response(
      `match: ${JSON.stringify(solution) === JSON.stringify(answer)}\n` +
        `solution: ${JSON.stringify(solution)}\n` +
        `answer: ${JSON.stringify(answer)}`,
    );
  },
};

export default async function BlueprintPage() {
  const pinyins = await readJSON("pinyins");
  const initials = await readJSON("initials");
  const finals = await readJSON("finals");
  const tones = await readJSON("tones");

  const question = randomize(pinyins);
  const answer = signal({ initial_id: 0, final_id: 0, tone_id: 0 });

  console.log(question);

  return (
    <div className="h-screen content-center">
      <form
        method="POST"
        className="flex flex-col items-center space-y-4"
      >
        <input type="hidden" name="question_id" value={question.id} />
        <SoundButton sound_id={question?.sound_id} />
        <Label
          props={{
            models: pinyins,
            data: answer,
          }}
        />
        <div className="flex flex-row space-x-8">
          <Menu
            props={{
              section: "initial",
              model: initials,
              data: answer,
            }}
          />
          <Menu
            props={{
              section: "final",
              model: finals,
              data: answer,
            }}
          />
          <Dropdown
            props={{
              section: "tone",
              model: tones,
              data: answer,
            }}
          />
        </div>
        <div className="flex flex-row space-x-8">
          <button type="reset">Clear</button>
          <SubmitButton props={{ question: question, answer: answer }} />
        </div>
      </form>
    </div>
  );
}
