// using playwright
const { chromium } = require("playwright")

const setupBrowser = async (startingPage: string) => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(startingPage)
}

const runtime = async () => {}

runtime()
