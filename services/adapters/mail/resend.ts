import { ENV } from "../../../utils/config.ts";

export const sendWithResend = async (recipient: string, content: string) => {
	const res = await fetch(ENV.SMTP_URL, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${ENV.SMTP_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: `${ENV.SMTP_SENDER_NAME} <${ENV.SMTP_SENDER_MAIL}>`,
			to: [recipient],
			subject: "Please continue your login!",
			html: content,
		}),
	});

	return await res.json() as { id: string };
};
