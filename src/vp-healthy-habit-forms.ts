// == The purpose of this file is to export each of the functions that are used to fill in forms for the automation == //
import { type Page } from "playwright";
import { sleep, randomWaitTime, logger } from "./utils.js";

export const fillWaterInputPage = async (page: Page) => {
  if (
    (await page.locator("id=wake-up-with-water-input-container").count()) > 0
  ) {
    logger("Wake up with water found");
    await page
      .locator("id=wake-up-with-water-input-container")
      .getByText("Yes")
      .click();
    await sleep(randomWaitTime());
    await page.screenshot({
      path: "screenshots/post-water.png",
      fullPage: true,
    });
  } else {
    logger("Wake up with water not found");
  }
};

export const fillSleepInputPage = async (page: Page) => {
  if ((await page.locator("id=get-some-sleep-input-container").count()) > 0) {
    logger("Get some sleep found");
    // Random number between 6 9
    const randomSleepHours = Math.floor(Math.random() * 10) + 6;
    await page
      .locator("id=get-some-sleep-input-container")
      .locator("id=sleepHours")
      .pressSequentially(randomSleepHours.toString());
    await page.locator("id=track-sleep").click();
    await sleep(randomWaitTime());
    await page.screenshot({
      path: "screenshots/post-sleep.png",
      fullPage: true,
    });
  } else {
    logger("Get some sleep not found");
  }
};

export const fillStepsInputPage = async (page: Page) => {
  if ((await page.locator("id=steps-input-container").count()) > 0) {
    logger("Steps found");
    // Random number between 2500 and 14000
    const randomSteps = Math.floor(Math.random() * 10_000) + 2500;
    await page
      .locator("id=steps-input-container")
      .locator("id=healthyhabits-steps")
      .pressSequentially(randomSteps.toString());
    await page.locator("id=track-steps").click();
    await sleep(randomWaitTime());
    await page.screenshot({
      path: "screenshots/post-steps.png",
      fullPage: true,
    });
  } else {
    logger("Steps not found");
  }
};

export const fillWhatsYourMoodInput = async (page: Page) => {
  if (
    (await page.locator("id=what’s-your-mood?-input-container").count()) > 0
  ) {
    logger("Whats your mood found");
    await page.locator("id=mood-icon-button-6-id").click();
    await sleep(randomWaitTime());
    await page.screenshot({
      path: "screenshots/post-mood.png",
      fullPage: true,
    });
  } else {
    logger("Whats your mood not found");
  }
};

export const fillStairsInputPage = async (page: Page) => {
  if ((await page.locator("id=stairs-input-container").count()) > 0) {
    logger("Stairs found");
    await page.locator("id=stairs-input-container").getByText("Yes").click();
    await sleep(randomWaitTime());
    await page.screenshot({
      path: "screenshots/post-stairs.png",
      fullPage: true,
    });
  } else {
    logger("Stairs not found");
  }
};

const HabitFormActions = [
  fillWaterInputPage,
  fillSleepInputPage,
  fillStepsInputPage,
  fillWhatsYourMoodInput,
  fillStairsInputPage,
];

export default HabitFormActions;
