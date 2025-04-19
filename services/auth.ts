import Surreal from "@surrealdb/surrealdb";
import { Biometric, RegistrationModel, User } from "../models/auth.ts";
import { ENV } from "../utils/config.ts";

export interface VerifyMagicResponse {
	id: string;
	email: string;
	isExpired: boolean;
	isUsed: boolean;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
}

type AccessMethod = "magic" | "biometric";
type AccessType = "signup" | "signin";
type Device = { agent: string; mac: string; ip: string };

abstract class AuthService {
	abstract accessSystem(): Promise<string>;
	abstract countUser(email: string | undefined): Promise<number | undefined>;
	abstract countVerifier(
		email: string,
		_: { mac: string; ip: string },
	): Promise<number | undefined>;
	abstract createVerifier(
		_: {
			email?: string;
			accountID?: string;
			challenge: string;
			accessType: AccessType;
			accessMethod: AccessMethod;
			device: Device;
		},
	): Promise<void>;
	// [TODO] transform this to a function: db.run("verifyVerifier", { challenge })
	abstract verifyVerifier(challenge: string): Promise<VerifyMagicResponse>;
	abstract updateBiomVerifier(
		_: { id: string; account_id: string },
	): Promise<void>;
	abstract expireVerifier(id: string): Promise<void>;
	abstract registerUser(email: string): Promise<AuthResponse>;
	abstract enterUser(challenge: string): Promise<AuthResponse>;
	abstract refreshUser(refreshToken: string): Promise<AuthResponse>;
	abstract fetchUser(): Promise<User>;
	abstract updateUser(_: { username: string; fullname: string }): Promise<void>;
	abstract listBiometric(account_id: string): Promise<Biometric[]>;
	abstract registerBiometric(biom: Biometric): Promise<void>;
	abstract getBiometric(
		_: { account_id: string; credential_id: string },
	): Promise<Biometric>;
}

export class AuthServiceImpl implements AuthService {
	private readonly db: Surreal;
	private readonly url: string;

	constructor(db: Surreal) {
		this.db = db;
		this.url = ENV.SURREAL_DB_URL.replace("ws", "http");
	}

	async accessSystem() {
		return await this.db.signin({
			namespace: "webapp",
			database: "dev",
			username: ENV.SURREAL_SYSTEM_USER,
			password: ENV.SURREAL_SYSTEM_PASS,
		});
	}

	async countUser(email: string) {
		const [[res]] = await this.db.query<{ count: number }[][] | undefined[][]>(
			"SELECT count() FROM users WHERE email = $email",
			{ email },
		);
		return res?.count;
	}

	// TODO: typecheck params
	async countVerifier(
		email: string | undefined,
		{ mac, ip }: { mac: string; ip: string },
	) {
		const [[res]] = await this.db.query<{ count: number }[][] | undefined[][]>(
			`
      SELECT count() FROM verifiers
      WHERE (
        device.mac_address = $mac 
        OR device.ip_address = $ip
      ) 
      AND (time::yday(created_at) - time::yday() == 0)   
      GROUP ALL
      `,
			{ email, mac, ip },
		);
		return res?.count;
	}

	async createVerifier(
		_: {
			email?: string;
			accountID?: string;
			challenge: string;
			accessType: AccessType;
			accessMethod: AccessMethod;
			device: Device;
		},
	) {
		const { email, accountID, challenge, accessType, accessMethod, device } = _;
		const { agent, mac, ip } = device;
		await this.db.query(
			`
      CREATE verifiers CONTENT {
        email: $email,
        account_id: $accountID,
        hashed_challenge: crypto::argon2::generate($challenge),
        access_type: $accessType,        
        access_method: $accessMethod,
        device: {
          user_agent: $agent,        
          mac_address: $mac,
          ip_address: $ip,
        }
      }
      `,
			{ email, accountID, challenge, accessMethod, accessType, agent, mac, ip },
		);
	}

	async verifyVerifier(challenge: string) {
		const [res] = await this.db.query<RegistrationModel[]>(
			`
      SELECT * FROM ONLY verifiers 
      WHERE crypto::argon2::compare(hashed_challenge, $challenge)
      LIMIT 1
     `,
			{ challenge },
		);

		const createdAt = new Date(res.created_at);
		const expiresIn = res.expires_in._milliseconds;
		const expiredAt = new Date(createdAt.getTime() + expiresIn);

		const id = res.id;
		const email = res.email;
		const isExpired = new Date() > expiredAt;
		const isUsed = res.is_used;

		return { id, email, isExpired, isUsed };
	}

	async updateBiomVerifier(_: { id: string; account_id: string }) {
		const { id, account_id } = _;
		await this.db.query(
			`UPDATE verifiers SET account_id = $account_id WHERE id = $id`,
			{ id, account_id },
		);
	}

	async expireVerifier(id: string) {
		await this.db.query(
			`UPDATE verifiers SET is_used = true WHERE id = $id`,
			{ id },
		);
	}

	async registerUser(email: string) {
		const res = await fetch(this.url + "/signup", {
			method: "POST",
			headers: {
				"Accept": "application/json",
			},
			body: JSON.stringify({
				NS: "webapp",
				DB: "dev",
				AC: "users",
				email: email,
			}),
		});
		const { token, refresh } = await res.json();

		return { accessToken: token, refreshToken: refresh };
	}

	async enterUser(challenge: string) {
		const res = await fetch(this.url + "/signin", {
			method: "POST",
			headers: {
				"Accept": "application/json",
			},
			body: JSON.stringify({
				NS: "webapp",
				DB: "dev",
				AC: "users",
				challenge: challenge,
			}),
		});
		const resJSON = await res.json();
		const { token, refresh } = resJSON;
		return { accessToken: token, refreshToken: refresh };
	}

	// TODO: change refresh to: fetch this.url + "/rpc"
	// https://surrealdb.com/docs/surrealdb/integration/rpc#example-with-record-user
	async refreshUser(refreshToken: string) {
		const res = await fetch(this.url + "/signin", {
			method: "POST",
			headers: {
				"Accept": "application/json",
			},
			body: JSON.stringify({
				NS: "webapp",
				DB: "dev",
				AC: "users",
				refresh: refreshToken,
			}),
		});
		const resJSON = await res.json();
		const { token, refresh } = resJSON;
		return { accessToken: token, refreshToken: refresh };
	}

	async fetchUser() {
		const [res] = await this.db.query<User[]>(
			`
      SELECT * OMIT id FROM ONLY users 
      WHERE id = $auth.id LIMIT 1
      `,
		);
		return res;
	}

	async updateUser(_: { username: string; fullname: string }) {
		const { username, fullname } = _;
		await this.db.query<User[]>(
			`
      UPDATE users SET 
        user_name = $username,
        full_name = $fullname
      WHERE id = $auth.id
    `,
			{ username, fullname },
		);
	}

	async listBiometric(account_id: string) {
		const [res] = await this.db.query<Biometric[][]>(
			`
      SELECT * OMIT id FROM biometrics   
      WHERE account_id = $account_id
      `,
			{ account_id },
		);
		return res;
	}

	async registerBiometric(biom: Biometric) {
		await this.db.query("CREATE biometrics CONTENT $biom", { biom });
	}

	async getBiometric(_: { account_id: string; credential_id: string }) {
		const { account_id, credential_id } = _;
		const [res] = await this.db.query<Biometric[]>(
			`
      SELECT * OMIT id FROM ONLY biometrics 
      WHERE account_id = $account_id AND credential_id = $credential_id
      LIMIT 1
      `,
			{ account_id, credential_id },
		);
		return res;
	}
}
