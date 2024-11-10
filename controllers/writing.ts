import { FreshContext } from "$fresh/server.ts";
import { supabase } from "../utils/supabase.ts";

export interface WritingQuizProps {
  form: string;
  meaning: string;
  sounds: string[];
}

interface HanziPinyinData {
  id: string;
  hanzi: {
    form: string;
    meaning: string;
  };
  pinyin: {
    sound: string;
  };
}

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

  const hanziList = decodeURIComponent(params.quiz).split("");
  const randomNumber = Math.floor(Math.random() * hanziList.length);
  const res = await supabase.from("hanzis_pinyins")
    .select("id, hanzi:hanzis!inner (form, meaning), pinyin:pinyin_id (sound)")
    .eq("hanzis.form", hanziList[randomNumber])
    .returns<HanziPinyinData[]>();

  const [{ hanzi }] = res.data!;
  const sounds = res.data!.map(({ pinyin: { sound } }) => sound);
  const props: WritingQuizProps = { ...hanzi, sounds };

  return ctx.render(props);
};
