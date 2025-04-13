interface ENVInterface {
	SMTP_HOST: string;
	SMTP_PORT: string;
	SMTP_SECURITY: boolean;
	SMTP_SENDER: string;
	SMTP_AUTH?: {
		user: string;
		pass: string;
	};
	SURREAL_DB_URL: string;
	SURREAL_AUTH_SECRET: string;
	SURREAL_SYSTEM_USER: string;
	SURREAL_SYSTEM_PASS: string;
}

const ENV: ENVInterface = {
	SMTP_HOST: Deno.env.get("SMTP_HOST") ?? "",
	SMTP_PORT: Deno.env.get("SMTP_PORT") ?? "",
	SMTP_SECURITY: Deno.env.get("SMTP_SECURITY") === "true",
	SMTP_SENDER: Deno.env.get("SMTP_SENDER") ?? "",
	SURREAL_DB_URL: Deno.env.get("SURREAL_DB_URL") ?? "",
	SURREAL_AUTH_SECRET: Deno.env.get("SURREAL_AUTH_SECRET") ?? "",
	SURREAL_SYSTEM_USER: Deno.env.get("SURREAL_SYSTEM_USER") ?? "",
	SURREAL_SYSTEM_PASS: Deno.env.get("SURREAL_SYSTEM_PASS") ?? "",
};

if (Deno.env.get("DENO_ENV") === "production") {
	Object.assign(ENV, {
		SMTP_AUTH: {
			user: Deno.env.get("SMTP_USER") ?? "",
			pass: Deno.env.get("SMTP_PASS") ?? "",
		},
	});
}

export { ENV };
