import test, { expect } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  getNavbarPodcastLink,
  getNavbarRadioLink,
  getRadioCardMapPopup,
  getRadioStationMapPopupCloseButton,
  HOMEPAGE,
} from "../constants/homepageConstants"
import {
  getFavouriteStationsButton,
  getFavouriteStationsDrawer,
  getRadioCardFavouriteIcon,
} from "../constants/favouriteStationConstants"
import { unitedStatesStation } from "../mocks/station"
import { defaultTenTrendingPodcasts } from "../mocks/podcast"

test.describe("Podcast Homepage /podcasts", () => {
  test("should display title", async ({ page }) => {
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page).toHaveTitle(/xtal - podcasts/)
  })

  test("should navigate back to homepage (/) header navbar radio link is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page).toHaveTitle(/xtal - podcasts/)
    expect(page.url()).toMatch(/\/podcasts$/)
    await getNavbarRadioLink(page).click()
    await expect(page).not.toHaveTitle(/xtal - podcasts/)
    expect(page.url()).not.toMatch(/\/podcasts$/)
  })

  test("should load favourite station and navigate back to homepage when load station button is clicked in favourite stations drawer", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(getRadioCardFavouriteIcon(page)).toBeVisible()
    await getRadioCardFavouriteIcon(page).click()
    await getRadioStationMapPopupCloseButton(page).click()

    await getNavbarPodcastLink(page).click()
    await getFavouriteStationsButton(page).click()
    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    expect(page.url()).not.toMatch(/\/podcasts$/)
  })

  test.describe("Trending Podcasts Section", () => {
    test("should display default 10 trending podcasts and remove any duplicate entries", async ({
      page,
    }) => {
      await page.route("*/**/api/podcast/trending?limit=10", async (route) => {
        const json = defaultTenTrendingPodcasts
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await page
          .locator(".podcast-trending-container .podcast-trending-card")
          .getByText(podcastData.title, { exact: true })
          .scrollIntoViewIfNeeded()
        await expect(
          page
            .locator(".podcast-trending-container .podcast-trending-card")
            .getByText(podcastData.title, { exact: true })
        ).toBeVisible()
        await expect(
          page
            .locator(".podcast-trending-container .podcast-trending-card")
            .getByText(podcastData.author, { exact: true })
        ).toBeVisible()
        await expect(
          page
            .locator(".podcast-trending-container .podcast-trending-card")
            .getByRole("img", {
              name: podcastData.title + " podcast image",
              exact: true,
            })
        ).toBeVisible()
        // TODO test for the other elements of a podcast card component
      }
    })
  })
})
