import { Page } from "@playwright/test"

export async function getClipboardContent(page: Page) {
  const handle = await page.evaluateHandle(
    async () => await navigator.clipboard.readText()
  )
  return await handle.jsonValue()
}
