import { signal } from "@preact/signals";
import { Dropdown } from "../islands/Dropdown.tsx";
import { Menu } from "../islands/Menu.tsx";
import { SoundButton } from "../islands/SoundButton.tsx";
import { Label } from "../islands/Label.tsx";
import { randomize } from "../utils/randomize.ts";
import { readJSON } from "../utils/read-json.ts";

export default async function BlueprintPage() {
  const pinyins = await readJSON("pinyins");
  const initials = await readJSON("initials");
  const finals = await readJSON("finals");
  const tones = await readJSON("tones");

  const question = randomize(pinyins);
  const answer = signal({ initial_id: 0, final_id: 0, tone_id: 0 });

  return (
    <div className="h-screen content-center">
      <form
        action=""
        method=""
        className="flex flex-col items-center space-y-4"
      >
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
