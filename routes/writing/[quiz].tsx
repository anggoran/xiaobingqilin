import { Handlers, PageProps } from "$fresh/server.ts";
import { signal } from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";
import { getWritingQuiz, WritingQuizProps } from "../../controllers/writing.ts";
import QuizWriter from "./(_islands)/QuizWriter.tsx";
import SolutionWriter from "../../islands/SolutionWriter.tsx";

export const handler: Handlers<WritingQuizProps> = {
  GET: (req, ctx) => getWritingQuiz(req, ctx),
};

export default function WritingPage(props: PageProps<WritingQuizProps>) {
  const { form, meaning, sounds } = props.data;
  const quizState = signal(false);
  const currentURL = decodeURIComponent(props.url.pathname);
  const nextURL = currentURL.replace(form, "");

  return (
    <div className="h-screen content-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p>
            <b>Hint:</b> {meaning}
          </p>
          <b>Question:</b> {sounds.length === 1 ? sounds[0] : sounds.join(", ")}
        </div>
        <form id="quiz">
          <input type="hidden" name="hanzi" value={form} />
          <div className="flex flex-row space-x-8">
            <QuizWriter character={form} hasBegun={quizState} />
            <SolutionWriter character={form} label="Show Solution" />
          </div>
        </form>
        <a href={nextURL}>Continue</a>
      </div>
    </div>
  );
}
