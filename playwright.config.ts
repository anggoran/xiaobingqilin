import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: "./tests",
  // Folder of the test report
  outputDir: "tests/.report",
  // Run all tests in parallel.
  fullyParallel: false,
  // Reporter to use
  reporter: [["html", { outputFolder: "tests/.report" }]],
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: "http://localhost:8000",
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: "Desktop Chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 720, height: 600 },
      },
    },
  ],
});
