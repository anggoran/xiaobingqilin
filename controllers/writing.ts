import { FreshContext } from "$fresh/server.ts";
import { HanziModel } from "../models/pinyin.ts";
import { readTXT } from "../utils/read-txt.ts";

export const getWriting = (
  _req: Request,
  ctx: FreshContext,
) => {
  return ctx.render();
};

export const postWriting = async (
  req: Request,
  _ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const form = await req.formData();
  const path = form.get("hanzis");
  return Response.redirect(url + "/" + path, 303);
};

export const getWritingQuiz = async (
  req: Request,
  ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const params = {
    quiz: ctx.params["quiz"],
    hanzi: url.searchParams.get("hanzi"),
  };

  const hanziTXT: string[] = await readTXT("hanzis");

  const hanziList = decodeURIComponent(params.quiz).split("");
  const randomNumber = Math.floor(Math.random() * hanziList.length);
  const randomHanzi: HanziModel = JSON.parse(
    hanziTXT.find((e) =>
      e.includes(`"character":"${hanziList[randomNumber]}"`)
    )!,
  );

  let form = randomHanzi.character;
  const sound = randomHanzi.pinyin[0];
  const meaning = randomHanzi.definition;

  if (params.hanzi !== null) {
    const currentHanzi: HanziModel = JSON.parse(
      hanziTXT.find((e) => e.includes(`"character":"${params.hanzi}"`))!,
    );
    form = currentHanzi.character;
  }

  return ctx.render({ form, sound, meaning });
};
