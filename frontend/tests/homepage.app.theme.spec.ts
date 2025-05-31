import { test } from "./fixture/test.ts"
import { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants.ts"
import {
  closeFavouriteStationsDrawer,
  openFavouriteStationsDrawer,
} from "./constants/favouriteStationConstants.ts"
import {
  closeSearchStationDrawer,
  getSearchStationButton,
} from "./constants/searchStationConstants.ts"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants.ts"

// https://playwright.dev/docs/emulation#color-scheme-and-media
test.use({
  colorScheme: "dark",
})

test.describe("header app theme (start with dark mode)", () => {
  function getDarkModeIcon(page: Page) {
    return page.getByTestId("theme-toggle-button").locator(".dark-mode-icon")
  }
  function getLightModeIcon(page: Page) {
    return page.getByTestId("theme-toggle-button").locator(".light-mode-icon")
  }
  async function assertElementHasLightTheme(
    page: Page,
    elementSelector: string
  ) {
    await expect(
      page.locator(elementSelector),
      "should have light theme background color"
    ).toHaveCSS("background-color", "rgb(253, 250, 252)")
    await expect(
      page.locator(elementSelector),
      "should have light theme text color"
    ).toHaveCSS("color", "rgb(24, 12, 21)")
  }
  async function assertElementHasDarkTheme(
    page: Page,
    elementSelector: string
  ) {
    await expect(
      page.locator(elementSelector),
      "should have dark theme background color"
    ).toHaveCSS("background-color", "rgb(14, 15, 8)")
    await expect(
      page.locator(elementSelector),
      "should have dark theme text color"
    ).toHaveCSS("color", "rgb(246, 247, 236)")
  }

  test("should switch theme when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await assertElementHasDarkTheme(page, "#root")
    await expect(getDarkModeIcon(page)).toBeVisible()
    await page.getByTestId("theme-toggle-button").click()
    await expect(getLightModeIcon(page)).toBeVisible()
    await expect(getDarkModeIcon(page)).not.toBeVisible()
    await assertElementHasLightTheme(page, "#root")
  })

  test("should switch theme for favourite stations drawer when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await openFavouriteStationsDrawer(page)
    await assertElementHasDarkTheme(page, "#drawer-root")
    await closeFavouriteStationsDrawer(page)
    await page.getByTestId("theme-toggle-button").click()
    await openFavouriteStationsDrawer(page)
    await assertElementHasLightTheme(page, "#drawer-root")
  })

  test("should switch theme for search stations drawer when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSearchStationButton(page).click()
    await assertElementHasDarkTheme(page, "#drawer-root")
    await closeSearchStationDrawer(page)
    await page.getByTestId("theme-toggle-button").click()
    await getSearchStationButton(page).click()
    await assertElementHasLightTheme(page, "#drawer-root")
  })
})
