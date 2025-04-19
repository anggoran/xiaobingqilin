export const sendMail = async (recipient: string, content: string) => {
	console.log("[IMPORT] pkg will be imported!");
	if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
		console.log("resend is imported!");
		return await import("./adapters/mail/resend.ts").then((m) =>
			m.sendWithResend(recipient, content)
		);
	} else {
		console.log("mailpit is imported!");
		return await import("./adapters/mail/mailpit.ts").then((m) =>
			m.sendWithMailpit(recipient, content)
		);
	}
};
