import { FreshContext } from "$fresh/server.ts";
import { supabase } from "../utils/supabase.ts";

export const getListening = async (
  req: Request,
  ctx: FreshContext,
) => {
  const url = new URL(req.url);
  const params = {
    question: url.searchParams.get("q_id"),
    answer: url.searchParams.get("a"),
  };

  let hp: { id: string; form: string | null; sound: string | null };
  let truth: boolean | undefined;

  if (params.answer) {
    const { data } = await supabase.from("hanzis_pinyins")
      .select("id, hanzi:hanzi_id (form), pinyin:pinyin_id (sound)")
      .eq("id", params.question)
      .single();
    const hanzi = Array.isArray(data!.hanzi) ? data!.hanzi[0] : data!.hanzi;
    const pinyin = Array.isArray(data!.pinyin) ? data!.pinyin[0] : data!.pinyin;
    hp = { id: data!.id, form: hanzi.form, sound: pinyin.sound };
    truth = pinyin.sound === params.answer;
  } else {
    const { count } = await supabase.from("hanzis_pinyins")
      .select("*", { count: "exact" });
    const randomNumber = Math.floor(Math.random() * count!);
    const { data } = await supabase.from("hanzis_pinyins")
      .select("id, hanzi:hanzi_id (form)")
      .eq("id", randomNumber)
      .single();
    const hanzi = Array.isArray(data!.hanzi) ? data!.hanzi[0] : data!.hanzi;
    hp = { id: data!.id, form: hanzi.form, sound: null };
  }

  return ctx.render({
    id: hp.id,
    question: hp.form,
    solution: hp.sound,
    answer: params.answer,
    truth,
  });
};

export const postListening = async (
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

export const getLatinList = async ({ keyword }: { keyword: string }) => {
  const { data } = await supabase.rpc("latin_search", { search_term: keyword });
  return data!.map((e: { latin: string }) => e.latin);
};
