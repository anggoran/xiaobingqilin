import * as path from "$std/path/mod.ts";
import { encodeBase64Url } from "@std/encoding/base64url";
import { Surreal } from "@surrealdb/surrealdb";
import { VerifierRequest } from "../../models/auth.ts";
import { AuthServiceImpl } from "../../services/auth.ts";
import { sendMail } from "../../services/email.ts";
import { ENV } from "../../utils/config.ts";

export const postSendMail = async (
	req: Request,
) => {
	const headers = new Headers(req.headers);
	const body = await req.json();

	const { value, error } = VerifierRequest.validate(body);
	if (error) return new Response("Invalid request.", { status: 400 });
	const { accessType, email, challenge, device: { mac, ip } } = value;

	const db = new Surreal();
	const auth = new AuthServiceImpl(db);

	try {
		await db.connect(ENV.SURREAL_DB_URL);
		await auth.accessSystem();

		const limit = await auth.countVerifier(email, { mac, ip });
		if (limit && limit >= 5) {
			return new Response("Request exceeded.", { status: 429 });
		}

		const base64url_token = encodeBase64Url(challenge);

		// Determine the base URL based on the destination header
		const destination = headers.get("destination");
		const protocol = destination?.startsWith("localhost") ? "http" : "https";
		const baseURL = `${protocol}://${destination}`;

		// Read and customize email template
		const contentPath = path.join(Deno.cwd(), "static", "email.html");
		const content = await Deno.readTextFile(contentPath);
		const link = `${baseURL}/auth/${accessType}?verify=${base64url_token}`;
		const html = content.replace("{{link_to_app}}", link);

		// Send the email
		await sendMail(email, html);
	} catch (e) {
		return new Response("Email error: " + e, { status: 500 });
	} finally {
		await db.close();
	}

	return new Response(challenge, { status: 201 });
};
