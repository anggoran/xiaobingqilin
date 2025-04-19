import { ENV } from "../../utils/config.ts";

export const sendSignUpMail = async (value: any) => {
	const { redirect, email, challenge, device } = value;
	const res = await fetch(ENV.FUNCTION_URL + "/auth/magic/send", {
		method: "POST",
		headers: {
			"destination": redirect,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			accessType: "signup",
			email,
			challenge,
			device,
		}),
	});
	console.log("[FETCH] task is fetched!");
	if (!res.ok) console.error("Error:", res.status, res.statusText);
};
