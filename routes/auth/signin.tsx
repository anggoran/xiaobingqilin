import type { Handlers, PageProps } from "$fresh/server.ts";
import AuthCard from "./(_islands)/AuthCard.tsx";
import { getSignIn, postSignIn } from "../../controllers/auth.ts";

export const handler: Handlers = {
  GET: (req, ctx) => getSignIn(req, ctx),
  POST: (req, ctx) => postSignIn(req, ctx),
};

export default function SignInPage(
  props: PageProps<{ usermail: string; error: string }>,
) {
  return (
    <div>
      {props.data.usermail
        ? <p>{`Please check your inbox at ${props.data.usermail}!`}</p>
        : <AuthCard newUser={false} error={props.data.error} />}
    </div>
  );
}
