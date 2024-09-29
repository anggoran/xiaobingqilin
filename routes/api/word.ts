import { FreshContext } from "$fresh/server.ts";
import { getWordList } from "../../controllers/word.ts";

export const handler = async (_req: Request, _ctx: FreshContext) => {
  const url = new URL(_req.url);
  const keyword = url.searchParams.get("keyword")!;
  const scroll = parseInt(url.searchParams.get("scroll")!);

  const data = await getWordList({ keyword, scroll });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
