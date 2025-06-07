import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import { unitedStatesStation } from "../../mocks/station"
import { SidebarMenuItemAction } from "../../pageComponents/Sidebar"
import PodcastHomePage from "../../pageObjects/PodcastHomePage"
import { podcastHomePageUrl } from "../../constants/paths"

test.describe("Podcast Homepage /podcasts", () => {
  async function navigateUsingSidebarMenuItem(
    podcastHomePage: PodcastHomePage,
    action: SidebarMenuItemAction
  ) {
    await expect(podcastHomePage.getSidebarToggleButton()).toBeVisible()
    await podcastHomePage.getSidebarToggleButton().click()
    await expect(podcastHomePage.getSidebar()).toBeVisible()
    await expect(podcastHomePage.getSidebarMenuItem(action)).toBeVisible()
    await podcastHomePage.getSidebarMenuItem(action).click()
  }

  test("should display title", async ({ podcastHomePage }) => {
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
  })

  test("should navigate back to homepage (/) header navbar radio link is clicked", async ({
    podcastHomePage,
    isMobile,
  }) => {
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
    await expect(podcastHomePage.getPage()).toHaveURL(/\/podcasts$/)
    if (isMobile) {
      await navigateUsingSidebarMenuItem(
        podcastHomePage,
        SidebarMenuItemAction.Radio
      )
    } else {
      await expect(podcastHomePage.getNavbarRadioLink()).toBeVisible()
      await podcastHomePage.getNavbarRadioLink().click()
    }
    await expect(podcastHomePage.getPage()).not.toHaveTitle(/xtal - podcasts/)
    expect(podcastHomePage.getPage().url()).not.toMatch(/\/podcasts$/)
  })

  test("should load favourite station and navigate back to homepage when load station button is clicked in favourite stations drawer", async ({
    homePage,
    podcastHomePage,
    headless,
    isMobile,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()
    await expect(homePage.getRadioCardFavouriteIcon()).toBeVisible()
    await homePage.getRadioCardFavouriteIcon().click()
    await homePage.clickRadioCardCloseButton()

    if (isMobile) {
      await navigateUsingSidebarMenuItem(
        podcastHomePage,
        SidebarMenuItemAction.Podcasts
      )
    } else {
      await podcastHomePage.getNavbarPodcastLink().click()
    }
    await expect(podcastHomePage.getPage()).toHaveURL(podcastHomePageUrl())
    await navigateUsingSidebarMenuItem(
      podcastHomePage,
      SidebarMenuItemAction.RadioFavouriteStations
    )
    await podcastHomePage
      .getDrawer()
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    expect(homePage.getPage().url()).not.toMatch(/\/podcasts$/)
  })
})
