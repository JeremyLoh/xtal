import test, { expect, Page } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { stationWithNoLocationLatLng } from "./mocks/station"

test.describe("radio station favourite feature", () => {
  function getRadioCardFavouriteButton(page: Page) {
    return page.locator("#map .radio-card .station-card-favourite-icon")
  }

  test("favourite icon on radio station card toggles on click", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [stationWithNoLocationLatLng]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await expect(getRadioCardFavouriteButton(page)).toBeVisible()
    await expect(getRadioCardFavouriteButton(page)).not.toHaveClass(/selected/)
    await getRadioCardFavouriteButton(page).click()
    await expect(getRadioCardFavouriteButton(page)).toHaveClass(/selected/)
  })
})
