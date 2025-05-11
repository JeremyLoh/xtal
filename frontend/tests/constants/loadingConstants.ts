import { expect, Page } from "@playwright/test"

export async function assertLoadingSpinnerIsMissing(page: Page) {
  await expect(page.getByTestId("loading-spinner")).toHaveCount(0)
}
