import { Page } from "@playwright/test"

async function getClipboardContent(page: Page) {
  return await page.evaluate(() => navigator.clipboard.readText())
}

export async function waitForClipboardContent(
  page: Page,
  expectedContent: string,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const content = await getClipboardContent(page)
    if (content === expectedContent) {
      return
    }
    await page.waitForTimeout(interval)
  }
  throw new Error(
    `Clipboard did not contain expected content within ${timeout}ms`
  )
}
