import { ENV } from "../../utils/config.ts";
import { postSendMail } from "../api/magic.ts";

export const sendSignInMail = async (value: any) => {
	const { redirect, email, challenge, device } = value;
	const mailRequest = new Request(ENV.FUNCTION_URL + "/auth/magic/send", {
		method: "POST",
		headers: {
			"destination": redirect,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			accessType: "signin",
			email,
			challenge,
			device,
		}),
	});
	const res = await postSendMail(mailRequest);

	if (!res.ok) console.error("Error:", res.status, res.statusText);
};
