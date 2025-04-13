import { useSignal } from "@preact/signals";

export default function ProfileForm(
	{ username, fullname }: { username?: string; fullname?: string },
) {
	const usernameState = useSignal(username);
	const fullnameState = useSignal(fullname);
	return (
		<form method="POST">
			{username
				? (
					<p>
						<strong>username:</strong> {username}
					</p>
				)
				: (
					<>
						<label htmlFor="username">username</label>
						<input
							id="username"
							name="username"
							class="outline outline-2 outline-black"
							type="text"
							value={usernameState.value}
							onChange={(e) => {
								usernameState.value = (e.target as HTMLInputElement).value;
							}}
						/>
					</>
				)}
			{fullname
				? (
					<p>
						<strong>display name:</strong> {fullname}
					</p>
				)
				: (
					<>
						<label htmlFor="fullname">display name</label>
						<input
							id="fullname"
							name="fullname"
							class="outline outline-2 outline-black"
							type="text"
							value={fullnameState.value}
							onChange={(e) => {
								fullnameState.value = (e.target as HTMLInputElement).value;
							}}
						/>
					</>
				)}
			{(!username && !fullname) && (
				<button type="submit" class="bg-black text-white">Update</button>
			)}
		</form>
	);
}
