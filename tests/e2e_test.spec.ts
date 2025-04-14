import { BrowserContext, test } from "@playwright/test";
import * as auth from "./e2e/auth.ts";

export let context: BrowserContext;

test.describe("Feature: Authentication", () => {
  test.beforeAll(async ({ browser }) => context = await browser.newContext());
  test.afterAll(async () => await context.close());
  test("Sign up email", auth.signupEmail);
  test("Update user profile", auth.updateProfile);
  test("Register passkey", auth.registerPasskey);
  test("Enter with passkey", auth.enterPasskey);
  test("Authenticate with refresh token", auth.authRefreshToken);
  test("Sign in with email", auth.signinEmail);
});
