import type { Handlers, PageProps } from "$fresh/server.ts";
import AuthCard from "./(_islands)/AuthCard.tsx";
import { getSignUp, postSignUp } from "../../controllers/auth.ts";

export const handler: Handlers = {
	GET: (req, ctx) => getSignUp(req, ctx),
	POST: (req, ctx) => postSignUp(req, ctx),
};

export default function SignUpPage(
	props: PageProps<{ usermail: string; error: string }>,
) {
	return (
		<div>
			{props.data.usermail
				? <p>{`Please check your inbox at ${props.data.usermail}!`}</p>
				: <AuthCard newUser error={props.data.error} />}
		</div>
	);
}
