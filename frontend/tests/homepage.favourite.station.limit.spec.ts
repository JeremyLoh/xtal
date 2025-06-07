import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import process from "process"
import { unitedStatesStation } from "./mocks/station"
import {
  assertToastMessage,
  assertToastMessageIsMissing,
} from "./constants/toasterConstants"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"

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
    homePage,
    headless,
  }) => {
    test.skip(headless, "Skip slow test from headless mode")
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    assertMaxFavouriteStationsEnvProperty(MAX_FAVOURITE_STATIONS)
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    for (let i = 0; i < MAX_FAVOURITE_STATIONS - 1; i++) {
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()
    }
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await assertToastMessage(
      homePage.getPage(),
      `Favourite station limit of ${MAX_FAVOURITE_STATIONS} reached`
    )
  })

  test("should show error toast when favourite station limit is exceeded", async ({
    homePage,
    headless,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    assertMaxFavouriteStationsEnvProperty(MAX_FAVOURITE_STATIONS)
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    for (let i = 0; i < MAX_FAVOURITE_STATIONS; i++) {
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()
    }
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await assertToastMessage(
      homePage.getPage(),
      `Could not add favourite station. Exceeded limit of ${MAX_FAVOURITE_STATIONS}`
    )
  })

  test("should allow addition of new favourite station after deleting from favourite station drawer", async ({
    homePage,
    headless,
  }) => {
    test.skip(headless, "Skip slow test from headless mode")
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    assertMaxFavouriteStationsEnvProperty(MAX_FAVOURITE_STATIONS)
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage
      .getPage()
      .evaluate(() => localStorage.setItem("FAVOURITE_STATIONS", "[]")) // remove any possible favourite station
    for (let i = 0; i < MAX_FAVOURITE_STATIONS; i++) {
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()
    }
    // remove one station from the favourite stations drawer
    await homePage.openFavouriteStationsDrawer()
    await assertLoadingSpinnerIsMissing(homePage.getPage()) // wait for lazy loaded component to render
    const stations = await homePage
      .getDrawer()
      .locator(".favourite-station")
      .all()
    await stations[0].locator(".station-card-favourite-icon.selected").click()
    await homePage.closeDrawer()

    // generate one more random radio station and add it, no error should come at all
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await assertToastMessage(
      homePage.getPage(),
      `Favourite station limit of ${MAX_FAVOURITE_STATIONS} reached`
    )
    await assertToastMessageIsMissing(
      homePage.getPage(),
      `Could not add favourite station. Exceeded limit of ${MAX_FAVOURITE_STATIONS}`
    )
  })
})
