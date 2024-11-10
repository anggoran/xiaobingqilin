import { Signal, signal } from "@preact/signals";
import { SoundButton } from "../../islands/SoundButton.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getListening, postListening } from "../../controllers/listening.ts";
import { PinyinModel, tones } from "../../models/pinyin.ts";
import Autocomplete from "../../islands/Autocomplete.tsx";
import Dropdown from "../../islands/Dropdown.tsx";

interface Data {
  id: number;
  question: string;
  solution: string | null;
  answer: PinyinModel;
  truth: boolean | undefined;
}

export const handler: Handlers<Data> = {
  GET: async (req, ctx) => await getListening(req, ctx),
  POST: async (req, ctx) => await postListening(req, ctx),
};

export default function ListeningPage(props: PageProps<Data>) {
  const { id, question, answer, solution, truth } = props.data;
  const answerState: Signal<PinyinModel> = signal({ latin: "", tone: null });
  return (
    <>
      <a href="/">Back to home</a>
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
          <SoundButton
            sound={question}
            text={solution ? `The solution: ${solution}` : "🔈"}
          />
          {truth !== undefined
            ? (
              <>
                <p>Your answer: {answer}</p>
                <a href="/listening">Continue</a>
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
                <div className="flex flex-row space-x-8">
                  <button form="quiz" type="reset">Clear</button>
                  <button form="quiz" type="submit" formmethod="POST">
                    Submit
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </>
  );
}
