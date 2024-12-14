import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants"

// https://playwright.dev/docs/emulation#color-scheme-and-media
test.use({
  colorScheme: "dark",
})

test.describe("header app theme (start with dark mode)", () => {
  function getDarkModeIcon(page: Page) {
    return page.getByTestId("theme-toggle-btn").locator(".dark-mode-icon")
  }
  function getLightModeIcon(page: Page) {
    return page.getByTestId("theme-toggle-btn").locator(".light-mode-icon")
  }

  test("should switch theme when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await expect(getDarkModeIcon(page)).toBeVisible()
    await page.getByTestId("theme-toggle-btn").click()
    await expect(getLightModeIcon(page)).toBeVisible()
    await expect(getDarkModeIcon(page)).not.toBeVisible()
  })
})
