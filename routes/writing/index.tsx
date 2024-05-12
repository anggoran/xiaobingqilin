import QuizWriter from "./(_islands)/QuizWriter.tsx";
import SolutionWriter from "./(_islands)/SolutionWriter.tsx";
import { signal } from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";

export default function WritingPage() {
  const isQuiz = signal(false);
  return (
    <>
      <div className="flex flex-row space-x-4 p-4">
        <QuizWriter hasStarted={isQuiz} />
        <SolutionWriter />
      </div>
    </>
  );
}
