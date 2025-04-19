export const sendMail = async (recipient: string, content: string) => {
	if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
		return await import("./adapters/mail/resend.ts").then((m) =>
			m.sendWithResend(recipient, content)
		);
	} else {
		return await import("./adapters/mail/mailpit.ts").then((m) =>
			m.sendWithMailpit(recipient, content)
		);
	}
};
