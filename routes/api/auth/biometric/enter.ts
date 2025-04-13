import { Handlers } from "$fresh/server.ts";
import {
	generateAuthenticationOptions,
	GenerateAuthenticationOptionsOpts,
} from "@simplewebauthn/server";
import { WEBAUTHN_CONFIG } from "../../../../utils/webauthn.ts";
import { Surreal } from "@surrealdb/surrealdb";
import { AuthServiceImpl } from "../../../../services/auth.ts";
import { encodeHex } from "$std/encoding/hex.ts";
import { generateFisherToken } from "../../../../utils/fisher-token.ts";
import { ENV } from "../../../../utils/config.ts";

// WebAuthn registration endpoint handler
export const handler: Handlers<unknown, { access: string }> = {
	async POST(req, _ctx) {
		const agent = req.headers.get("user-agent")!;
		const { mac, address: ip } = Deno.networkInterfaces().find((e) => {
			return e.family === "IPv4" && e.mac !== "00:00:00:00:00:00";
		})!;
		const { rpID, timeout, userVerification } = WEBAUTHN_CONFIG;

		const db = new Surreal();
		const auth = new AuthServiceImpl(db);

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await auth.accessSystem();

			const challenge = generateFisherToken(encodeHex(mac + ip));

			const limit = await auth.countVerifier(undefined, { mac, ip });
			if (limit && limit >= 5) {
				return new Response(
					JSON.stringify({ error: "Request exceeded." }),
					{ status: 429 },
				);
			}

			await auth.createVerifier({
				email: undefined,
				challenge,
				accessType: "signin",
				accessMethod: "biometric",
				device: { agent, mac, ip },
			});

			// Create WebAuthn registration options
			const options = await generateAuthenticationOptions({
				rpID, // Domain identifier for the Relying Party
				timeout, // Registration timeout in milliseconds
				userVerification, // Enforces user verification
				challenge: challenge, // should be real challenge
				allowCredentials: [], // should be real credentials
			} as GenerateAuthenticationOptionsOpts);

			return new Response(JSON.stringify(options));
		} catch (error) {
			return new Response(JSON.stringify({ error }), { status: 500 });
		} finally {
			await db.close();
		}
	},
};
