/* eslint-disable no-await-in-loop */
import { chromium } from "playwright-extra";
import { type Page } from "playwright";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { sleep, randomWaitTime, logger } from "./utils.js";
import HealthyHabitForms from "./vp-healthy-habit-forms.js";

// Self catching for false positives
export const detectModal = async (page: Page) => {
  try {
    const domElements = await page.locator("id=trophy-modal-close-btn").count();
    const isVisible = await page.isVisible("id=trophy-modal-close-btn");
    if (domElements > 0 && isVisible) {
      logger("Trophy modal detected");
      await page.locator("id=trophy-modal-close-btn").click();
    }
  } catch {}
};

export const setupBrowser = async (startingPage: string) => {
  chromium.use(StealthPlugin()); // eslint-disable-line new-cap
  const browser = await chromium.launch();

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(startingPage);
  return { browser, context, page };
};

export const fillUsernamePasswordPage = async (page: Page) => {
  await page
    .locator("id=username-input")
    .pressSequentially(process.env.VP_USERNAME ?? "test-auto-no-user");
  await page.locator("id=continue-button").click();

  await sleep(randomWaitTime());

  await page
    .locator("id=password-input")
    .pressSequentially(process.env.VP_PASSWORD ?? "test-auto-no-password");

  await page.locator("id=kc-login").click();
  await sleep(randomWaitTime());
  await page.screenshot({ path: "screenshots/login.png", fullPage: true });
};

export const goToHealthyHabitsPage = async (page: Page) => {
  await page.goto("https://app.personifyhealth.com/#/healthyhabits");
  await sleep(randomWaitTime());
  await page.screenshot({
    path: "screenshots/healthy-habits.png",
    fullPage: true,
  });
};

export const goToStatsPage = async (page: Page) => {
  await page.goto("https://app.personifyhealth.com/#/stats-page");
  await sleep(randomWaitTime());
  await page.waitForSelector("id=steps-card-stat-card-button");
  await page.screenshot({ path: "screenshots/stats-page.png", fullPage: true });
};

export const goToHomePageAndGetPoints = async (page: Page): Promise<string> => {
  await page.goto("https://app.personifyhealth.com/#/home");
  await sleep(randomWaitTime());
  await page.waitForSelector("id=earned-value");
  const points = await page.locator("id=earned-value").textContent();

  return points ?? "N/A";
};

export const fillHealthyHabitsPage = async (page: Page) => {
  // Call each function in HealthyHabitForms
  for (const function_ of HealthyHabitForms) {
    try {
      await detectModal(page);
      await function_(page);
    } catch (error: any) {
      logger(`caught error: ${error.message}`);
    }
  }
};
