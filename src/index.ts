import { logger, sleep, randomWaitTime, sendMail } from "./utils.js"
import {
  fillHealthyHabitsPage,
  fillUsernamePasswordPage,
  goToHealthyHabitsPage,
  setupBrowser,
  goToStatsPage,
} from "./virgin-pulse.js"

const runtime = async () => {
  const { browser, page } = await setupBrowser("https://iam.virginpulse.com/")
  await sendMail()
  return
  try {
    logger("Browser started, page navigated")
    await fillUsernamePasswordPage(page)

    logger("Username and password filled")

    await sleep(randomWaitTime() + 7000)
    await page.waitForSelector("id=home-menu-icon")

    await goToHealthyHabitsPage(page)
    await page.waitForSelector("id=home-menu-icon")
    logger("Healthy habits page loaded")

    await fillHealthyHabitsPage(page)
    await goToStatsPage(page)
  } catch (error: any) {
    logger("=== Automation failed ===")
    logger(error.message)
  }

  await browser.close()
}

runtime()
