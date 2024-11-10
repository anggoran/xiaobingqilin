import { Handlers, PageProps } from "$fresh/server.ts";
import { Signal, signal } from "@preact/signals-core";
import {
  getReadingQuiz,
  postReadingQuiz,
  ReadingQuizProps,
} from "../../controllers/reading.ts";
import Dropdown from "../../islands/Dropdown.tsx";
import { PinyinModel, tones } from "../../models/pinyin.ts";
import Autocomplete from "../../islands/Autocomplete.tsx";

export const handler: Handlers<ReadingQuizProps> = {
  GET: async (req, ctx) => await getReadingQuiz(req, ctx),
  POST: async (req, ctx) => await postReadingQuiz(req, ctx),
};

export default function ReadingQuizPage(props: PageProps<ReadingQuizProps>) {
  const { id, question, hint, answer, solutions, truth } = props.data;
  const answerState: Signal<PinyinModel> = signal({ latin: "", tone: null });
  const currentURL = decodeURIComponent(props.url.pathname);
  const nextURL = currentURL.replace(question, "");
  return (
    <div
      className={`h-screen content-center ${
        truth === true
          ? "bg-green-300"
          : truth === false
          ? "bg-red-300"
          : "bg-white"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center space-y-2">
          <p>
            <b>Hint:</b> {hint}
          </p>
          <p>
            <b>Question:</b> {question}
          </p>
          {truth !== undefined
            ? (
              <>
                <p>
                  <b>The solution:</b>{" "}
                  {solutions.length === 1 ? solutions[0] : solutions.join(", ")}
                </p>
                <p>
                  <b>Your answer:</b> {answer}
                </p>
                <div className="mt-4">
                  <a href={nextURL}>Continue</a>
                </div>
              </>
            )
            : (
              <>
                <form id="quiz">
                  <input type="hidden" name="q_id" value={id} />
                  <div className="flex flex-row space-x-8">
                    <Autocomplete
                      props={{
                        field: "latin",
                        endpoint: `/api/latin?keyword=`,
                        state: answerState,
                      }}
                    />
                    <Dropdown
                      props={{
                        field: "tone",
                        options: tones,
                        state: answerState,
                      }}
                    />
                  </div>
                </form>
                <div className="flex flex-row justify-center space-x-8">
                  <button form="quiz" type="reset">Clear</button>
                  <button form="quiz" type="submit" formmethod="POST">
                    Submit
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
