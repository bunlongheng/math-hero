import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const hero = () => /,/; // hero buttons have aria-label "Name, Title"

async function openSettings(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
async function saveSettings(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /SAVE/ }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}
async function setDifficulty(page: import("@playwright/test").Page, level: number) {
  await openSettings(page);
  await page.getByRole("button", { name: `Difficulty ${level}` }).click();
  await saveSettings(page);
}

test("hero selection renders all 12 heroes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: hero() }).first()).toBeVisible();
  expect(await page.getByRole("button", { name: hero() }).count()).toBe(12);
});

test("picking a hero starts the game with a question and 4 answers", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: hero() }).first().click();
  await expect(page.getByTestId("question")).toContainText("= ?");
  expect(await page.locator("button").filter({ hasText: /^\d+$/ }).count()).toBe(4);
});

test("answering a question reveals a verdict", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: hero() }).first().click();
  await page.locator("button").filter({ hasText: /^\d+$/ }).first().click();
  await expect(page.getByText(/Correct!|The answer was/).first()).toBeVisible({ timeout: 4000 });
});

test("completing a run reaches the victory screen and writes a best score", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/");
  await page.getByRole("button", { name: hero() }).first().click();
  const victory = page.getByRole("heading", { name: "VICTORY!" });
  // Answer all 10 questions; Playwright's click auto-waits for the button to be enabled,
  // pacing around each reveal. The last click (victory replaced the options) is expected to miss.
  for (let i = 0; i < 12; i++) {
    if (await victory.isVisible().catch(() => false)) break;
    await page.locator("button").filter({ hasText: /^\d+$/ }).first().click({ timeout: 6000 }).catch(() => {});
  }
  await expect(victory).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/Score:/)).toBeVisible();
  const best = await page.evaluate(() => localStorage.getItem("math-hero:best:addition:1"));
  expect(best).not.toBeNull();
});

test("settings modal closes on Escape", async ({ page }) => {
  await page.goto("/");
  await openSettings(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("difficulty persists to a fresh page load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: hero() }).first()).toBeVisible();
  await setDifficulty(page, 3);

  // A fresh page in the same context shares localStorage - more reliable than reload()
  // for a client-only (ssr:false) app whose reload can abort mid chunk-load.
  const fresh = await page.context().newPage();
  await fresh.goto("/");
  await expect(fresh.getByRole("button", { name: hero() }).first()).toBeVisible();
  await fresh.getByRole("button", { name: "Settings" }).click();
  await expect(fresh.getByRole("button", { name: "Difficulty 3" })).toHaveAttribute("aria-pressed", "true");
  await fresh.close();
});

test("running out of time reveals the answer", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: hero() }).first().click();
  await expect(page.getByTestId("question")).toBeVisible();
  // Blow past the 30s per-question timer using the mocked clock.
  await page.clock.fastForward(32_000);
  await expect(page.getByText(/Time's up/).first()).toBeVisible({ timeout: 4000 });
});

test("no serious accessibility violations on the main surfaces", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: hero() }).first()).toBeVisible();
  const scan = async () => (await new AxeBuilder({ page }).analyze()).violations.filter((v) => v.impact === "serious" || v.impact === "critical");

  expect(await scan(), "hero select").toEqual([]);
  await openSettings(page);
  expect(await scan(), "settings dialog").toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: hero() }).first().click();
  await expect(page.getByTestId("question")).toBeVisible();
  expect(await scan(), "game screen").toEqual([]);
});
