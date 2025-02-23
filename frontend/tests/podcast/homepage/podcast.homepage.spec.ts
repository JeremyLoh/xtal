import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  getNavbarPodcastLink,
  getNavbarRadioLink,
  getRadioCardMapPopup,
  getRadioStationMapPopupCloseButton,
  HOMEPAGE,
} from "../../constants/homepageConstants"
import {
  getFavouriteStationsButton,
  getFavouriteStationsDrawer,
  getRadioCardFavouriteIcon,
} from "../../constants/favouriteStationConstants"
import { unitedStatesStation } from "../../mocks/station"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

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
    headless,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
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
})
