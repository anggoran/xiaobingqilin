import { Cookie } from "$std/http/cookie.ts";

export const constructCookie = (domain: string) => {
  return {
    domain,
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "Lax", // allow for cross-site requests, to satisfy magic link
  } satisfies Partial<Cookie>;
};
