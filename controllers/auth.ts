import { setCookie } from "$std/http/cookie.ts";
import { FreshContext } from "$fresh/server.ts";
import jwt from "npm:jsonwebtoken@9.0.2";
import Surreal from "@surrealdb/surrealdb";
import { constructCookie } from "../utils/cookie.ts";
import { AuthResponse, AuthServiceImpl } from "../services/auth.ts";
import { decodeBase64Url } from "@std/encoding/base64url";
import { ENV } from "../utils/config.ts";
import { generateFisherToken } from "../utils/fisher-token.ts";
import { denokv } from "../utils/queue.ts";
import { base64URLToString } from "../utils/converter.ts";

export const getSignIn = async (
	req: Request,
	ctx: FreshContext,
) => {
	const url = new URL(req.url);
	const headers = new Headers(req.headers);
	const email = url.searchParams.get("email");
	const challengeURL = url.searchParams.get("verify");

	if (challengeURL) {
		const db = new Surreal();
		const auth = new AuthServiceImpl(db);
		let enterResult: AuthResponse;

		const challenge = new TextDecoder().decode(decodeBase64Url(challengeURL));

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await auth.accessSystem();

			const verifyResult = await auth.verifyVerifier(challenge);
			const { id, isExpired, isUsed } = verifyResult;

			if (isExpired || isUsed) {
				return new Response("Token is invalid.", { status: 403 });
			}

			enterResult = await auth.enterUser(challenge);
			await auth.expireVerifier(id);
		} catch (e) {
			return new Response("Auth error: " + e, { status: 500 });
		} finally {
			await db.close();
		}

		const { accessToken, refreshToken } = enterResult;
		const payload = jwt.verify(accessToken, "secret");

		const domain = headers.get("x-forwarded-host") ?? url.hostname;

		setCookie(headers, {
			name: "human-access",
			value: accessToken,
			expires: new Date(payload.exp * 1000),
			...constructCookie(domain),
		});

		setCookie(headers, {
			name: "human-refresh",
			value: refreshToken,
			expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
			...constructCookie(domain),
		});

		headers.set("location", `/`);
		return new Response(null, { status: 303, headers });
	}

	return ctx.render!({ usermail: email });
};

export const postSignIn = async (
	req: Request,
	ctx: FreshContext,
) => {
	const url = new URL(req.url);
	const headers = new Headers(req.headers);
	const form = await req.formData();
	const email = form.get("usermail")!.toString();

	const agent = headers.get("user-agent");
	if (!agent) return new Response("Invalid page visit.", { status: 400 });
	const { mac, address: ip } = Deno.networkInterfaces().find((e) => {
		return e.family === "IPv4" && e.mac !== "00:00:00:00:00:00";
	})!;

	const db = new Surreal();
	const auth = new AuthServiceImpl(db);
	await db.connect(ENV.SURREAL_DB_URL);
	await auth.accessSystem();

	let countResult: number | undefined;

	try {
		countResult = await auth.countUser(email);
		if (!countResult) return ctx.render({ error: "⚠: user isn't exist." });

		const accessType = "signin";
		const challenge = generateFisherToken(email);
		const redirect = headers.get("x-forwarded-host") ?? url.host;

		await denokv.enqueue({
			type: "send-signin-mail",
			value: {
				redirect,
				email,
				challenge,
				device: { mac, ip },
			},
		});

		await auth.createVerifier({
			email,
			challenge,
			accessType,
			accessMethod: "magic",
			device: { agent, mac, ip },
		});
	} catch (e) {
		return new Response("Auth error: " + e, { status: 500 });
	} finally {
		await db.close();
	}

	headers.set("location", "/auth/signin?email=" + email);
	return new Response(null, { status: 303, headers });
};

export const getSignUp = async (
	req: Request,
	ctx: FreshContext,
) => {
	const url = new URL(req.url);
	const headers = new Headers(req.headers);
	const email = url.searchParams.get("email");
	const challengeURL = url.searchParams.get("verify");

	if (challengeURL) {
		const db = new Surreal();
		const auth = new AuthServiceImpl(db);
		let registerResult: AuthResponse;

		const challenge = base64URLToString(challengeURL);

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await auth.accessSystem();

			const verifyResult = await auth.verifyVerifier(challenge);
			const { id, email, isExpired, isUsed } = verifyResult;

			if (isExpired || isUsed) {
				return new Response("Token is invalid.", { status: 403 });
			}

			registerResult = await auth.registerUser(email);
			await auth.expireVerifier(id);
		} catch (e) {
			return new Response("Auth error: " + e, { status: 500 });
		} finally {
			await db.close();
		}

		const { accessToken, refreshToken } = registerResult;
		const payload = jwt.verify(accessToken, "secret");

		const domain = headers.get("x-forwarded-host") ?? url.hostname;

		setCookie(headers, {
			name: "human-access",
			value: accessToken,
			expires: new Date(payload.exp * 1000),
			...constructCookie(domain),
		});

		setCookie(headers, {
			name: "human-refresh",
			value: refreshToken,
			expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
			...constructCookie(domain),
		});

		headers.set("location", `/profile`);
		return new Response(null, { status: 303, headers });
	}

	return ctx.render!({ usermail: email });
};

export const postSignUp = async (
	req: Request,
	ctx: FreshContext,
) => {
	const url = new URL(req.url);
	const headers = new Headers(req.headers);
	const form = await req.formData();
	const email = form.get("usermail")!.toString();

	const agent = req.headers.get("user-agent");
	if (!agent) return new Response("Invalid page visit.", { status: 400 });
	const { mac, address: ip } = Deno.networkInterfaces().find((e) => {
		return e.family === "IPv4" && e.mac !== "00:00:00:00:00:00";
	})!;

	let countResult: number | undefined;

	const db = new Surreal();
	const auth = new AuthServiceImpl(db);
	await db.connect(ENV.SURREAL_DB_URL);
	await auth.accessSystem();

	try {
		countResult = await auth.countUser(email);
		if (countResult) return ctx.render({ error: "⚠: email is already exist." });

		const accessType = "signup";
		const challenge = generateFisherToken(email);
		const redirect = headers.get("x-forwarded-host") ?? url.host;

		await denokv.enqueue({
			type: "send-signup-mail",
			value: {
				redirect,
				email,
				challenge,
				device: { mac, ip },
			},
		});
		console.log("[ROUTE] task is enqueued!");

		await auth.createVerifier({
			email,
			challenge,
			accessType,
			accessMethod: "magic",
			device: { agent, mac, ip },
		});
	} catch (e) {
		return new Response("Auth error: " + e, { status: 500 });
	}

	headers.set("location", "/auth/signup?email=" + email);
	return new Response(null, { status: 303, headers });
};
