import test, { expect, Page } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { unitedStatesStation } from "./mocks/station"

test.describe("radio station favourite feature", () => {
  function getRadioCardFavouriteButton(page: Page) {
    return page.locator("#map .radio-card .station-card-favourite-icon")
  }
  function getFavouriteStationsButton(page: Page) {
    return page.getByTestId("favourite-station-toggle-btn")
  }
  function getFavouriteStationsDrawer(page: Page) {
    return page.locator(".drawer")
  }
  async function closeFavouriteStationsDrawer(page: Page) {
    await page.locator(".drawer-close-button").click()
  }
  async function assertEmptyFavouriteList(page: Page) {
    await expect(
      getFavouriteStationsDrawer(page).locator(".empty-favourites")
    ).toContainText("No Favourites Yet")
    await expect(
      getFavouriteStationsDrawer(page).locator(".empty-favourites")
    ).toContainText("Start by adding a new station")
  }

  test("favourite icon on radio station card toggles on click", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
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

  test("display empty favourite stations drawer when favourite station button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".drawer-title")
    ).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(page)
  })

  test("display one favourite station in drawer", async ({ page }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".drawer-title")
    ).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(page)
    await closeFavouriteStationsDrawer(page)

    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteButton(page).click()
    await getFavouriteStationsButton(page).click()

    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toContainText(unitedStatesStation.name)
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-icon"
      )
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-tag-container"
      )
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-country"
      )
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-favourite-icon.selected"
      )
    ).toBeVisible()
  })

  test("remove one favourited station in drawer when favourite icon in drawer is clicked", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".drawer-title")
    ).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(page)
    await closeFavouriteStationsDrawer(page)

    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteButton(page).click()
    await getFavouriteStationsButton(page).click()
    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toContainText(unitedStatesStation.name)
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-favourite-icon.selected"
      )
    ).toBeVisible()
    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station .station-card-favourite-icon.selected")
      .click()
    await assertEmptyFavouriteList(page)

    // assert that closing and opening the drawer shows an empty favourite station list
    await closeFavouriteStationsDrawer(page)
    await expect(getRadioCardFavouriteButton(page)).not.toHaveClass(/selected/)
    await getFavouriteStationsButton(page).click()
    await assertEmptyFavouriteList(page)
  })
})
