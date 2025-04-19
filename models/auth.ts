import Joi from "npm:joi@17.13.3";

export interface RegistrationModel {
	id: string;
	email: string;
	created_at: string;
	expires_in: { _milliseconds: number };
	is_used: boolean;
}

export interface EmailCountModel {
	count: number;
}

export interface User {
	account_id: string;
	email: string;
	user_name: string | null;
	full_name: string | null;
}

export interface Biometric {
	account_id: string;
	credential_id: string;
	authenticator: string;
	public_key: Uint8Array;
	created_at: Date;
}

export interface Verifier {
	id: string;
	email: string;
	accountID: string;
	challenge: string;
	accessMethod: string;
	accessType: string;
	device: {
		agent: string;
		mac: string;
		ip: string;
	};
	isValid: boolean;
}

export const VerifierRequest = Joi.object<
	Pick<Verifier, "accessType" | "email" | "challenge" | "device">
>({
	accessType: Joi.string().required(),
	email: Joi.string().email().required(),
	challenge: Joi.string().required(),
	device: Joi.object({
		mac: Joi.string().required(),
		ip: Joi.string().required(),
	}).required(),
});
