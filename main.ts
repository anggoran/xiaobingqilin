/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { denokv } from "./utils/queue.ts";
import { ENV } from "./utils/config.ts";

denokv.listenQueue(async (msg) => {
	switch (msg.type) {
		case "send-signup-mail":
			{
				const { redirect, token, email, challenge, device } = msg.value;
				const res = await fetch(ENV.FUNCTION_URL + "/auth/magic/send", {
					method: "POST",
					headers: {
						"destination": redirect,
						"Content-Type": "application/json",
						"Authorization": token,
					},
					body: JSON.stringify({
						accessType: "signup",
						email,
						challenge,
						device,
					}),
				});
				if (!res.ok) console.error("Email error:", res.status, res.statusText);
			}
			break;
		case "send-signin-mail": {
			const { redirect, token, email, challenge, device } = msg.value;
			const res = await fetch(ENV.FUNCTION_URL + "/auth/magic/send", {
				method: "POST",
				headers: {
					"destination": redirect,
					"Content-Type": "application/json",
					"Authorization": token,
				},
				body: JSON.stringify({
					accessType: "signin",
					email,
					challenge,
					device,
				}),
			});
			if (!res.ok) console.error("Email error:", res.status, res.statusText);
		}
	}
});

await start(manifest, config);
