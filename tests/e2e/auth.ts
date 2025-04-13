import { expect, Page, test } from "@playwright/test";
import { context } from "../e2e_test.spec.ts";

let page: Page;
let authenticatorID: string;

/**
 * Email Registration Flow
 */
export const signupEmail = async () => {
	await test.step("Guest access home page", async () => {
		page = await context.newPage();
		const response = await page.goto("/");
		expect(response!.url()).toBe("http://localhost:8000/auth/signin");
	});

	await test.step("Send registration email", async () => {
		await page.getByRole("link", { name: "please register here." }).click();
		expect(page.url()).toBe("http://localhost:8000/auth/signup");

		await page.getByLabel("email").fill("goranrango@gmail.com");
		await page.getByRole("button", { name: "Continue" }).click();
		await expect(page.getByRole("paragraph")).toHaveText(
			"Please check your inbox at goranrango@gmail.com!",
		);
	});

	await test.step("Check email inbox", async () => {
		await page.goto("http://localhost:8025/");
		await page.getByRole("link", { name: "hello@xiaobql.app" }).first().click();
		const iframe = page.locator("#preview-html").contentFrame();
		const newTab = page.waitForEvent("popup");
		await iframe.getByRole("link", { name: "Go to xiaobql.app" }).click();
		page = await newTab;
	});
};

/**
 * Profile Management
 */
export const updateProfile = async () => {
	expect(page.url()).toBe("http://localhost:8000/profile");

	await page.getByLabel("username").fill("anggoran");
	await page.getByLabel("display name").fill("Goran Rango");
	await page.getByRole("button", { name: "Update" }).click();

	await expect(page.getByText("goranrango@gmail.com")).toBeVisible();
	await expect(page.getByText("anggoran")).toBeVisible();
	await expect(page.getByText("Goran Rango")).toBeVisible();
};

/**
 * Passkey Registration
 */
export const registerPasskey = async () => {
	const client = await page.context().newCDPSession(page);
	await client.send("WebAuthn.enable");

	const result = await client.send("WebAuthn.addVirtualAuthenticator", {
		options: {
			protocol: "ctap2",
			transport: "internal",
			hasResidentKey: true,
			hasUserVerification: true,
			isUserVerified: true,
			automaticPresenceSimulation: true,
		},
	});

	await page.getByRole("button", { name: "Register a passkey" }).click();
	await expect(page.getByRole("listitem")).toContainText("Unknown");
	authenticatorID = result.authenticatorId;
};

/**
 * Passkey Authentication
 */
export const enterPasskey = async () => {
	await test.step("Log user out", async () => {
		const promise = page.waitForResponse("/api/auth/signout");
		await page.getByRole("button", { name: "Sign out" }).click();
		const headers = (await promise).headers();
		expect(headers["referer"]).toBe("http://localhost:8000/profile");
		expect(headers["location"]).toBe("/auth/signin");
	});

	await test.step("Send passkey authentication", async () => {
		const client = await page.context().newCDPSession(page);
		const passkey = await client.send("WebAuthn.getCredentials", {
			authenticatorId: authenticatorID,
		});

		expect(passkey.credentials).toHaveLength(1);
		expect(passkey.credentials[0].userName).toBe("anggoran");
		expect(passkey.credentials[0].userDisplayName).toBe("Goran Rango");

		const promise = page.waitForResponse("/api/auth/biometric/verify-enter");
		await page.getByRole("button", { name: "Continue with passkey" }).click();
		const headers = (await promise).headers();
		expect(headers["referer"]).toBe("http://localhost:8000/auth/signin");
		expect(headers["location"]).toBe("/");
	});
};

/**
 * Token Management
 */
export const authRefreshToken = async () => {
	await page.context().clearCookies({ name: "human-access" });
	await page.goto("/");
	const cookies = await page.context().cookies("http://localhost:8000/");
	expect(cookies.find((e) => e.name === "human-access")).toBeTruthy();
};

/**
 * Email Authentication Flow
 */
export const signinEmail = async () => {
	await page.context().clearCookies();
	const response = await page.goto("/");
	expect(response!.url()).toBe("http://localhost:8000/auth/signin");

	await test.step("Send authentication email", async () => {
		await page.getByLabel("email").fill("goranrango@gmail.com");
		await page.getByRole("button", { name: "Continue" }).first().click();
		await expect(page.getByRole("paragraph")).toHaveText(
			"Please check your inbox at goranrango@gmail.com!",
		);
	});

	await test.step("Check email inbox", async () => {
		await page.goto("http://localhost:8025/");
		await page.getByRole("link", { name: "hello@xiaobql.app" }).first().click();
		const iframe = page.locator("#preview-html").contentFrame();
		await iframe.getByRole("link", { name: "Go to xiaobql.app" }).click();
	});
};
