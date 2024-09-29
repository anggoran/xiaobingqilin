import { Handlers, PageProps } from "$fresh/server.ts";
import { getHanziDetail } from "../../controllers/hanzi.ts";
import SolutionWriter from "../../islands/SolutionWriter.tsx";
import { SoundButton } from "../../islands/SoundButton.tsx";
import { HanziModel, PinyinModel } from "../../models/hanzi.ts";

interface Data {
  id: number;
  hanzi: HanziModel;
  pinyin: PinyinModel;
}

export const handler: Handlers<Data> = {
  GET: (req, ctx) => getHanziDetail(req, ctx),
};

export default function Home(props: PageProps<Data>) {
  const { hanzi, pinyin } = props.data;

  return (
    <>
      <a href="/hanzi">Back to Hanzi Database</a>
      <div className="h-screen content-center bg-white">
        <div className="flex flex-col items-center">
          <h3 className="text-3xl font-bold">{hanzi.form}</h3>
          <SolutionWriter character={hanzi.form} label="Animate" />
          <h6 className="text-left text-lg font-bold outline outline-2 px-4 rounded-md my-2">
            <SoundButton
              text={pinyin.sound}
              sound={pinyin.latin! + pinyin.tone!}
            />
          </h6>
          <p className="text-left text-base">
            <ul>
              {hanzi.meaning.split(";").length > 1
                ? hanzi.meaning.split(";").map((elem) => <li>{"• " + elem}</li>)
                : <li>{hanzi.meaning}</li>}
            </ul>
          </p>
          <h6 className="text-left text-lg font-bold underline my-2">
            {hanzi.type}
          </h6>
          <p className="text-left text-base">
            {hanzi.etymology}
          </p>
        </div>
      </div>
    </>
  );
}
