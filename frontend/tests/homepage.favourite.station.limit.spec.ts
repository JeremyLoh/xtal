import test, { expect, Page } from "@playwright/test"
import process from "process"
import { unitedStatesStation } from "./mocks/station"
import {
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { getRadioCardFavouriteIcon } from "./constants/favouriteStationConstants"

test.describe("radio station favourite station limit feature", () => {
  function uuid() {
    return crypto.randomUUID()
  }
  async function assertToastMessage(page: Page, message: string) {
    const toasts = await page.locator(".toaster").all()
    const toastMessages = (
      await Promise.all(toasts.map((locator) => locator.allTextContents()))
    ).flat(1)
    expect(toastMessages).toEqual(expect.arrayContaining([message]))
  }

  test("should show warning toast when total favourite stations limit is reached", async ({
    page,
  }) => {
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    expect(
      process.env.VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS,
      ".env.local environment property VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS should be defined"
    ).toBe(`${MAX_FAVOURITE_STATIONS}`)
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
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
  }) => {
    test.setTimeout(30_000)
    const MAX_FAVOURITE_STATIONS = 3
    expect(
      process.env.VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS,
      ".env.local environment property VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS should be defined"
    ).toBe(`${MAX_FAVOURITE_STATIONS}`)
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, stationuuid: uuid() }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
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
})
