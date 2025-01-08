import test, { expect, Page } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { stationWithMultipleTags, unitedStatesStation } from "./mocks/station"
import {
  closeFavouriteStationsDrawer,
  getFavouriteStationsButton,
  getFavouriteStationsDrawer,
} from "./constants/favouriteStationConstants"

test.describe("radio station favourite feature", () => {
  function getRadioCardPopup(page: Page) {
    return page.locator("#map .radio-card")
  }
  function getRadioCardFavouriteButton(page: Page) {
    return page.locator("#map .radio-card .station-card-favourite-icon")
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

  test("allow selection of a favourite station and display it on the map", async ({
    page,
  }) => {
    let requestCount = 1
    await page.route("*/**/json/stations/search?*", async (route) => {
      if (requestCount === 1) {
        requestCount++
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      } else {
        const json = [stationWithMultipleTags]
        await route.fulfill({ json })
      }
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteButton(page).click()
    // load another radio station on the map that is different from the first station
    await clickRandomRadioStationButton(page)
    await expect(
      page.locator("#map .radio-card").getByRole("heading", {
        name: stationWithMultipleTags.name,
        exact: true,
      })
    ).toBeVisible()

    // load first station from favourite stations drawer
    await getFavouriteStationsButton(page).click()
    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(getFavouriteStationsDrawer(page)).not.toBeVisible()
    await expect(getRadioCardPopup(page)).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("link", {
        name: unitedStatesStation.homepage,
        exact: true,
      })
    ).toBeVisible()
  })

  test("placeholder icon shows up for station with empty favicon", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, favicon: "" }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteButton(page).click()
    await expect(
      page.locator("#map .radio-card .station-card-icon")
    ).toBeVisible()
    // open the favourite station drawer, and assert placeholder icon is shown
    await getFavouriteStationsButton(page).click()
    await expect(
      getFavouriteStationsDrawer(page).locator(".station-card-icon")
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".station-card-icon title")
    ).toHaveText("Icon Not Available")
  })
})
