import { FreshContext } from "$fresh/server.ts";
import { Surreal } from "@surrealdb/surrealdb";
import { Biometric, User } from "../models/auth.ts";
import { AuthServiceImpl } from "../services/auth.ts";

export const getProfile = async (
	req: Request,
	ctx: FreshContext<{ connection: Surreal }>,
) => {
	const headers = new Headers(req.headers);

	const db = ctx.state.connection;
	const auth = new AuthServiceImpl(db);

	let user: User | undefined;
	let biom: Biometric[] | undefined;

	try {
		user = await auth.fetchUser();
		biom = await auth.listBiometric(user.account_id);
	} catch (e) {
		return new Response("Error: " + e, { status: 500 });
	} finally {
		await db.close();
	}

	return ctx.render({ user: { ...user }, biom }, { headers });
};

export const postProfile = async (
	req: Request,
	ctx: FreshContext<{ connection: Surreal }>,
) => {
	const form = await req.formData();
	const username = form.get("username") as string;
	const fullname = form.get("fullname") as string;

	const db = ctx.state.connection;
	const auth = new AuthServiceImpl(db);

	try {
		await auth.updateUser({ username, fullname });
	} catch (e) {
		return new Response("Error: " + e, { status: 500 });
	} finally {
		await db.close();
	}

	return Response.redirect(ctx.url, 303);
};
