import test, { expect, Page } from "@playwright/test"
import { clickRandomRadioStationButton, HOMEPAGE } from "./constants"
import { stationWithMultipleTags, unitedStatesStation } from "./mocks/station"

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

  test.describe("country tab", () => {
    test("country tab first selected moves map to approximate country location", async ({
      page,
    }) => {
      const expectedStartMapPane = "transform: translate3d(2048px, 2048px, 0px)"
      await page.goto(HOMEPAGE)
      expect(
        await page
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")
      ).toContain(expectedStartMapPane)
      await getCountrySearchButton(page).click()
      expect(
        page.locator(".leaflet-proxy.leaflet-zoom-animated")
      ).not.toHaveAttribute("style", expectedStartMapPane)
    })

    test("select second country in country tab moves map to second approximate country location", async ({
      page,
    }) => {
      const expectedStartMapPane = "transform: translate3d(2048px, 2048px, 0px)"
      await page.goto(HOMEPAGE)
      expect(
        await page
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")
      ).toContain(expectedStartMapPane)
      await getCountrySearchButton(page).click()
      const expectedFirstCountryMapPane =
        (await page
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")) || ""
      // get second country in list of countries
      await page.locator(".country-slider-option").nth(1).click()
      expect(
        page.locator(".leaflet-proxy.leaflet-zoom-animated")
      ).not.toHaveAttribute("style", expectedFirstCountryMapPane)
    })

    test("should not navigate map to approximate country when station popup is open", async ({
      page,
    }) => {
      // load a country radio station, click the second location and the map should not navigate
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
      const expectedStationMapPane =
        (await page
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")) || ""
      // get second country in list of countries
      await page.locator(".country-slider-option").nth(1).click()
      expect(
        page.locator(".leaflet-proxy.leaflet-zoom-animated")
      ).toHaveAttribute("style", expectedStationMapPane)
    })
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

  test("second random country station request should call API with different offset number", async ({
    page,
  }) => {
    const apiCalls: string[] = []
    const expectedCountryCode = "US"
    await page.route(
      `*/**/json/stations/search?countrycode=${expectedCountryCode}&*`,
      async (route) => {
        apiCalls.push(route.request().url())
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE)
    await getCountrySearchButton(page).click()
    await clickRandomRadioStationButton(page)
    await clickRandomRadioStationButton(page)
    const offsets = new Set(
      apiCalls.map((apiCall) => new URLSearchParams(apiCall).get("offset"))
    )
    expect(offsets.size).toBe(2)
  })

  test("second random genre station request should call API with different offset number", async ({
    page,
  }) => {
    const apiCalls: string[] = []
    await page.route("*/**/json/stations/search?*", async (route) => {
      apiCalls.push(route.request().url())
      const json = [stationWithMultipleTags]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await getGenreSearchButton(page).click()
    await clickRandomRadioStationButton(page)
    await clickRandomRadioStationButton(page)
    const offsets = new Set(
      apiCalls.map((apiCall) => new URLSearchParams(apiCall).get("offset"))
    )
    expect(offsets.size).toBe(2)
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
