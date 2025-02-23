import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants"
import {
  closeFavouriteStationsDrawer,
  getFavouriteStationsButton,
} from "./constants/favouriteStationConstants"
import {
  closeSearchStationDrawer,
  getSearchStationButton,
} from "./constants/searchStationConstants"

// https://playwright.dev/docs/emulation#color-scheme-and-media
test.use({
  colorScheme: "dark",
})

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("header app theme (start with dark mode)", () => {
  function getDarkModeIcon(page: Page) {
    return page.getByTestId("theme-toggle-btn").locator(".dark-mode-icon")
  }
  function getLightModeIcon(page: Page) {
    return page.getByTestId("theme-toggle-btn").locator(".light-mode-icon")
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
    ).toHaveCSS("background-color", "rgb(11, 15, 29)")
    await expect(
      page.locator(elementSelector),
      "should have dark theme text color"
    ).toHaveCSS("color", "rgb(232, 235, 245)")
  }

  test("should switch theme when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertElementHasDarkTheme(page, "#root")
    await expect(getDarkModeIcon(page)).toBeVisible()
    await page.getByTestId("theme-toggle-btn").click()
    await expect(getLightModeIcon(page)).toBeVisible()
    await expect(getDarkModeIcon(page)).not.toBeVisible()
    await assertElementHasLightTheme(page, "#root")
  })

  test("should switch theme for favourite stations drawer when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await getFavouriteStationsButton(page).click()
    await assertElementHasDarkTheme(page, "#drawer-root")
    await closeFavouriteStationsDrawer(page)
    await page.getByTestId("theme-toggle-btn").click()
    await getFavouriteStationsButton(page).click()
    await assertElementHasLightTheme(page, "#drawer-root")
  })

  test("should switch theme for search stations drawer when app theme button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await assertElementHasDarkTheme(page, "#drawer-root")
    await closeSearchStationDrawer(page)
    await page.getByTestId("theme-toggle-btn").click()
    await getSearchStationButton(page).click()
    await assertElementHasLightTheme(page, "#drawer-root")
  })
})
