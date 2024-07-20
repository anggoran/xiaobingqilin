import { FreshContext } from "$fresh/server.ts";
import { HanziModel } from "../models/hanzi.ts";
import { supabase } from "../utils/supabase.ts";

export const getHanziList = async (
  _req: Request,
  ctx: FreshContext,
) => {
  const currentPage = parseInt(ctx.url.searchParams.get("page") || "1");
  const contentPerPage = 10;
  const startIndex = (currentPage - 1) * contentPerPage;
  const endIndex = startIndex + contentPerPage - 1;

  const res = await supabase
    .from("hanzis")
    .select("*", { count: "exact" })
    .range(startIndex, endIndex).order("form", { ascending: true });
  const data = res.data as HanziModel[];

  return ctx.render({
    totalPages: res.count! / contentPerPage,
    hanziList: data,
  });
};

export const getHanziDetail = async (
  _req: Request,
  ctx: FreshContext,
) => {
  const form = decodeURIComponent(ctx.params["hanzi"]);
  const res = await supabase.from("hanzis").select("*").eq("form", form);
  const data = res.data as HanziModel[];

  return ctx.render({ hanzi: data[0] });
};
