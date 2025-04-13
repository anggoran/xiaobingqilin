import { Handlers } from "$fresh/server.ts";
import {
	verifyRegistrationResponse,
	VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import { WEBAUTHN_CONFIG } from "../../../../utils/webauthn.ts";
import { RegistrationResponseJSON } from "@simplewebauthn/types";
import { Surreal } from "@surrealdb/surrealdb";
import { AuthServiceImpl } from "../../../../services/auth.ts";
import { decodeBase64 } from "@std/encoding";
import { Biometric } from "../../../../models/auth.ts";
import { ENV } from "../../../../utils/config.ts";

export const handler: Handlers<unknown, { access: string }> = {
	async POST(req, ctx) {
		const headers = new Headers(req.headers);
		const response = await req.json();
		const regResponse = response.registration as RegistrationResponseJSON;
		const {
			expectedRPID,
			expectedOrigin,
			requireUserPresence,
			requireUserVerification,
			supportedAlgorithmIDs,
		} = WEBAUTHN_CONFIG;

		const db = new Surreal();
		const auth = new AuthServiceImpl(db);
		const accessToken = ctx.state.access;

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await db.authenticate(accessToken);
			const { account_id } = await auth.fetchUser();

			await db.invalidate();
			await auth.accessSystem();

			// Verify WebAuthn registration response
			const verification = await verifyRegistrationResponse({
				expectedRPID, // Domain identifier for the Relying Party
				expectedOrigin, // Origin of the Relying Party
				requireUserPresence, // Require user presence
				requireUserVerification, // Require user verification
				supportedAlgorithmIDs, // Supported cryptographic algorithms
				expectedType: "webauthn.create", // Expected response type
				response: regResponse, // WebAuthn registration response
				expectedChallenge: async (undecoded) => { // Match the challenge with the database
					const challenge = new TextDecoder().decode(decodeBase64(undecoded));
					const {
						id,
						isExpired,
						isUsed,
					} = await auth.verifyVerifier(challenge);
					if (isExpired || isUsed) throw new Error("Challenge is invalid!");
					await auth.expireVerifier(id);
					return true;
				},
			} as VerifyRegistrationResponseOpts);

			if (!verification.verified) {
				return new Response(
					JSON.stringify({ error: "Registration is not verified!" }),
					{ status: 400 },
				);
			}
			const { credential, aaguid } = verification.registrationInfo!;

			let authenticator: string;
			const aaguidJSON = await Deno.readTextFile("static/data/aaguid.json");
			const aaguidMap = JSON.parse(aaguidJSON);

			if (!aaguidMap[aaguid]) {
				authenticator = "Unknown Authenticator"; // TODO: it should only works on development!
			} else {
				authenticator = aaguidMap[aaguid].name;
			}

			await auth.registerBiometric({
				account_id: account_id,
				credential_id: credential.id,
				public_key: credential.publicKey,
				authenticator,
			} as Biometric);

			headers.set("location", `/profile`);
			return new Response(null, { status: 303, headers });
		} catch (error) {
			return new Response(JSON.stringify({ error }), { status: 500 });
		} finally {
			await db.close();
		}
	},
};
