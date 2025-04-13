import { Handlers } from "$fresh/server.ts";
import {
	verifyAuthenticationResponse,
	VerifyAuthenticationResponseOpts,
} from "@simplewebauthn/server";
import jwt from "npm:jsonwebtoken@9.0.2";
import { WEBAUTHN_CONFIG } from "../../../../utils/webauthn.ts";
import { AuthenticationResponseJSON } from "@simplewebauthn/types";
import { Surreal } from "@surrealdb/surrealdb";
import { AuthResponse, AuthServiceImpl } from "../../../../services/auth.ts";
import { base64ToString } from "../../../../utils/converter.ts";
import { setCookie } from "$std/http/cookie.ts";
import { constructCookie } from "../../../../utils/cookie.ts";
import { ENV } from "../../../../utils/config.ts";

export const handler: Handlers = {
	async POST(req, _) {
		const url = new URL(req.url);
		const headers = new Headers(req.headers);
		const response = await req.json();
		const entResponse = response.authentication as AuthenticationResponseJSON;
		const {
			expectedRPID,
			expectedOrigin,
			requireUserVerification,
		} = WEBAUTHN_CONFIG;

		const db = new Surreal();
		const auth = new AuthServiceImpl(db);
		let enterResult: AuthResponse;

		try {
			await db.connect(ENV.SURREAL_DB_URL);
			await auth.accessSystem();

			const accountID = base64ToString(entResponse.response.userHandle!);
			const credentialID = entResponse.id;
			const clientDataJSON = base64ToString(
				entResponse.response.clientDataJSON,
			);
			const challenge = base64ToString(JSON.parse(clientDataJSON)["challenge"]);

			const verifier = await auth.verifyVerifier(challenge);
			const biometric = await auth.getBiometric({
				account_id: accountID,
				credential_id: credentialID,
			});

			// Verify WebAuthn registration response
			const verification = await verifyAuthenticationResponse({
				expectedRPID, // Expected Relying Party ID
				expectedOrigin, // Origin of the Relying Party
				requireUserVerification, // Require user verification
				expectedType: "webauthn.get", // Expected response type
				response: entResponse, // WebAuthn registration response
				expectedChallenge: (_) => { // Match the challenge with the database
					if (verifier.isExpired || verifier.isUsed) {
						throw new Error("Challenge is invalid!");
					}
					return true;
				},
				credential: { // Credential to verify
					id: biometric.credential_id, // Credential ID
					publicKey: biometric.public_key, // Public key
					transports: ["internal"], // Transports
				},
			} as VerifyAuthenticationResponseOpts);

			if (!verification.verified) {
				return new Response(
					JSON.stringify({ error: "Authentication is not verified!" }),
					{ status: 400 },
				);
			}

			await auth.updateBiomVerifier({ id: verifier.id, account_id: accountID });
			enterResult = await auth.enterUser(challenge);
			await auth.expireVerifier(verifier.id);
		} catch (error) {
			return new Response(JSON.stringify({ error }), { status: 500 });
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
	},
};
