import { FreshContext } from "$fresh/server.ts";
import { HanziModel, PinyinModel, PinyinPartModel } from "../models/pinyin.ts";
import { readJSON } from "../utils/read-json.ts";

export const getReading = (
  _req: Request,
  ctx: FreshContext,
) => {
  return ctx.render();
};

export const postReading = async (
  req: Request,
  _ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const form = await req.formData();
  const path = form.get("hanzis");
  return Response.redirect(url + "/" + path, 303);
};

export const getReadingQuiz = async (
  req: Request,
  ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const hanziParams = url.searchParams.get("question");
  const answerParams = url.searchParams.get("answer");

  const name = Deno.cwd() + "/static/data/hanzis.txt";
  const text = await Deno.readTextFile(name);
  const array = text.split("\n");

  const pinyins: PinyinModel[] = await readJSON("pinyins");
  const initials: PinyinPartModel[] = await readJSON("initials");
  const finals: PinyinPartModel[] = await readJSON("finals");
  const tones: PinyinPartModel[] = await readJSON("tones");

  const params = ctx.params["quiz"];
  const hanziList = decodeURIComponent(params).split("");
  const randomIndex = Math.floor(Math.random() * hanziList.length);
  const selectedHanzi = hanziParams ?? hanziList[randomIndex];

  const rawQuestion = array.find((e) =>
    e.includes(`"character":"${selectedHanzi}"`)
  )!;
  const hanzi: HanziModel = JSON.parse(rawQuestion);

  const { initial_id, final_id, tone_id } =
    pinyins.find((e) => e.name === answerParams) ??
      { initial_id: 0, final_id: 0, tone_id: 0 };
  const answer = { initial_id, final_id, tone_id };

  let truth = null;

  if (hanziParams !== null && answerParams !== null) {
    const userAnswer = pinyins.find((e) => e.name === answerParams)!;
    truth = hanzi.pinyin[0] === userAnswer.name;
  }

  return ctx.render({ hanzi, answer, truth, pinyins, initials, finals, tones });
};

export const postReadingQuiz = async (
  req: Request,
  _ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const form = await req.formData();
  const question = form.get("question");
  const initial = form.get("initial");
  const final = form.get("final");
  const tone = form.get("tone");

  const pinyins: PinyinModel[] = await readJSON("pinyins");
  const initials: PinyinPartModel[] = await readJSON("initials");
  const finals: PinyinPartModel[] = await readJSON("finals");
  const tones: PinyinPartModel[] = await readJSON("tones");

  const file = Deno.cwd() + "/static/data/hanzis.txt";
  const text = await Deno.readTextFile(file);
  const array = text.split("\n");

  const rawAnswer = {
    initial_id: initials.find((e) => e.name == initial)!.id,
    final_id: finals.find((e) => e.name == final)!.id,
    tone_id: tones.find((e) => e.name == tone)!.id,
  };
  const answer = pinyins.find((e) =>
    e.initial_id === rawAnswer.initial_id &&
    e.final_id === rawAnswer.final_id &&
    e.tone_id === rawAnswer.tone_id
  );
  let answerURI = "N.A.";
  if (answer !== undefined) {
    answerURI = encodeURIComponent(answer.name);
  }

  const rawHanzi = array.find((e) => e.includes(`"character":"${question}"`))!;
  const hanzi: HanziModel = JSON.parse(rawHanzi);
  const questionURI = encodeURIComponent(hanzi.character);

  const params = `question=${questionURI}` + "&" + `answer=${answerURI}`;
  return Response.redirect(`${url}?${params}`, 303);
};
