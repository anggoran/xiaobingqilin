import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";
import * as listening from "./listening.ts";
import * as reading from "./reading.ts";
import * as writing from "./writing.ts";
import * as hanzi from "./hanzi.ts";
import * as word from "./word.ts";

export const CONNECTION: ServeHandlerInfo = {
  remoteAddr: { hostname: "localhost", port: 8000, transport: "tcp" },
};
export const handler = await createHandler(manifest, config);

Deno.test("Feature: Listening Pinyin", async (t) => {
  await t.step("Get the question", listening.getQuestion);
  await t.step("Post the answer", listening.postAnswer);
  await t.step("Get the correct state", listening.getCorrectState);
  await t.step("Get the false state", listening.getFalseState);
});

Deno.test("Feature: Reading Hanzi", async (t) => {
  await t.step("Render creation form", reading.renderCreationForm);
  await t.step("Start a quiz", reading.startQuiz);
  await t.step("Post the answer", reading.postAnswer);
  await t.step("Get correct state", reading.getCorrectState);
  await t.step("Get false state", reading.getFalseState);
});

Deno.test("Feature: Writing Hanzi", async (t) => {
  await t.step("Render creation form", writing.renderCreationForm);
  await t.step("Start a quiz", writing.startQuiz);
  await t.step("Get a quiz writer", writing.getQuizWriter);
  await t.step("Get a solution writer", writing.getSolutionWriter);
});

Deno.test("Feature: Hanzi Database", async (t) => {
  await t.step("Show Hanzi List Page", hanzi.getHanziList);
  await t.step("Show Hanzi Detail Page", hanzi.getHanziDetail);
});

Deno.test("Feature: Word Database", async (t) => {
  await t.step("Show Search Form", word.getSearchPage);
  await t.step("Show Search Result", word.getSearchResult);
});
