import { FreshContext, Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
import Surreal from "@surrealdb/surrealdb";
import { ENV } from "../../../utils/config.ts";

export const handler: Handlers = {
	async POST(req: Request, _ctx: FreshContext) {
		const headers = new Headers(req.headers);
		const db = new Surreal();

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await db.invalidate();
		} catch (e) {
			return new Response("Sign out error: " + e, { status: 500 });
		} finally {
			await db.close();
		}

		deleteCookie(headers, "human-access", { path: "/" });
		deleteCookie(headers, "human-refresh", { path: "/" });

		headers.set("location", `/auth/signin`);
		return new Response(null, { status: 303, headers });
	},
};
