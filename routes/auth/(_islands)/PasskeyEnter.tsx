import { useSignal } from "@preact/signals";
import { startAuthentication } from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";

export default function PasskeyRegister() {
  const loadingState = useSignal(false);

  const handleRegister = async () => {
    loadingState.value = true;

    try {
      // Step 1: Request authentication options from server
      const serverAuthentication = await fetch("/api/auth/biometric/enter", {
        method: "POST",
        body: JSON.stringify({ hello: "world" }),
      });
      const entOptions = await serverAuthentication.json();
      console.log("[Client] Authentication Options:", entOptions);

      // Step 2: Create passkey credential using WebAuthn API
      const clientAuthentication = await startAuthentication({
        optionsJSON: entOptions as PublicKeyCredentialCreationOptionsJSON,
        // // TODO: implement autofill!
        // useBrowserAutofill: true,
        // verifyBrowserAutofillInput: true,
      });
      console.log("[Client] Authentication Result:", clientAuthentication);

      // Step 3: Verify the created credential with server
      const verification = await fetch("/api/auth/biometric/verify-enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authentication: clientAuthentication }),
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
      onClick={handleRegister}
      disabled={loadingState.value}
      type="button"
      class="w-full flex justify-center items-center gap-2 py-2 px-4 text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingState.value && (
        <div class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
      )}
      {loadingState.value
        ? "Continuing with a passkey..."
        : "Continue with passkey"}
    </button>
  );
}
