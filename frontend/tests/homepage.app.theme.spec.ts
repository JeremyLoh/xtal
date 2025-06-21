import { test } from "./fixture/test.ts"
import { expect, Page } from "@playwright/test"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants.ts"
import { SidebarMenuItemAction } from "./pageComponents/Sidebar.ts"
import { podcastHomePageUrl } from "./constants/paths.ts"

// https://playwright.dev/docs/emulation#color-scheme-and-media
test.use({
  colorScheme: "dark",
})

test.describe("header app theme (start with dark mode)", () => {
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
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await assertElementHasDarkTheme(homePage.getPage(), "#root")
    await expect(homePage.getAppThemeToggleButton("dark")).toBeVisible()
    await homePage.toggleAppTheme()
    await expect(homePage.getAppThemeToggleButton("light")).toBeVisible()
    await expect(homePage.getAppThemeToggleButton("dark")).not.toBeVisible()
    await assertElementHasLightTheme(homePage.getPage(), "#root")
  })

  test("should switch theme for favourite stations drawer when app theme button is clicked", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.openFavouriteStationsDrawer()
    await assertElementHasDarkTheme(homePage.getPage(), "#drawer-root")
    await homePage.closeDrawer()
    await homePage.toggleAppTheme()
    await homePage.openFavouriteStationsDrawer()
    await assertElementHasLightTheme(homePage.getPage(), "#drawer-root")
  })

  test("should switch theme for search stations drawer when app theme button is clicked", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await assertElementHasDarkTheme(homePage.getPage(), "#drawer-root")
    await homePage.closeDrawer()
    await homePage.toggleAppTheme()
    await homePage.getSearchStationButton().click()
    await assertElementHasLightTheme(homePage.getPage(), "#drawer-root")
  })

  test("should not switch theme when navigating to different page (homepage to podcast page)", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await assertElementHasDarkTheme(homePage.getPage(), "#root")
    await homePage.toggleAppTheme()

    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarMenuItem(SidebarMenuItemAction.Podcasts).click()
    await expect(homePage.getPage()).toHaveURL(podcastHomePageUrl())
    await assertElementHasLightTheme(homePage.getPage(), "#root")
  })

  test("should not switch theme when navigating to multiple new pages", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await assertElementHasDarkTheme(homePage.getPage(), "#root")
    await homePage.toggleAppTheme()

    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarMenuItem(SidebarMenuItemAction.Podcasts).click()
    await expect(homePage.getPage()).toHaveURL(podcastHomePageUrl())
    await assertElementHasLightTheme(homePage.getPage(), "#root")

    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage
      .getSidebarMenuItem(SidebarMenuItemAction.PodcastSearch)
      .click()
    await assertElementHasLightTheme(homePage.getPage(), "#root")

    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarMenuItem(SidebarMenuItemAction.About).click()
    await assertElementHasLightTheme(homePage.getPage(), "#root")
  })
})
