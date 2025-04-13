import { Handlers } from "$fresh/server.ts";
import {
	generateRegistrationOptions,
	GenerateRegistrationOptionsOpts,
} from "@simplewebauthn/server";
import { WEBAUTHN_CONFIG } from "../../../../utils/webauthn.ts";
import { generateFisherToken } from "../../../../utils/fisher-token.ts";
import { encodeHex } from "@std/encoding/hex";
import { Surreal } from "@surrealdb/surrealdb";
import { AuthServiceImpl } from "../../../../services/auth.ts";
import { ENV } from "../../../../utils/config.ts";

export const handler: Handlers<unknown, { access: string }> = {
	async POST(req, ctx) {
		const agent = req.headers.get("user-agent")!;
		const { mac, address: ip } = Deno.networkInterfaces().find((e) => {
			return e.family === "IPv4" && e.mac !== "00:00:00:00:00:00";
		})!;
		const {
			rpID,
			rpName,
			timeout,
			authenticatorSelection,
			attestationType,
			supportedAlgorithmIDs,
		} = WEBAUTHN_CONFIG;

		const db = new Surreal();
		const auth = new AuthServiceImpl(db);
		const accessToken = ctx.state.access;

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await db.authenticate(accessToken);
			const {
				account_id: accountID,
				email,
				user_name,
				full_name,
			} = await auth.fetchUser();
			const credentials = await auth.listBiometric(accountID);

			const WebauthnUUID = new TextEncoder().encode(accountID);
			const challenge = generateFisherToken(encodeHex(user_name!));
			const excludedCredentials = credentials.map((e) => ({
				id: e.credential_id,
			}));

			await db.invalidate();
			await auth.accessSystem();

			const limit = await auth.countVerifier(email, { mac, ip });
			if (limit && limit >= 5) {
				return new Response(
					JSON.stringify({ error: "Request exceeded." }),
					{ status: 429 },
				);
			}

			await auth.createVerifier({
				email,
				accountID,
				challenge,
				accessType: "signup",
				accessMethod: "biometric",
				device: { agent, mac, ip },
			});

			// Create WebAuthn registration options
			const options = await generateRegistrationOptions({
				rpID, // Domain identifier for the Relying Party
				rpName, // Name shown during WebAuthn prompts
				timeout, // Registration timeout in milliseconds
				authenticatorSelection, // Advanced criteria for restricting the types of authenticators that may be used
				attestationType, // Defines attestation statement generation
				supportedAlgorithmIDs, // ES256 (ECDSA P-256 with SHA-256)
				userID: WebauthnUUID, // **(Optional)** - User's website-specific unique ID. Defaults to generating a random identifier
				userName: user_name, // - User's website-specific username (email, etc)
				userDisplayName: full_name, // - User's human-readable display name
				challenge: challenge, // **(Optional)** - Random value the authenticator needs to sign and pass back. Defaults to generating a random value
				excludeCredentials: excludedCredentials, // **(Optional)** - List of credentials to exclude from the list of acceptable credentials
			} as GenerateRegistrationOptionsOpts);

			return new Response(JSON.stringify(options));
		} catch (error) {
			return new Response(JSON.stringify({ error }), { status: 500 });
		} finally {
			await db.close();
		}
	},
};
