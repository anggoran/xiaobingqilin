import { Handlers } from "$fresh/server.ts";
import { getReading, postReading } from "../../controllers/reading.ts";

export const handler: Handlers = {
  GET: (req, ctx) => getReading(req, ctx),
  POST: async (req, ctx) => await postReading(req, ctx),
};

export default function ReadingPage() {
  return (
    <>
      <a href="/">Back to home</a>
      <div className="h-screen content-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <form id="quiz">
            <div className="flex flex-row space-x-8">
              <textarea
                name="hanzis"
                placeholder="Enter your hanzi list, without any separator."
              >
              </textarea>
            </div>
          </form>
          <div className="flex flex-row space-x-8">
            <button form="quiz" type="reset">Clear</button>
            <button form="quiz" type="submit" formmethod="POST">Start</button>
          </div>
        </div>
      </div>
    </>
  );
}
