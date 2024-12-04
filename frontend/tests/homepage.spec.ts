import { test, expect, Page } from "@playwright/test"
import { clickRandomRadioStationButton, HOMEPAGE } from "./constants"
import {
  stationWithBlockedAccess,
  stationWithMultipleTags,
  stationWithNoLocationLatLng,
  unitedStatesStation,
} from "./mocks/station"

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

test("has header", async ({ page }) => {
  await page.goto(HOMEPAGE)
  await expect(page.locator("header")).toBeVisible()
})

test("has footer", async ({ page }) => {
  await page.goto(HOMEPAGE)
  await expect(page.locator("footer")).toBeVisible()
  await expect(page.locator("footer").getByText("Jeremy_Loh")).toBeVisible()
  await expect(page.locator("#footer-github-link")).toHaveAttribute(
    "href",
    "https://github.com/JeremyLoh/"
  )
})

test.describe("random radio station", () => {
  test("display random station on map", async ({ page }) => {
    // mock radio browser api with any query params
    await page.route("*/**/json/stations/search?*", async (route) => {
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
        .getByText(stationWithNoLocationLatLng.country, {
          exact: true,
        })
    ).toBeVisible()
    await getAudioPlayButton(page).click()
    await getAudioPauseButton(page).click()
  })

  test("get random station with blocked access HTTP 403 should display error message", async ({
    page,
  }) => {
    // mock radio browser api with any query params
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [stationWithBlockedAccess]
      await route.fulfill({ json })
    })
    await page.route(stationWithBlockedAccess.url_resolved, async (route) => {
      await route.fulfill({ status: 403 })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(page.locator("#map .radio-card")).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("heading", {
        name: stationWithBlockedAccess.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("link", {
        name: stationWithBlockedAccess.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page
        .locator("#map .radio-card")
        .getByText(stationWithBlockedAccess.country, {
          exact: true,
        })
    ).toBeVisible()
    await expect(getAudioPlayButton(page)).not.toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByTestId("radio-card-playback-error")
    ).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByTestId("radio-card-playback-error")
    ).toHaveText(
      /The media could not be loaded, either because the server or network failed or because the format is not supported/
    )
  })

  test("random station with multiple tags should have visible audio player component", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [stationWithMultipleTags]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(page.locator("#map .radio-card")).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("heading", {
        name: stationWithMultipleTags.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.locator("#map .radio-card").getByRole("link", {
        name: stationWithMultipleTags.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page
        .locator("#map .radio-card")
        .getByText(stationWithMultipleTags.country, {
          exact: true,
        })
    ).toBeVisible()
    await expect(getAudioPlayButton(page)).toBeInViewport()
  })

  test("random station with bitrate information displays bitrate on card", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(
      page
        .locator("#map .radio-card")
        .getByText(`${unitedStatesStation.bitrate} kbps`, {
          exact: true,
        })
    ).toBeVisible()
  })
})
