import { Handlers } from "$fresh/server.ts";
import { postSendMail } from "../../../../controllers/api/magic.ts";

export const handler: Handlers = {
	POST: (req, _ctx) => postSendMail(req),
};
