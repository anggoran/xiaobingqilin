import { signal } from "@preact/signals";
import { Dropdown } from "../islands/Dropdown.tsx";
import { Menu } from "../islands/Menu.tsx";
import { SoundButton } from "../islands/SoundButton.tsx";
import { Label } from "../islands/Label.tsx";
import { randomize } from "../utils/randomize.ts";
import { useEffect } from "preact/hooks";
import { readJSON } from "../utils/read-json.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

export default async function BlueprintPage() {
  const initials = await readJSON("initials");
  const finals = await readJSON("finals");
  const tones = await readJSON("tones");
  const question = await randomize();

  const initial = signal("");
  const final = signal("");
  const tone = signal("");

  return (
    <div className="h-screen content-center">
      <form
        action=""
        method=""
        className="flex flex-col items-center space-y-4"
      >
        <SoundButton sound_id={question?.sound_id} />
        <Label props={{ initial: initial, final: final, tone: tone }} />
        <div className="flex flex-row space-x-8">
          <Menu
            props={{ section: "initials", data: initials, state: initial }}
          />
          <Menu props={{ section: "finals", data: finals, state: final }} />
          <Dropdown
            props={{ section: "tones", data: tones, state: tone }}
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
