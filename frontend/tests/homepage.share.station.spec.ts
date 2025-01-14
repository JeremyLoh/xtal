import test, { expect, Page } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { stationWithLocationLatLng, unitedStatesStation } from "./mocks/station"
import { getClipboardContent } from "./constants/shareStationConstants"

test.describe("share radio station feature", () => {
  function getRadioCardShareIcon(page: Page) {
    return page.locator("#map .radio-card .station-card-share-icon")
  }
  async function getRadioStationShareUrl(page: Page, stationuuid: string) {
    const shareUrl =
      (await page.evaluate(() => window.location.href)) +
      "radio-station/" +
      stationuuid
    return shareUrl
  }

  test("should show share icon on radio station card displayed on Map", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(getRadioCardShareIcon(page)).toBeVisible()
    expect(
      page.locator(".radio-card").getByTitle("Share Station Link")
    ).toBeVisible()
  })

  test("should copy share radio station link to clipboard", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardShareIcon(page).click()
    const expectedUrl = await getRadioStationShareUrl(
      page,
      unitedStatesStation.stationuuid
    )
    expect(await getClipboardContent(page)).toBe(expectedUrl)
  })

  test("should load radio station when share radio station link is used", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const requestUrl = route.request().url()
      if (
        requestUrl.includes(
          `json/stations/byuuid?uuids=${unitedStatesStation.stationuuid}`
        )
      ) {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      }
    })
    await page.goto(HOMEPAGE)
    const shareUrl = await getRadioStationShareUrl(
      page,
      unitedStatesStation.stationuuid
    )
    await page.goto(shareUrl)
    await expect(
      page.locator("#map .radio-card").getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
  })

  test("should not copy nested route '/radio-station/' when copying a new radio station share link", async ({
    page,
  }) => {
    // 1) when user navigates to route /radio-station and fails to load a radio station
    // 2) tries to search for a new random radio station
    // 3) click on the share link for the new radio station
    // 4) The share link for the new radio station should not be invalid (nested)
    // e.g. navigate to http://localhost:5173/radio-station/invalidStationuuid
    // e.g. share link should not be http://localhost:5173/radio-station/invalidStationuuidradio-station/f37830fa-76d3-4b85-addb-f3548e6d08ea
    await page.route("*/**/json/stations/search?*", async (route) => {
      const requestUrl = route.request().url()
      if (
        requestUrl.includes(
          `json/stations/byuuid?uuids=${unitedStatesStation.stationuuid}`
        )
      ) {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      } else {
        const json = [stationWithLocationLatLng]
        await route.fulfill({ json })
      }
    })
    await page.goto(HOMEPAGE + "/radio-station/invalidStationuuid")
    await clickRandomRadioStationButton(page)
    await getRadioCardShareIcon(page).click()
    const expectedUrl =
      new URL(await page.evaluate(() => window.location.href)).origin +
      `/radio-station/${stationWithLocationLatLng.stationuuid}`
    expect(await getClipboardContent(page)).toBe(expectedUrl)
  })
})
