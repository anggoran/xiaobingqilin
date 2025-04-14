// Core WebAuthn configuration for authenticator registration and verification
export const WEBAUTHN_CONFIG = {
  rpName: "小冰淇淋", // Name shown during WebAuthn prompts
  rpID: "localhost", // Domain identifier for the Relying Party
  expectedRPID: "localhost", // Expected Relying Party ID
  expectedOrigin: "http://localhost:8000", // Origin for WebAuthn requests
  timeout: 60000, // Registration timeout in milliseconds
  authenticatorSelection: {
    residentKey: "required", // Suggests creating discoverable credentials
    userVerification: "required", // Enforces user verification
    authenticatorAttachment: "platform", // Restricts to platform authenticators
  },
  attestationType: "indirect", // Defines attestation statement generation
  requireUserPresence: true, // Require user presence
  requireUserVerification: true, // Require user verification
  userVerification: "required", // Enforces user verification
  supportedAlgorithmIDs: [-7], // ES256 (ECDSA P-256 with SHA-256)
};
