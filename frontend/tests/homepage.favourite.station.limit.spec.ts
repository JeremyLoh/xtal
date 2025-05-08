import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import process from "process"
import { unitedStatesStation } from "./mocks/station"
import {
  assertToastMessage,
  assertToastMessageIsMissing,
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import {
  closeFavouriteStationsDrawer,
  getFavouriteStationsButton,
  getFavouriteStationsDrawer,
  getRadioCardFavouriteIcon,
} from "./constants/favouriteStationConstants"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("radio station favourite station limit feature", () => {
  function uuid() {
    return crypto.randomUUID()
  }
  function assertMaxFavouriteStationsEnvProperty(max: number) {
    expect(
      process.env.VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS,
      ".env.local environment property VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS should be defined"
    ).toBe(`${max}`)
  }

  test("should show warning toast when total favourite stations limit is reached", async ({
    page,
    headless,
  }) => {
    test.skip(headless, "Skip slow test from headless mode")
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    assertMaxFavouriteStationsEnvProperty(MAX_FAVOURITE_STATIONS)
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    for (let i = 0; i < MAX_FAVOURITE_STATIONS - 1; i++) {
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()
    }
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteIcon(page).click()
    await assertToastMessage(
      page,
      `Favourite station limit of ${MAX_FAVOURITE_STATIONS} reached`
    )
  })

  test("should show error toast when favourite station limit is exceeded", async ({
    page,
    headless,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    assertMaxFavouriteStationsEnvProperty(MAX_FAVOURITE_STATIONS)
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    for (let i = 0; i < MAX_FAVOURITE_STATIONS; i++) {
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()
    }
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteIcon(page).click()
    await assertToastMessage(
      page,
      `Could not add favourite station. Exceeded limit of ${MAX_FAVOURITE_STATIONS}`
    )
  })

  test("should allow addition of new favourite station after deleting from favourite station drawer", async ({
    page,
    headless,
  }) => {
    test.skip(headless, "Skip slow test from headless mode")
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    assertMaxFavouriteStationsEnvProperty(MAX_FAVOURITE_STATIONS)
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await page.evaluate(() => localStorage.setItem("FAVOURITE_STATIONS", "[]")) // remove any possible favourite station
    for (let i = 0; i < MAX_FAVOURITE_STATIONS; i++) {
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()
    }
    // remove one station from the favourite stations drawer
    await getFavouriteStationsButton(page).click()
    await assertLoadingSpinnerIsMissing(page) // wait for lazy loaded component to render
    const stations = await getFavouriteStationsDrawer(page)
      .locator(".favourite-station")
      .all()
    await stations[0].locator(".station-card-favourite-icon.selected").click()
    await closeFavouriteStationsDrawer(page)

    // generate one more random radio station and add it, no error should come at all
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteIcon(page).click()
    await assertToastMessage(
      page,
      `Favourite station limit of ${MAX_FAVOURITE_STATIONS} reached`
    )
    await assertToastMessageIsMissing(
      page,
      `Could not add favourite station. Exceeded limit of ${MAX_FAVOURITE_STATIONS}`
    )
  })
})
