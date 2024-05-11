import { FreshContext } from "$fresh/server.ts";
import { HanziModel, PinyinModel, PinyinPartModel } from "../models/pinyin.ts";
import { readJSON } from "../utils/read-json.ts";
import { readTXT } from "../utils/read-txt.ts";

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
  const params = {
    quiz: ctx.params["quiz"],
    question: url.searchParams.get("question"),
    answer: url.searchParams.get("answer"),
  };

  const hanziTXT: string[] = await readTXT("hanzis");
  const pinyinJSON: PinyinModel[] = await readJSON("pinyins");
  const initialJSON: PinyinPartModel[] = await readJSON("initials");
  const finalJSON: PinyinPartModel[] = await readJSON("finals");
  const toneJSON: PinyinPartModel[] = await readJSON("tones");

  const hanziList = decodeURIComponent(params.quiz).split("");
  const randomNumber = Math.floor(Math.random() * hanziList.length);
  const randomHanzi: HanziModel = JSON.parse(
    hanziTXT.find((e) =>
      e.includes(`"character":"${hanziList[randomNumber]}"`)
    )!,
  );

  let question = randomHanzi.character;
  let hint = randomHanzi.definition;
  let answer = { initial_id: 0, final_id: 0, tone_id: 0 };
  let solution = null;
  let truth = null;

  if (params.question !== null && params.answer !== null) {
    const currentHanzi: HanziModel = JSON.parse(
      hanziTXT.find((e) => e.includes(`"character":"${params.question}"`))!,
    );
    const currentAnswer = pinyinJSON.find((e) => e.name === params.answer)!;

    question = currentHanzi.character;
    hint = currentHanzi.definition;
    answer = { ...currentAnswer };
    solution = currentHanzi.pinyin[0];
    truth = solution === currentAnswer.name;
  }

  return ctx.render({
    question,
    hint,
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

export const postReadingQuiz = async (
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

  const hanziTXT: string[] = await readTXT("hanzis");
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
