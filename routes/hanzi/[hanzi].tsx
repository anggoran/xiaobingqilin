import { PageProps } from "$fresh/server.ts";
import SolutionWriter from "../../islands/SolutionWriter.tsx";

export default function Home(props: PageProps) {
  const currentPath = decodeURIComponent(props.url.pathname);
  const form = currentPath.substring(currentPath.lastIndexOf("/") + 1);
  return (
    <>
      <a href="/hanzi">Back to Hanzi Database</a>
      <div className="h-screen content-center bg-white">
        <div className="flex flex-col items-center">
          <h3 className="text-3xl font-bold">{form}</h3>
          <SolutionWriter character={form} label="Animate" />
          <h6 className="text-left text-lg font-bold underline">wū</h6>
          <p className="text-left text-base">
            <ul>
              <li>• abbr. for Ukraine 烏克蘭|乌克兰[Wu1ke4lan2]</li>
              <li>• surname Wu</li>
            </ul>
          </p>
          <h6 className="text-left text-lg font-bold underline">
            pictographic
          </h6>
          <p className="text-left text-base">
            simplified form of 烏; a crow; compare 鸟
          </p>
        </div>
      </div>
    </>
  );
}
