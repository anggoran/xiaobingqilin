import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";
import * as listening from "./listening.ts";
import * as reading from "./reading.ts";

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
