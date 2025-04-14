import { useSignal } from "@preact/signals";
import PasskeyEnter from "./PasskeyEnter.tsx";

export default function AuthCard(
	{ newUser, error }: Readonly<{ newUser: boolean; error?: string }>,
) {
	const usermailState = useSignal("");
	return (
		<div class="grid grid-cols-2">
			<form method="POST">
				<div class="m-4 flex flex-col space-y-2">
					<strong>
						{newUser ? "Join us now!" : "Welcome back!"}
					</strong>
					<label htmlFor="usermail">email</label>
					<input
						id="usermail"
						name="usermail"
						class="outline outline-2 outline-black"
						type="text"
						// // TODO: implement autofill!
						// autoComplete="usermail webauthn"
						value={usermailState.value}
						onInput={(e) => {
							usermailState.value = (e.target as HTMLInputElement).value;
						}}
					/>
					<button name="auth" type="submit" class="bg-black text-white">
						Continue
					</button>
					{!newUser && <PasskeyEnter />}
					{newUser
						? (
							<p>
								Already have an account?{" "}
								<span>
									<a
										name="signin"
										class="text-blue-500"
										href="/auth/signin"
									>
										please enter here.
									</a>
								</span>
							</p>
						)
						: (
							<p>
								Don't have an account?{" "}
								<span>
									<a
										name="signup"
										class="text-blue-500"
										href="/auth/signup"
									>
										please register here.
									</a>
								</span>
							</p>
						)}
					<p class="text-red-500">{error}</p>
				</div>
			</form>
			<div class="place-self-center text-center">
				<p class="text-5xl">小冰淇淋</p>
				<p>Curiosity is in your head, be grateful you dumbass.</p>
			</div>
		</div>
	);
}
