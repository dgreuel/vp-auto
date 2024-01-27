import { chromium } from "playwright-extra"
import { Page } from "playwright"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { sleep, randomWaitTime, logger } from "./utils.js"
import HealthyHabitForms from './vp-healthy-habit-forms.js'

export const detectModal = async (page: Page) => {
  if (await page.locator("id=trophy-modal-close-btn").isVisible()) {
    logger("Trophy modal detected")
    await page.locator("id=trophy-modal-close-btn").click()
  }
}

export const setupBrowser = async (startingPage: string) => {
  chromium.use(StealthPlugin())
  const browser = await chromium.launch()

  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(startingPage)
  return { browser, context, page }
}

export const fillUsernamePasswordPage = async (page: Page) => {
  await page.locator("id=username").pressSequentially(process.env.VP_USERNAME)
  await page.locator("id=password").pressSequentially(process.env.VP_PASSWORD)

  await page.locator("id=kc-login").click()
  await sleep(randomWaitTime())
  await page.screenshot({ path: "screenshots/login.png", fullPage: true })
}

export const goToHealthyHabitsPage = async (page: Page) => {
  await page.goto("https://app.member.virginpulse.com/#/healthyhabits")
  await sleep(randomWaitTime())
  await page.screenshot({ path: "screenshots/healthy-habits.png", fullPage: true })
}
export const goToStatsPage = async (page: Page) => {
  await page.goto("https://app.member.virginpulse.com/#/stats-page")
  await sleep(randomWaitTime())
  await page.waitForSelector("id=steps-card")
  await page.screenshot({ path: "screenshots/stats-page.png", fullPage: true })
}

export const goToHomePageAndGetPoints = async (page: Page) => {
  await page.goto("https://app.member.virginpulse.com/#/home")
  await sleep(randomWaitTime())
  await page.waitForSelector("id=earned-value")
  const points = await page.locator("id=earned-value").innerText()

  return points
}

export const fillHealthyHabitsPage = async (page: Page) => {
  // call each function in HealthyHabitForms
  for (const func of HealthyHabitForms) {
    await detectModal(page)
    await func(page)
  }
}
