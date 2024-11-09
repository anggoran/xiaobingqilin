import { FreshContext } from "$fresh/server.ts";
import { getLatinList } from "../../controllers/search.ts";

export const handler = async (_req: Request, _ctx: FreshContext) => {
  const url = new URL(_req.url);
  const keyword = url.searchParams.get("keyword")!;

  const data = await getLatinList({ keyword });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
