import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants"
import {
  stationWithBlockedAccess,
  stationWithMultipleTags,
  stationWithNoLocationLatLng,
  unitedStatesStation,
} from "./mocks/station"

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

test.describe("select genre of random radio station", () => {
  async function assertGenreIsInView(page: Page, genre: string) {
    await expect(
      page.locator(".genre-slider-container").getByText(genre, { exact: true })
    ).toBeInViewport()
  }
  async function assertGenreIsNotInView(page: Page, genre: string) {
    await expect(
      page.locator(".genre-slider-container").getByText(genre, { exact: true })
    ).not.toBeInViewport()
  }

  test("display genre labels and slide left and right icon", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await expect(page.locator(".slider-container")).toBeVisible()
    await expect(
      page.locator(".genre-slider-container").getByText("All", { exact: true })
    ).toBeVisible()
    await expect(
      page.locator(".genre-slider-container .slide-left-icon")
    ).toBeVisible()
    await expect(
      page.locator(".genre-slider-container .slide-right-icon")
    ).toBeVisible()
  })

  test("click slide to right icon does not show first genre anymore ('All' genre)", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    const firstGenre = "All"
    // expect "All" genre tag will disappear after sliding to right
    await assertGenreIsInView(page, firstGenre)
    await page.locator(".genre-slider-container .slide-right-icon").click()
    await assertGenreIsNotInView(page, firstGenre)
  })

  test("click slide to left icon shows the first genre, after slide to right has been done", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    const firstGenre = "All"
    await assertGenreIsInView(page, firstGenre)
    await page.locator(".genre-slider-container .slide-right-icon").click()
    await assertGenreIsNotInView(page, firstGenre)
    await page.locator(".genre-slider-container .slide-left-icon").click()
    await assertGenreIsInView(page, firstGenre)
  })

  test("selecting a different genre add 'selected' css class to genre", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    const firstGenre = "All"
    const secondGenre = "Alternative"
    await assertGenreIsInView(page, firstGenre)
    await assertGenreIsInView(page, secondGenre)
    await expect(page.locator(".genre-slider-container .selected")).toHaveText(
      firstGenre
    )
    await page
      .locator(".genre-slider-container")
      .getByText(secondGenre, { exact: true })
      .click()
    await expect(page.locator(".genre-slider-container .selected")).toHaveText(
      secondGenre
    )
  })
})

test.describe("radio station search type", () => {
  function getGenreSearchButton(page: Page) {
    return page.locator("#station-search-type-container .genre-search-button")
  }
  function getCountrySearchButton(page: Page) {
    return page.locator("#station-search-type-container .country-search-button")
  }

  test("display genre tab with 'selected' CSS className", async ({ page }) => {
    await page.goto(HOMEPAGE)
    // Genre tab should be selected by default, "selected" class
    await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
    await expect(getCountrySearchButton(page)).not.toHaveClass(/selected/)
  })

  test("display genre and country tab above slider", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await expect(getGenreSearchButton(page)).toBeVisible()
    await expect(getCountrySearchButton(page)).toBeVisible()
  })

  test("display country options in slider when country tab is clicked", async ({
    page,
  }) => {
    const expectedCountryCount = 65
    await page.goto(HOMEPAGE)
    await expect(getCountrySearchButton(page)).not.toHaveClass(/selected/)
    await getCountrySearchButton(page).click()
    await expect(getCountrySearchButton(page)).toHaveClass(/selected/)
    await expect(page.locator(".slider .country-slider-option")).toHaveCount(
      expectedCountryCount
    )
  })

  test("search random station by country", async ({ page }) => {
    const expectedCountryCode = "US"
    await page.route(
      `*/**/json/stations/search?countrycode=${expectedCountryCode}&*`,
      async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE)
    await getCountrySearchButton(page).click()
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map .radio-card")).toBeVisible()
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
})
