import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import {
  getGenreSearchButton,
  getRadioCardMapPopup,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { unitedStatesStation } from "./mocks/station"
import {
  getDrawerStationResultCard,
  getSearchStationForm,
  getSearchStationButton,
  getSearchStationDrawer,
  getStationSearchByNameInput,
} from "./constants/searchStationConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("radio station search form", () => {
  function getDrawerLoadMoreStationButton(page: Page) {
    return page.locator(".station-search-load-more-results-button")
  }

  test("display drawer with radio station search form", async ({ page }) => {
    test.slow()
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await expect(
      getSearchStationDrawer(page).locator(".drawer-title")
    ).toHaveText("Station Search")
    await expect(getSearchStationForm(page)).toBeVisible()
  })

  test("name more than 255 characters should not be allowed for radio station search form", async ({
    page,
  }) => {
    const count = 256
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getStationSearchByNameInput(page).fill("a".repeat(count))
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(
      getSearchStationDrawer(page).getByText(
        "Station Name cannot be longer than 255 characters"
      )
    ).toBeVisible()
  })

  test("search radio station for name shows one entry in drawer", async ({
    page,
  }) => {
    test.slow()
    const stationName = "vinyl hd"
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getStationSearchByNameInput(page).fill(stationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toBeVisible()
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
        getDrawerStationResultCard(page).getByText(expectedText)
      ).toBeVisible()
    }
    await expect(
      getDrawerStationResultCard(page).locator(".station-card-icon")
    ).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).locator(".station-card-icon")
    ).toHaveAttribute("src", unitedStatesStation.favicon)
    await expect(
      getDrawerStationResultCard(page).getByRole("button", {
        name: "load station",
      })
    ).toBeVisible()
  })

  test("click on drawer load station button for radio station result card loads station on map", async ({
    page,
  }) => {
    test.slow()
    const stationName = "vinyl hd"
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getStationSearchByNameInput(page).fill(stationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toBeVisible()
    await getDrawerStationResultCard(page)
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(getSearchStationDrawer(page)).not.toBeVisible()
    await expect(getRadioCardMapPopup(page)).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("link", {
        name: unitedStatesStation.homepage,
        exact: true,
      })
    ).toBeVisible()
    // genre button should have selected class set after station is loaded from drawer
    await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
  })

  test("load second set of station results when 'Load More Results' button is clicked", async ({
    page,
  }) => {
    const stationName = "vinyl hd"
    await page.route("*/**/json/stations/search?*", async (route) => {
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
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
    await getStationSearchByNameInput(page).fill(stationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toHaveCount(1)
    // check that more results are loaded during second request
    await expect(getDrawerLoadMoreStationButton(page)).toBeVisible()
    await getDrawerLoadMoreStationButton(page).click()
    await expect(getDrawerStationResultCard(page)).toHaveCount(2)
    await expect(
      getDrawerStationResultCard(page).nth(1).locator(".station-card-title")
    ).toHaveText("Classic Vinyl HD 2")
  })

  test("should disable 'Load More Results' button after no more results are found", async ({
    page,
  }) => {
    const stationName = "vinyl hd"
    await page.route("*/**/json/stations/search?*", async (route) => {
      const requestUrl = route.request().url()
      if (requestUrl.includes("offset=0")) {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      } else {
        await route.fulfill({ json: [] })
      }
    })
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
    await getStationSearchByNameInput(page).fill(stationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toHaveCount(1)
    await getDrawerLoadMoreStationButton(page).click()
    await expect(getDrawerLoadMoreStationButton(page)).toBeDisabled()
  })

  test("searching for new station criteria removes all existing search results", async ({
    page,
  }) => {
    const firstStationNameSearch = "first"
    const secondStationNameSearch = "second"
    await page.route("*/**/json/stations/search?*", async (route) => {
      const requestUrl = route.request().url()
      if (requestUrl.includes("name=first")) {
        const json = [{ ...unitedStatesStation, name: "first station name" }]
        await route.fulfill({ json })
      } else if (requestUrl.includes("name=second")) {
        const json = [{ ...unitedStatesStation, name: "second station name" }]
        await route.fulfill({ json })
      }
    })
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
    await getSearchStationForm(page)
      .getByLabel("Search By Name")
      .fill(firstStationNameSearch)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toHaveCount(1)
    await expect(
      getDrawerStationResultCard(page).nth(0).locator(".station-card-title")
    ).toHaveText("first station name")

    await getStationSearchByNameInput(page).clear()
    await getSearchStationForm(page)
      .getByLabel("Search By Name")
      .fill(secondStationNameSearch)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toHaveCount(1)
    await expect(
      getDrawerStationResultCard(page).nth(0).locator(".station-card-title")
    ).toHaveText("second station name")
  })

  test("no station found should not display 'Load More Results' button", async ({
    page,
  }) => {
    const stationName = "test"
    await page.route("*/**/json/stations/search?*", async (route) => {
      await route.fulfill({ json: [] })
    })
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
    await getStationSearchByNameInput(page).fill(stationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toHaveCount(0)
    await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
  })
})
