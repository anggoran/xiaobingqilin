import { FreshContext } from "$fresh/server.ts";
import { HanziModel, PinyinPartModel } from "../models/pinyin.ts";
import { PinyinModel } from "../models/pinyin.ts";
import { readJSON } from "../utils/read-json.ts";
import { readTXT } from "../utils/read-txt.ts";

export const getListening = async (
  req: Request,
  ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const params = {
    question: url.searchParams.get("question"),
    answer: url.searchParams.get("answer"),
  };

  const hanziTXT: string[] = await readTXT("unihan");
  const pinyinJSON: PinyinModel[] = await readJSON("pinyins");
  const initialJSON: PinyinPartModel[] = await readJSON("initials");
  const finalJSON: PinyinPartModel[] = await readJSON("finals");
  const toneJSON: PinyinPartModel[] = await readJSON("tones");

  const randomNumber = Math.floor(Math.random() * hanziTXT.length);
  const randomHanzi: HanziModel = JSON.parse(hanziTXT[randomNumber]);

  let question = randomHanzi.character;
  let answer = { initial_id: 0, final_id: 0, tone_id: 0 };
  let solution = null;
  let truth = null;

  if (params.question !== null && params.answer !== null) {
    const currentHanzi: HanziModel = JSON.parse(
      hanziTXT.find((e) => e.includes(`"character":"${params.question}"`))!,
    );
    const currentAnswer = pinyinJSON.find((e) => e.name === params.answer)!;

    question = currentHanzi.character;
    answer = { ...currentAnswer };
    solution = currentHanzi.pinyin[0];
    truth = solution === currentAnswer.name;
  }

  return ctx.render({
    question,
    answer,
    solution,
    truth,
    options: {
      pinyins: pinyinJSON,
      initials: initialJSON,
      finals: finalJSON,
      tones: toneJSON,
    },
  });
};

export const postListening = async (
  req: Request,
  _ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const form = await req.formData();
  const entries = {
    question: form.get("question"),
    initial: form.get("initial"),
    final: form.get("final"),
    tone: form.get("tone"),
  };

  const hanziTXT: string[] = await readTXT("unihan");
  const pinyinJSON: PinyinModel[] = await readJSON("pinyins");
  const initialJSON: PinyinPartModel[] = await readJSON("initials");
  const finalJSON: PinyinPartModel[] = await readJSON("finals");
  const toneJSON: PinyinPartModel[] = await readJSON("tones");

  const rawHanzi = hanziTXT.find((e) =>
    e.includes(`"character":"${entries.question}"`)
  )!;
  const hanzi: HanziModel = JSON.parse(rawHanzi);
  const questionURI = encodeURIComponent(hanzi.character);

  const rawAnswer = {
    initial_id: initialJSON.find((e) => e.name == entries.initial)!.id,
    final_id: finalJSON.find((e) => e.name == entries.final)!.id,
    tone_id: toneJSON.find((e) => e.name == entries.tone)!.id,
  };
  const answer = pinyinJSON.find((e) =>
    e.initial_id === rawAnswer.initial_id &&
    e.final_id === rawAnswer.final_id &&
    e.tone_id === rawAnswer.tone_id
  );
  const answerURI = encodeURIComponent(answer?.name ?? "N.A.");

  const params = `question=${questionURI}` + "&" + `answer=${answerURI}`;
  return Response.redirect(`${url}?${params}`, 303);
};
