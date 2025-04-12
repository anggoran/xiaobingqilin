import { useSignal } from "@preact/signals";
import { startRegistration } from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";

export default function PasskeyRegister() {
	const loadingState = useSignal(false);

	const handleRegister = async () => {
		loadingState.value = true;

		try {
			// Step 1: Request registration options from server
			const serverRegistration = await fetch("/api/auth/biometric/register", {
				method: "POST",
			});
			const regOptions = await serverRegistration.json();
			console.log("[Client] Registration Options:", regOptions);

			// Step 2: Create passkey credential using WebAuthn API
			const clientRegistration = await startRegistration({
				optionsJSON: regOptions as PublicKeyCredentialCreationOptionsJSON,
				useAutoRegister: false,
			});
			console.log("[Client] Registration Result:", clientRegistration);

			// Step 3: Verify the created credential with server
			const verification = await fetch("/api/auth/biometric/verify-register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ registration: clientRegistration }),
			});
			if (verification.redirected) globalThis.location.href = verification.url;
		} catch (e) {
			console.error("[Client] Registration error:", e);
		} finally {
			loadingState.value = false;
		}
	};
	return (
		<button
			type="button"
			onClick={handleRegister}
			disabled={loadingState.value}
			class="w-fit flex justify-center items-center gap-2 py-2 px-4 border border-black rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loadingState.value && (
				<div class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
			)}
			{loadingState.value ? "Registering a passkey..." : "Register a passkey"}
		</button>
	);
}
