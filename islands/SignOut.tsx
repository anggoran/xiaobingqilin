export default function SignOut() {
	const handleSignOut = async () => {
		const signout = await fetch("/api/auth/signout", { method: "POST" });
		if (signout.redirected) globalThis.location.href = signout.url;
	};
	return <button type="button" onClick={handleSignOut}>Sign Out</button>;
}
