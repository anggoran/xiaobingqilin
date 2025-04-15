const ENV = {
	SMTP_URL: Deno.env.get("SMTP_URL") ?? "",
	SMTP_KEY: Deno.env.get("SMTP_KEY") ?? "",
	SMTP_SENDER_NAME: Deno.env.get("SMTP_SENDER_NAME") ?? "",
	SMTP_SENDER_MAIL: Deno.env.get("SMTP_SENDER_MAIL") ?? "",
	SURREAL_DB_URL: Deno.env.get("SURREAL_DB_URL") ?? "",
	SURREAL_AUTH_SECRET: Deno.env.get("SURREAL_AUTH_SECRET") ?? "",
	SURREAL_SYSTEM_USER: Deno.env.get("SURREAL_SYSTEM_USER") ?? "",
	SURREAL_SYSTEM_PASS: Deno.env.get("SURREAL_SYSTEM_PASS") ?? "",
};

export { ENV };
