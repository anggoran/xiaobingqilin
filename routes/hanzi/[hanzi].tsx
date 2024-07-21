import { Handlers, PageProps } from "$fresh/server.ts";
import { getHanziDetail } from "../../controllers/hanzi.ts";
import SolutionWriter from "../../islands/SolutionWriter.tsx";
import { HanziModel } from "../../models/hanzi.ts";

interface Data {
  hanzi: HanziModel;
}

export const handler: Handlers<Data> = {
  GET: (req, ctx) => getHanziDetail(req, ctx),
};

export default function Home(props: PageProps<Data>) {
  const currentPath = decodeURIComponent(props.url.pathname);
  const form = currentPath.substring(currentPath.lastIndexOf("/") + 1);
  const { hanzi } = props.data;

  return (
    <>
      <a href="/hanzi">Back to Hanzi Database</a>
      <div className="h-screen content-center bg-white">
        <div className="flex flex-col items-center">
          <h3 className="text-3xl font-bold">{form}</h3>
          <SolutionWriter character={form} label="Animate" />
          <h6 className="text-left text-lg font-bold underline">
            {hanzi.sound}
          </h6>
          <p className="text-left text-base">
            <ul>
              {hanzi.meaning.split(";").length > 1
                ? hanzi.meaning.split(";").map((elem) => <li>{"• " + elem}</li>)
                : <li>{hanzi.meaning}</li>}
            </ul>
          </p>
          <h6 className="text-left text-lg font-bold underline">
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
