import { Page } from "@playwright/test"

export async function assertLoadingSpinnerIsMissing(page: Page) {
  await page.waitForLoadState("networkidle")
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "detached",
  })
}
