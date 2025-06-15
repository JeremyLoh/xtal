import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { stationWithMultipleTags, unitedStatesStation } from "./mocks/station"
import HomePage from "./pageObjects/HomePage"

test.describe("radio station search type", () => {
  test("display genre tab with 'selected' CSS className", async ({
    homePage,
  }) => {
    await homePage.goto()
    // Genre tab should be selected by default, "selected" class
    await expect(homePage.getGenreSearchButton()).toHaveClass(/selected/)
    await expect(homePage.getCountrySearchButton()).not.toHaveClass(/selected/)
  })

  test("display genre and country tab above slider", async ({ homePage }) => {
    await homePage.goto()
    await expect(homePage.getGenreSearchButton()).toBeVisible()
    await expect(homePage.getCountrySearchButton()).toBeVisible()
  })

  test("display country options in slider when country tab is clicked", async ({
    homePage,
  }) => {
    const expectedCountryCount = 65
    await homePage.goto()
    await expect(homePage.getCountrySearchButton()).not.toHaveClass(/selected/)
    await homePage.getCountrySearchButton().click()
    await expect(homePage.getCountrySearchButton()).toHaveClass(/selected/)
    await expect(homePage.getCountrySearchSliderOptions()).toHaveCount(
      expectedCountryCount
    )
  })

  test.describe("country tab (only runs in headed mode)", () => {
    test("country tab first selected moves map to approximate country location", async ({
      homePage,
      headless,
    }) => {
      test.skip(headless, "UI element does not does not work in headless mode")
      test.slow()
      await homePage.goto()
      const expectedStartMapPane =
        (await homePage
          .getPage()
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")) || ""
      await homePage.getCountrySearchButton().click()
      await expect(
        homePage.getPage().locator(".leaflet-proxy.leaflet-zoom-animated")
      ).not.toHaveAttribute("style", expectedStartMapPane)
    })

    test("select second country in country tab moves map to second approximate country location", async ({
      homePage,
      headless,
    }) => {
      test.skip(headless, "UI element does not does not work in headless mode")
      test.slow()
      await homePage.goto()
      await homePage.getCountrySearchButton().click()
      const expectedFirstCountryMapPane =
        (await homePage
          .getPage()
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")) || ""
      // get second country in list of countries
      await homePage.getCountrySearchSliderOptions().nth(1).click()
      await expect(
        homePage.getPage().locator(".leaflet-proxy.leaflet-zoom-animated")
      ).not.toHaveAttribute("style", expectedFirstCountryMapPane)
    })

    test("should not navigate map to approximate country when station popup is open", async ({
      homePage,
      headless,
    }) => {
      test.skip(headless, "UI element does not does not work in headless mode")
      test.slow()
      // load a country radio station, click the second location and the map should not navigate
      const expectedCountryCode = "US"
      await homePage
        .getPage()
        .route(
          `*/**/json/stations/search?countrycode=${expectedCountryCode}&*`,
          async (route) => {
            const json = [unitedStatesStation]
            await route.fulfill({ json })
          }
        )
      await homePage.goto()
      await homePage.getCountrySearchButton().click()
      await homePage.clickRandomRadioStationButton()
      await homePage.getPage().waitForTimeout(2000) // test fails without waiting for the map navigation to finish
      const expectedStationMapPane =
        (await homePage
          .getPage()
          .locator(".leaflet-proxy.leaflet-zoom-animated")
          .getAttribute("style")) || ""
      // get second country in list of countries
      await homePage.getCountrySearchSliderOptions().nth(1).click()
      await expect(
        homePage.getPage().locator(".leaflet-proxy.leaflet-zoom-animated")
      ).toHaveAttribute("style", expectedStationMapPane)
    })
  })

  test("search random station by country", async ({ homePage }) => {
    const expectedCountryCode = "US"
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?countrycode=${expectedCountryCode}&*`,
        async (route) => {
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        }
      )
    await homePage.goto()
    await homePage.getCountrySearchButton().click()
    await homePage.clickRandomRadioStationButton()
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("link", {
        name: unitedStatesStation.homepage,
        exact: true,
      })
    ).toBeVisible()
  })

  test("second random country station request should call API with different offset number", async ({
    homePage,
  }) => {
    test.slow()
    const apiCalls: string[] = []
    const expectedCountryCode = "US"
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?countrycode=${expectedCountryCode}&*`,
        async (route) => {
          apiCalls.push(route.request().url())
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        }
      )
    await homePage.goto()
    await homePage.getCountrySearchButton().click()
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRandomRadioStationButton()
    const offsets = new Set(
      apiCalls.map((apiCall) => new URLSearchParams(apiCall).get("offset"))
    )
    expect(offsets.size).toBeGreaterThan(1)
  })

  test("second random genre station request should call API with different offset number", async ({
    homePage,
  }) => {
    test.slow()
    const apiCalls: string[] = []
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        apiCalls.push(route.request().url())
        const json = [stationWithMultipleTags]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.getGenreSearchButton().click()
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRandomRadioStationButton()
    const offsets = new Set(
      apiCalls.map((apiCall) => new URLSearchParams(apiCall).get("offset"))
    )
    expect(offsets.size).toBeGreaterThan(1)
  })
})

test.describe("select genre of random radio station", () => {
  async function assertGenreIsInView(homePage: HomePage, genre: string) {
    await expect(
      homePage.getGenreSliderContainer().getByText(genre, { exact: true })
    ).toBeInViewport()
  }
  async function assertGenreIsNotInView(homePage: HomePage, genre: string) {
    await expect(
      homePage.getGenreSliderContainer().getByText(genre, { exact: true })
    ).not.toBeInViewport()
  }

  test("display genre labels and slide left and right icon", async ({
    homePage,
  }) => {
    await homePage.goto()
    const firstGenre = "All"
    await expect(homePage.getPage().locator(".slider-container")).toBeVisible()
    await assertGenreIsInView(homePage, firstGenre)
    await expect(homePage.getGenreSlideLeftIcon()).toBeVisible()
    await expect(homePage.getGenreSlideRightIcon()).toBeVisible()
  })

  test("click slide to right icon does not show first genre anymore ('All' genre)", async ({
    homePage,
  }) => {
    await homePage.goto()
    const firstGenre = "All"
    // expect "All" genre tag will disappear after sliding to right
    await assertGenreIsInView(homePage, firstGenre)
    await homePage.getGenreSlideRightIcon().click()
    await assertGenreIsNotInView(homePage, firstGenre)
  })

  test("click slide to left icon shows the first genre, after slide to right has been done", async ({
    homePage,
  }) => {
    await homePage.goto()
    const firstGenre = "All"
    await assertGenreIsInView(homePage, firstGenre)
    await homePage.getGenreSlideRightIcon().click()
    await assertGenreIsNotInView(homePage, firstGenre)
    await homePage.getGenreSlideLeftIcon().click()
    await assertGenreIsInView(homePage, firstGenre)
  })

  test("selecting a different genre add 'selected' css class to genre", async ({
    homePage,
  }) => {
    await homePage.goto()
    const firstGenre = "All"
    const secondGenre = "Alternative"
    await assertGenreIsInView(homePage, firstGenre)
    await assertGenreIsInView(homePage, secondGenre)
    await expect(
      homePage.getGenreSliderContainer().locator(".selected")
    ).toHaveText(firstGenre)
    await homePage
      .getGenreSliderContainer()
      .getByText(secondGenre, { exact: true })
      .click()
    await expect(
      homePage.getGenreSliderContainer().locator(".selected")
    ).toHaveText(secondGenre)
  })
})
