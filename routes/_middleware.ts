import Surreal from "@surrealdb/surrealdb";
import jwt from "npm:jsonwebtoken@9.0.2";
import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { constructCookie } from "../utils/cookie.ts";
import { AuthServiceImpl } from "../services/auth.ts";
import { ENV } from "../utils/config.ts";

export interface State {
	access: string;
	connection: Surreal;
}

export async function handler(
	req: Request,
	ctx: FreshContext<State>,
) {
	const url = new URL(req.url);
	const headers = new Headers(req.headers);
	const cookies = getCookies(headers);

	const accessToken = cookies["human-access"];
	const refreshToken = cookies["human-refresh"];

	if (ctx.destination !== "route") return await ctx.next();

	if (url.pathname.startsWith("/api")) {
		ctx.state.access = accessToken;
		return await ctx.next();
	}

	if (url.pathname.startsWith("/auth")) {
		if (accessToken && refreshToken) return Response.redirect(url.origin, 302);
		return await ctx.next();
	}

	switch (true) {
		case Boolean(!accessToken && !refreshToken):
			headers.set("location", "/auth/signin");
			return new Response(null, { status: 303, headers });
		case Boolean(accessToken && !refreshToken):
			return new Response("Invalid access, please wait.", { status: 403 });
		case Boolean(!accessToken && refreshToken): {
			const db = new Surreal();
			const auth = new AuthServiceImpl(db);

			const data = await auth.refreshUser(refreshToken);

			await db.connect(ENV.SURREAL_DB_URL);
			await db.authenticate(data.accessToken);
			ctx.state.connection = db;

			const payload = jwt.verify(data.accessToken, ENV.SURREAL_AUTH_SECRET);
			const response = await ctx.next();

			const domain = headers.get("x-forwarded-host") ?? url.hostname;

			setCookie(response.headers, {
				name: "human-access",
				value: data.accessToken,
				expires: new Date(payload.exp * 1000),
				...constructCookie(domain),
			});
			setCookie(response.headers, {
				name: "human-refresh",
				value: data.refreshToken,
				expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
				...constructCookie(domain),
			});

			return response;
		}
	}

	const db = new Surreal();
	await db.connect(ENV.SURREAL_DB_URL);
	await db.authenticate(accessToken);
	ctx.state.connection = db;

	return await ctx.next();
}
