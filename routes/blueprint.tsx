import { Dropdown } from "../islands/Dropdown.tsx";
import { Menu } from "../islands/Menu.tsx";
import { SoundButton } from "../islands/SoundButton.tsx";

export default async function Blueprint() {
  const dropdowns = ["initials", "finals", "tones"];

  const readJSON = async (
    data: string,
  ): Promise<{ id: number; name: string }[]> => {
    const name = `${Deno.cwd()}/static/data/${data}.json`;
    const text = await Deno.readTextFile(name);
    return JSON.parse(text)[data];
  };

  const initials = await readJSON(dropdowns[0]);
  const finals = await readJSON(dropdowns[1]);
  const tones = await readJSON(dropdowns[2]);

  return (
    <div className="h-screen content-center">
      <form
        action=""
        method=""
        className="flex flex-col items-center space-y-4"
      >
        <SoundButton />
        <p>rén</p>
        <div className="flex flex-row space-x-8">
          <Menu props={{ section: dropdowns[0], data: initials }} />
          <Menu props={{ section: dropdowns[1], data: finals }} />
          <Dropdown props={{ section: dropdowns[2], data: tones }} />
        </div>
        <div className="flex flex-row space-x-8">
          <button type="reset">Clear</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
