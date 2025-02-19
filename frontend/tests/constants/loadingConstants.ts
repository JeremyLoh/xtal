import { expect, Page } from "@playwright/test"

export async function assertLoadingSpinnerIsMissing(page: Page, timeout = 300) {
  await page.waitForTimeout(timeout)
  const spinners = await page.getByTestId("loading-spinner").all()
  for (const spinner of spinners) {
    await expect(spinner).not.toBeVisible()
  }
}
