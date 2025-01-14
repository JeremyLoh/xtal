import test, { expect, Page } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { unitedStatesStation } from "./mocks/station"

test.describe("share radio station feature", () => {
  function getRadioCardShareIcon(page: Page) {
    return page.locator("#map .radio-card .station-card-share-icon")
  }
  async function getClipboardContent(page: Page) {
    const handle = await page.evaluateHandle(() =>
      navigator.clipboard.readText()
    )
    return await handle.jsonValue()
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
    const expectedUrl =
      (await page.evaluate(() => window.location.href)) +
      "radio-station/" +
      unitedStatesStation.stationuuid
    expect(await getClipboardContent(page)).toBe(expectedUrl)
  })
})
