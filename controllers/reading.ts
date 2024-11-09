import { FreshContext } from "$fresh/server.ts";
import { supabase } from "../utils/supabase.ts";

export interface ReadingQuizProps {
  id: string;
  question: string;
  answer: string | undefined;
  hint: string;
  solutions: string[];
  truth: boolean | undefined;
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

interface HanziData {
  id: string;
  form: string;
  meaning: string;
}

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
    question: url.searchParams.get("q_id"),
    answer: url.searchParams.get("a"),
  };

  let props: ReadingQuizProps;
  let truth: boolean | undefined;

  if (params.answer) {
    const res = await supabase.from("hanzis_pinyins")
      .select("id, hanzi:hanzi_id (form, meaning), pinyin:pinyin_id (sound)")
      .eq("hanzi_id", parseInt(params.question!))
      .returns<HanziPinyinData[]>();
    const [{ hanzi: { form, meaning } }] = res.data!;
    const solutions = res.data!.map(({ pinyin: { sound } }) => sound);
    truth = solutions.includes(params.answer);
    props = {
      id: params.question!,
      question: form,
      hint: meaning,
      solutions,
      answer: params.answer,
      truth,
    };
  } else {
    const hanziList = decodeURIComponent(params.quiz).split("");
    const randomNumber = Math.floor(Math.random() * hanziList.length);
    const res = await supabase.from("hanzis")
      .select("id, form, meaning")
      .eq("form", hanziList[randomNumber])
      .returns<HanziData>()
      .single();
    const { id, form, meaning } = res.data!;
    props = {
      id,
      question: form,
      hint: meaning,
      solutions: [],
      answer: undefined,
      truth: undefined,
    };
  }
  return ctx.render(props);
};

export const postReadingQuiz = async (
  req: Request,
  _ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const form = await req.formData();
  const entries = {
    q_id: form.get("q_id"),
    latin: form.get("latin"),
    tone: form.get("tone"),
  };

  const { data } = await supabase.from("pinyins")
    .select("sound")
    .eq("latin", entries.latin).eq("tone", entries.tone)
    .single();
  const questionURI = encodeURIComponent(entries.q_id as string);
  const answerURI = encodeURIComponent(data?.sound ?? "N.A.");

  const params = `q_id=${questionURI}` + "&" + `a=${answerURI}`;
  return Response.redirect(`${url}?${params}`, 303);
};
