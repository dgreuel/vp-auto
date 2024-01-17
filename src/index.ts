// using playwright
import { chromium } from "playwright-extra"
import { Page } from "playwright"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

chromium.use(StealthPlugin())

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// random wait time between 1 and 2 seconds
const randomWaitTime = (): number => 1000 + Math.random() * 2000

const setupBrowser = async (startingPage: string) => {
  const browser = await chromium.launch()

  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(startingPage)
  return { browser, context, page }
}

const runtime = async () => {
  const { browser, context, page } = await setupBrowser("https://iam.virginpulse.com/")

  try {
    console.log("Browser started, page navigated")
    await fillUsernamePasswordPage(page)

    console.log("Username and password filled")

    sleep(randomWaitTime())
    // await page.waitForSelector("id=home-menu-icon")

    // console.log("Dashboard page loaded")s

    await goToHealthyHabitsPage(page)

    console.log("Healthy habits page loaded")

    await fillHealthyHabitsPage(page)
  } catch (error) {
    console.error("=== Automation failed ===")
    console.error(error)
  }

  await browser.close()
}

const fillUsernamePasswordPage = async (page: Page) => {
  await page.locator("id=username").fill(process.env.USERNAME)
  await page.locator("id=password").fill(process.env.PASSWORD)

  await page.locator("id=kc-login").click()
  await sleep(randomWaitTime())
  await page.screenshot({ path: "screenshots/login.png", fullPage: true })
}

const goToHealthyHabitsPage = async (page: Page) => {
  await page.goto("https://app.member.virginpulse.com/#/healthyhabits")
  await sleep(randomWaitTime())
  await page.screenshot({ path: "screenshots/healthy-habits", fullPage: true })
  // await page.locator("id=home-menu-icon").hover()
  // await page.locator("id=home-menu-list").getByText("Healthy Habits").click()
}

const fillHealthyHabitsPage = async (page: Page) => {
  if ((await page.locator("id=wake-up-with-water-input-container").count()) > 0) {
    console.log("Wake up with water found")
    await page.locator("id=wake-up-with-water-input-container").getByText("Yes").click()
    await sleep(randomWaitTime())
    await page.screenshot({ path: "screenshots/post-water", fullPage: true })
  }
  if ((await page.locator("id=get-some-sleep-input-container").count()) > 0) {
    console.log("Get some sleep found")
    // random number between 6 9
    const randSleepHours = Math.floor(Math.random() * 10) + 6
    await page
      .locator("id=get-some-sleep-input-container")
      .locator("id=sleepHours")
      .fill(randSleepHours.toString())
    await page.locator("id=track-sleep").click()
    await sleep(randomWaitTime())
    await page.screenshot({ path: "screenshots/post-sleep", fullPage: true })
  }
  if ((await page.locator("id=steps-input-container").count()) > 0) {
    console.log("Steps found")
    // random number between 2500 and 14000
    const randSteps = Math.floor(Math.random() * 10000) + 2500
    await page
      .locator("id=steps-input-container")
      .locator("id=healthyhabits-steps")
      .fill(randSteps.toString())
    await sleep(randomWaitTime())
    await page.screenshot({ path: "screenshots/post-steps", fullPage: true })
  }
}

runtime()
