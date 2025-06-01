import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { unitedStatesStation } from "./mocks/station"

test.describe("radio station search form", () => {
  test("display drawer with radio station search form", async ({
    homePage,
  }) => {
    test.slow()
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(homePage.getDrawerTitle()).toHaveText("Station Search")
    await expect(homePage.getSearchStationForm()).toBeVisible()
  })

  test("name more than 255 characters should not be allowed for radio station search form", async ({
    homePage,
  }) => {
    const count = 256
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage.getSearchStationFormNameInput().fill("a".repeat(count))
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(
      homePage
        .getDrawer()
        .getByText("Station Name cannot be longer than 255 characters")
    ).toBeVisible()
  })

  test("search radio station for name shows one entry in drawer", async ({
    homePage,
  }) => {
    test.slow()
    const stationName = "vinyl hd"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage.getSearchStationFormNameInput().fill(stationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toBeVisible()
    const expectedTextInStationResultCard = [
      unitedStatesStation.name,
      unitedStatesStation.bitrate.toString(),
      ...unitedStatesStation.tags.split(",").slice(0, 8), // first 8 station tags are shown
      unitedStatesStation.country,
      unitedStatesStation.votes.toString(),
      unitedStatesStation.language,
    ]
    for (const expectedText of expectedTextInStationResultCard) {
      await expect(
        homePage.getSearchStationResultCards().getByText(expectedText)
      ).toBeVisible()
    }
    await expect(
      homePage.getSearchStationResultCards().locator(".station-card-icon")
    ).toBeVisible()
    await expect(
      homePage.getSearchStationResultCards().locator(".station-card-icon")
    ).toHaveAttribute("src", unitedStatesStation.favicon)
    await expect(
      homePage.getSearchStationResultCards().getByRole("button", {
        name: "load station",
      })
    ).toBeVisible()
  })

  test("click on drawer load station button for radio station result card loads station on map", async ({
    homePage,
  }) => {
    test.slow()
    const stationName = "vinyl hd"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage.getSearchStationFormNameInput().fill(stationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toBeVisible()
    await homePage
      .getSearchStationResultCards()
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(homePage.getDrawer()).not.toBeVisible()
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
    // genre button should have selected class set after station is loaded from drawer
    await expect(homePage.getGenreSearchButton()).toHaveClass(/selected/)
  })

  test("load second set of station results when 'Load More Results' button is clicked", async ({
    homePage,
  }) => {
    const stationName = "vinyl hd"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const requestUrl = route.request().url()
        if (requestUrl.includes("offset=0")) {
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        } else if (requestUrl.includes("offset=10")) {
          // assumption that limit for each request is 10
          const json = [
            { ...unitedStatesStation, name: unitedStatesStation.name + " 2" },
          ]
          await route.fulfill({ json })
        }
      })
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(
      homePage.getSearchStationLoadMoreResultsButton()
    ).not.toBeVisible()
    await homePage.getSearchStationFormNameInput().fill(stationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(1)
    // check that more results are loaded during second request
    await expect(homePage.getSearchStationLoadMoreResultsButton()).toBeVisible()
    await homePage.getSearchStationLoadMoreResultsButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(2)
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(1)
        .locator(".station-card-title")
    ).toHaveText("Classic Vinyl HD 2")
  })

  test("should disable 'Load More Results' button after no more results are found", async ({
    homePage,
  }) => {
    const stationName = "vinyl hd"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const requestUrl = route.request().url()
        if (requestUrl.includes("offset=0")) {
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        } else {
          await route.fulfill({ json: [] })
        }
      })
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(
      homePage.getSearchStationLoadMoreResultsButton()
    ).not.toBeVisible()
    await homePage.getSearchStationFormNameInput().fill(stationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(1)
    await homePage.getSearchStationLoadMoreResultsButton().click()
    await expect(
      homePage.getSearchStationLoadMoreResultsButton()
    ).toBeDisabled()
  })

  test("searching for new station criteria removes all existing search results", async ({
    homePage,
  }) => {
    const firstStationNameSearch = "first"
    const secondStationNameSearch = "second"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const requestUrl = route.request().url()
        if (requestUrl.includes("name=first")) {
          const json = [{ ...unitedStatesStation, name: "first station name" }]
          await route.fulfill({ json })
        } else if (requestUrl.includes("name=second")) {
          const json = [{ ...unitedStatesStation, name: "second station name" }]
          await route.fulfill({ json })
        }
      })
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(
      homePage.getSearchStationLoadMoreResultsButton()
    ).not.toBeVisible()
    await homePage.getSearchStationFormNameInput().fill(firstStationNameSearch)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(1)
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .locator(".station-card-title")
    ).toHaveText("first station name")

    await homePage.getSearchStationFormNameInput().clear()
    await homePage.getSearchStationFormNameInput().fill(secondStationNameSearch)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(1)
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .locator(".station-card-title")
    ).toHaveText("second station name")
  })

  test("no station found should not display 'Load More Results' button", async ({
    homePage,
  }) => {
    const stationName = "test"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        await route.fulfill({ json: [] })
      })
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(
      homePage.getSearchStationLoadMoreResultsButton()
    ).not.toBeVisible()
    await homePage.getSearchStationFormNameInput().fill(stationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(0)
    await expect(
      homePage.getSearchStationLoadMoreResultsButton()
    ).not.toBeVisible()
  })
})
