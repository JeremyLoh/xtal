import { test, expect, Page } from "@playwright/test"
import { stationWithNoLocationLatLng } from "./mocks/station"

const HOMEPAGE = "http://localhost:5173"

async function clickRandomRadioStationButton(page: Page) {
  await page.getByTestId("random-radio-station-btn").click()
}
function getAudioPlayButton(page: Page) {
  // play button will have title="Play"
  return page.locator("#map .radio-card").getByRole("button", {
    name: "Play",
    exact: true,
  })
}
function getAudioPauseButton(page: Page) {
  // pause button will have title="Pause"
  return page.locator("#map .radio-card").getByRole("button", {
    name: "Pause",
    exact: true,
  })
}

test("has title", async ({ page }) => {
  await page.goto(HOMEPAGE)
  await expect(page).toHaveTitle(/xtal/)
})

test.describe("random radio station", () => {
  test("get random station and display on map", async ({ page }) => {
    // mock radio browser api with any query params
    await page.route("*/**/json/stations?*", async (route) => {
      const json = [stationWithNoLocationLatLng]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(page.locator("#map .radio-card")).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("heading", {
        name: stationWithNoLocationLatLng.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("link", {
        name: stationWithNoLocationLatLng.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page
        .locator("#map .radio-card")
        .getByText("From " + stationWithNoLocationLatLng.country, {
          exact: true,
        })
    ).toBeVisible()
    await getAudioPlayButton(page).click()
    await getAudioPauseButton(page).click()
  })
})
