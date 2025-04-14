import { Handlers, PageProps } from "$fresh/server.ts";
import Surreal from "@surrealdb/surrealdb";
import ProfileForm from "./(_islands)/ProfileForm.tsx";
import SignOut from "../../islands/SignOut.tsx";
import PasskeyRegister from "./(_islands)/PasskeyRegister.tsx";
import { getProfile, postProfile } from "../../controllers/profile.ts";
import { Biometric, User } from "../../models/auth.ts";
import BiometricItem from "../auth/(_components)/BiometricItem.tsx";

export const handler: Handlers<PageProps, { connection: Surreal }> = {
	GET: (req, ctx) => getProfile(req, ctx),
	POST: (req, ctx) => postProfile(req, ctx),
};

export default function Profile(
	props: PageProps<{ user: User; biom?: Biometric[]; error: string }>,
) {
	return (
		<div class="m-4 flex flex-col space-y-2">
			<div class="flex justify-between items-center w-full">
				<strong>Profile</strong>
				<SignOut />
			</div>
			<p>{props.data.user.email}</p>
			<ProfileForm
				username={props.data.user.user_name ?? ""}
				fullname={props.data.user.full_name ?? ""}
			/>
			<ul>
				{props.data.biom?.map((e, i) => (
					<BiometricItem biom={e} key={"no." + i} />
				))}
			</ul>
			{(props.data.user.user_name && props.data.user.full_name) && (
				<PasskeyRegister />
			)}
			<p class="text-red-500">{props.data.error}</p>
		</div>
	);
}
