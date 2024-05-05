import { FreshContext } from "$fresh/server.ts";
import { PinyinPartModel } from "../models/pinyin.ts";
import { PinyinModel } from "../models/pinyin.ts";
import { randomize } from "../utils/randomize.ts";
import { readJSON } from "../utils/read-json.ts";

export const getListening = async (
  req: Request,
  ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const questionParams = url.searchParams.get("question");
  const answerParams = url.searchParams.get("answer");
  const truthParams = url.searchParams.get("truth");
  const pinyins: PinyinModel[] = await readJSON("pinyins");
  const initials: PinyinPartModel[] = await readJSON("initials");
  const finals: PinyinPartModel[] = await readJSON("finals");
  const tones: PinyinPartModel[] = await readJSON("tones");
  const question = pinyins.find((e) => e.name === questionParams) ??
    randomize(pinyins);
  const { initial_id, final_id, tone_id } =
    pinyins.find((e) => e.name === answerParams) ??
      { initial_id: 0, final_id: 0, tone_id: 0 };
  const answer = { initial_id, final_id, tone_id };
  const truth = truthParams === "true"
    ? true
    : truthParams === "false"
    ? false
    : null;

  return ctx.render({
    pinyins,
    initials,
    finals,
    tones,
    question,
    answer,
    truth,
  });
};

export const postListening = async (
  req: Request,
  _ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const form = await req.formData();
  const pinyins: PinyinModel[] = await readJSON("pinyins");
  const initials: PinyinPartModel[] = await readJSON("initials");
  const finals: PinyinPartModel[] = await readJSON("finals");
  const tones: PinyinPartModel[] = await readJSON("tones");
  const question_id = form.get("question_id");
  const initial = form.get("initial");
  const final = form.get("final");
  const tone = form.get("tone");
  const question = pinyins.find((e) => e.id.toString() === (question_id!));
  const { initial_id, final_id, tone_id } = question!;
  const solution = { initial_id, final_id, tone_id };
  const answer = {
    initial_id: initials.find((e) => e.name == initial)!.id,
    final_id: finals.find((e) => e.name == final)!.id,
    tone_id: tones.find((e) => e.name == tone)!.id,
  };
  const proposed = pinyins.find((e) =>
    e.initial_id === answer.initial_id &&
    e.final_id === answer.final_id &&
    e.tone_id === answer.tone_id
  );

  const myQuestion = encodeURIComponent(question!.name);
  let myAnswer = "N.A.";

  if (proposed !== undefined) {
    myAnswer = encodeURIComponent(proposed.name);
  }

  const params = `question=${myQuestion}&answer=${myAnswer}&` +
    `truth=${JSON.stringify(solution) === JSON.stringify(answer)}`;
  return Response.redirect(`${url}?${params}`, 303);
};
