import { expect, Page } from "@playwright/test"

export async function assertToastMessage(
  page: Page,
  message: string,
  count: number = 1
) {
  await page.waitForTimeout(500)
  await expect(page.locator(".toaster").getByText(message)).toHaveCount(count)
}

export async function assertToastMessageIsMissing(page: Page, message: string) {
  await expect(page.locator(".toaster").getByText(message)).toHaveCount(0)
}
