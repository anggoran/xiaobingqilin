import { WordModel } from "../models/hanzi.ts";
import { supabase } from "../utils/supabase.ts";

export const getLatinList = async ({ keyword }: { keyword: string }) => {
  const { data } = await supabase.rpc("latin_search", { search_term: keyword });
  return data!.map((e: { latin: string }) => e.latin);
};

export const getWordList = async (
  { keyword, scroll }: { keyword: string; scroll: number },
) => {
  const contentPerScroll = 10;
  const { data, count } = await supabase.rpc("word_algo", {
    search_term: keyword,
    offset_value: (scroll - 1) * contentPerScroll,
    limit_value: contentPerScroll,
  }, { count: "exact" });
  return { word: data as WordModel[], count };
};
