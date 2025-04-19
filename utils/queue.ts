/// <reference lib="deno.unstable" />

import { sendSignInMail } from "../controllers/async/signin.ts";
import { sendSignUpMail } from "../controllers/async/signup.ts";

export const denokv = await Deno.openKv();

export const backgroundTask = () => {
	return denokv.listenQueue(async (msg) => {
		switch (msg.type) {
			case "send-signup-mail":
				await sendSignUpMail(msg.value);
				break;
			case "send-signin-mail":
				await sendSignInMail(msg.value);
				break;
		}
	});
};
