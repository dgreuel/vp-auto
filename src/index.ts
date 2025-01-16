import { logger, sleep, randomWaitTime, sendMail } from "./utils.js";
import {
  fillHealthyHabitsPage,
  fillUsernamePasswordPage,
  goToHealthyHabitsPage,
  setupBrowser,
  goToStatsPage,
  goToHomePageAndGetPoints,
} from "./personify.js";

const runtime = async () => {
  const { browser, page } = await setupBrowser(
    "https://login.personifyhealth.com/",
  );
  let points = "N/A";

  try {
    logger("Browser started, page navigated");
    await fillUsernamePasswordPage(page);

    logger("Username and password filled");

    await sleep(randomWaitTime() + 7000);
    await page.waitForSelector("id=MenuItemHome");

    await goToHealthyHabitsPage(page);
    await page.waitForSelector("id=MenuItemHome");
    logger("Healthy habits page loaded");

    await fillHealthyHabitsPage(page);
    await goToStatsPage(page);

    points = await goToHomePageAndGetPoints(page);
    logger("Points: " + points);
  } catch (error: any) {
    logger("=== Automation failed ===");
    logger(error.message as string);
  }

  try {
    logger("Attempting to send email");
    await sendMail(points);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

runtime(); // eslint-disable-line @typescript-eslint/no-floating-promises
