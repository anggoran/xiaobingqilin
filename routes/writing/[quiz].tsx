import { Handlers, PageProps } from "$fresh/server.ts";
import { signal } from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";
import { getWritingQuiz } from "../../controllers/writing.ts";
import QuizWriter from "./(_islands)/QuizWriter.tsx";
import SolutionWriter from "./(_islands)/SolutionWriter.tsx";

interface Data {
  form: string;
  sound: string;
  meaning: string;
}

export const handler: Handlers<Data> = {
  GET: (req, ctx) => getWritingQuiz(req, ctx),
};

export default function WritingPage(props: PageProps<Data>) {
  const currentURL = decodeURIComponent(props.url.pathname);
  const { form, sound, meaning } = props.data;
  const nextURL = currentURL.replace(form, "");

  const quizHasBegun = signal(false);

  return (
    <div className="h-screen content-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p>
            <b>Hint:</b> {meaning}
          </p>
          <b>Question:</b> {sound}
        </div>
        <form id="quiz">
          <input type="hidden" name="hanzi" value={form} />
          <div className="flex flex-row space-x-8">
            <QuizWriter character={form} hasBegun={quizHasBegun} />
            <SolutionWriter character={form} />
          </div>
        </form>
        <a href={nextURL}>Continue</a>
      </div>
    </div>
  );
}
