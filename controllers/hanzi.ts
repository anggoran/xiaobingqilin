import { FreshContext } from "$fresh/server.ts";
import { HanziPinyinModel } from "../models/hanzi.ts";
import { supabase } from "../utils/supabase.ts";

export const getHanziList = async (
  _req: Request,
  ctx: FreshContext,
) => {
  const currentPage = parseInt(ctx.url.searchParams.get("page") || "1");
  const contentPerPage = 10;
  const startIndex = (currentPage - 1) * contentPerPage;
  const endIndex = startIndex + contentPerPage - 1;

  const res = await supabase.from("hanzis_pinyins").select(
    `
    id,
    hanzi_id (form, meaning),
    pinyin_id (sound)
  `,
    { count: "exact" },
  )
    .range(startIndex, endIndex).order("hanzi_id (form)", { ascending: true });

  const data = res.data?.map((e) => {
    const hanzi = Array.isArray(e.hanzi_id) ? e.hanzi_id[0] : e.hanzi_id;
    const pinyin = Array.isArray(e.pinyin_id) ? e.pinyin_id[0] : e.pinyin_id;
    return {
      id: e.id,
      hanzi: {
        form: hanzi.form,
        meaning: hanzi.meaning,
      },
      pinyin: {
        sound: pinyin.sound,
      },
    };
  }) as HanziPinyinModel[];

  return ctx.render({
    totalPages: res.count! / contentPerPage,
    hpList: data,
    startOrder: startIndex + 1,
    endOrder: endIndex + 1,
  });
};

export const getHanziDetail = async (
  _req: Request,
  ctx: FreshContext,
) => {
  const id = decodeURIComponent(ctx.params["id"]);

  const res = await supabase.from("hanzis_pinyins").select(
    `
    id, 
    hanzi_id (form, meaning, type, etymology), 
    pinyin_id (sound, latin, tone)
  `,
  ).eq("id", id);

  const data = res.data?.map((e) => {
    const hanzi = Array.isArray(e.hanzi_id) ? e.hanzi_id[0] : e.hanzi_id;
    const pinyin = Array.isArray(e.pinyin_id) ? e.pinyin_id[0] : e.pinyin_id;
    return {
      id: e.id,
      hanzi: {
        form: hanzi.form,
        meaning: hanzi.meaning,
        type: hanzi.type,
        etymology: hanzi.etymology,
      },
      pinyin: {
        sound: pinyin.sound,
        latin: pinyin.latin,
        tone: pinyin.tone,
      },
    };
  }) as HanziPinyinModel[];

  return ctx.render(data[0]);
};
