import { defineConfig, devices } from "@playwright/test";

// e2e runs against a production build (next build + next start) so it mirrors prod.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://localhost:3034",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- -p 3034",
    url: "http://localhost:3034",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
