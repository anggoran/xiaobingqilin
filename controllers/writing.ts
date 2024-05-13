import { FreshContext } from "$fresh/server.ts";

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
