import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants"
import {
  cantoneseStation,
  StationBuilder,
  unitedStatesStation,
} from "./mocks/station"
import { Station } from "../src/api/radiobrowser/types"

test.describe("search drawer for finding radio stations", () => {
  test.beforeEach(({ headless }) => {
    test.skip(headless, "UI element does not does not work in headless mode")
  })

  function getSearchStationButton(page: Page) {
    return page.getByRole("button", { name: "search stations" })
  }
  function getDrawerComponent(page: Page) {
    return page.locator(".drawer")
  }

  test.describe("drawer functionality", () => {
    function getDrawerContainer(page: Page) {
      return page.locator(".drawer-background-container")
    }
    function getDrawerDragButton(page: Page) {
      return page.locator(".drawer-drag-button")
    }
    function getDrawerCloseButton(page: Page) {
      return page.locator(".drawer-close-button")
    }

    test("display drawer after search button click", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await expect(getSearchStationButton(page)).toBeVisible()
      await getSearchStationButton(page).click()
      await expect(getSearchStationButton(page)).toHaveClass(/selected/)
      await expect(getDrawerComponent(page)).toBeVisible()
    })

    test("close drawer when close icon is clicked", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getDrawerCloseButton(page).click()
      await expect(getDrawerComponent(page)).not.toBeVisible()
    })

    test("close drawer on outside drawer click", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getDrawerComponent(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getDrawerContainer(page).click({ position: { x: 0, y: 0 } })
      await expect(getDrawerComponent(page)).not.toBeVisible()
    })

    test("does not close drawer on small drag down of less than 100px", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getDrawerDragButton(page).hover()
      const dragButtonBounds = (await getDrawerDragButton(page).boundingBox())!
      await page.mouse.down()
      await page.mouse.move(
        0,
        dragButtonBounds.y + dragButtonBounds.height / 2 + 51
      )
      await page.mouse.up()
      await expect(getDrawerComponent(page)).toBeVisible()
    })

    test("close drawer on drag down of more than 100px", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getDrawerDragButton(page).hover()
      const dragButtonBounds = (await getDrawerDragButton(page).boundingBox())!
      await page.mouse.down()
      await page.mouse.move(
        0,
        dragButtonBounds.y + dragButtonBounds.height / 2 + 270
      )
      await page.mouse.up()
      await expect(getDrawerComponent(page)).not.toBeVisible()
    })
  })

  test.describe("radio station search form", () => {
    function getDrawerStationResultCard(page: Page) {
      return page.locator(".station-search-result-card")
    }
    function getDrawerLoadMoreStationButton(page: Page) {
      return page.locator(".station-search-load-more-results-button")
    }
    function getForm(page: Page) {
      return getDrawerComponent(page).locator(
        ".drawer-content .station-search-form"
      )
    }
    function getStationSearchByNameInput(page: Page) {
      return getForm(page).getByLabel("Search By Name")
    }
    function getRadioCardPopup(page: Page) {
      return page.locator("#map .radio-card")
    }

    test("display drawer with radio station search form", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await expect(
        getDrawerComponent(page).locator(".drawer-title")
      ).toHaveText("Station Search")
      await expect(getForm(page)).toBeVisible()
    })

    test("empty name should not be allowed for radio station search form", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getStationSearchByNameInput(page).fill("")
      await getForm(page).locator("button[type='submit']").click()
      await expect(
        getDrawerComponent(page).getByText("Station Name is required")
      ).toBeVisible()
    })

    test("name more than 255 characters should not be allowed for radio station search form", async ({
      page,
    }) => {
      const count = 256
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getStationSearchByNameInput(page).fill("a".repeat(count))
      await getForm(page).locator("button[type='submit']").click()
      await expect(
        getDrawerComponent(page).getByText(
          "Station Name cannot be longer than 255 characters"
        )
      ).toBeVisible()
    })

    test.describe("language filter", () => {
      test("should display languages in select options", async ({ page }) => {
        const expectedLanguageOptions = [
          "english",
          "spanish",
          "german",
          "french",
          "chinese",
          "russian",
          "italian",
          "greek",
          "polish",
          "portuguese",
          "hindi",
          "dutch",
          "tamil",
          "romanian",
          "arabic",
          "serbian",
          "ukrainian",
          "hungarian",
          "turkish",
          "czech",
          "croatian",
          "japanese",
          "malayalam",
          "filipino",
          "indonesian",
          "swedish",
          "slovak",
          "bosnian",
          "catalan",
          "danish",
          "cantonese",
          "bahasa indonesia",
          "bulgarian",
          "finnish",
          "korean",
          "slovenian",
          "hebrew",
          "persian",
          "thai",
          "swiss german",
          "estonian",
          "norwegian",
          "urdu",
          "swahili",
          "kannada",
          "malay",
          "lithuanian",
          "mandarin",
          "sinhala",
          "macedonian",
          "kazakh",
          "latvian",
          "kurdish",
          "georgian",
          "afrikaans",
          "azerbaijani",
          "amharic",
          "tagalog",
          "belarusian",
          "telugu",
          "vietnamese",
        ]
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        expect(
          await getForm(page)
            .locator("select#language option")
            .allTextContents()
        ).toEqual(
          expect.arrayContaining([...expectedLanguageOptions, "any language"])
        )
        await expect(
          getForm(page).locator("select#language option")
        ).toHaveCount(expectedLanguageOptions.length + 1) // add one for "Any Language"
      })

      test("display english as default language", async ({ page }) => {
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        await expect(getForm(page).locator("select#language")).toHaveValue(
          "english"
        )
        await getForm(page)
          .locator("select#language")
          .selectOption(["cantonese"])
        await expect(getForm(page).locator("select#language")).toHaveValue(
          "cantonese"
        )
      })

      test("search for cantonese language radio station", async ({ page }) => {
        const name = cantoneseStation.name.split(" ").join("+")
        await page.route(
          `*/**/json/stations/search?name=${name}&limit=**`,
          async (route) => {
            // force test failure for searching endpoint without language search param
            const json = []
            await route.fulfill({ json })
          }
        )
        await page.route(
          `*/**/json/stations/search?**name=${name}**language=cantonese**`,
          async (route) => {
            const json = [cantoneseStation]
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        await getForm(page)
          .locator("select#language")
          .selectOption(["cantonese"])
        await getStationSearchByNameInput(page).fill(cantoneseStation.name)
        await getForm(page).locator("button[type='submit']").click()
        await expect(getDrawerStationResultCard(page)).toBeVisible()
        await expect(
          getDrawerStationResultCard(page).getByText(cantoneseStation.name)
        ).toBeVisible()
      })
    })

    test.describe("sort results", () => {
      function getSortSelect(page: Page) {
        return getForm(page).locator("select#sort")
      }

      test("display available sort options", async ({ page }) => {
        const expectedSortOptions = ["none", "bitrate", "votes", "clickcount"]
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        expect(
          await getSortSelect(page).locator("option").allTextContents()
        ).toEqual(expect.arrayContaining([...expectedSortOptions]))
        await expect(getForm(page).locator("select#sort option")).toHaveCount(
          expectedSortOptions.length
        )
      })

      test("sort by none does not sort station results", async ({ page }) => {
        const stationNameSearch = "test"
        const mockedStations: Station[] = []
        const stationBuilder = new StationBuilder()
        stationBuilder.withName(stationNameSearch)
        mockedStations.push(stationBuilder.getStation())
        stationBuilder.withName(stationNameSearch + " 2")
        mockedStations.push(stationBuilder.getStation())
        await page.route(
          `*/**/json/stations/search?**name=${stationNameSearch}**`,
          async (route) => {
            const json = mockedStations
            await route.fulfill({ json })
          }
        )
        await page.route(
          `*/**/json/stations/search?**name=${stationNameSearch}**order=**`,
          async (route) => {
            // ensure that order search param is not called
            const json = []
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        await getStationSearchByNameInput(page).fill(stationNameSearch)
        await getForm(page).locator("button[type='submit']").click()
        await expect(getDrawerStationResultCard(page)).toHaveCount(2)
        await expect(
          getDrawerStationResultCard(page)
            .nth(0)
            .getByText(stationNameSearch, { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(1)
            .getByText(stationNameSearch + " 2", { exact: true })
        ).toBeVisible()
      })

      test("sort by bitrate shows station results in descending order by default", async ({
        page,
      }) => {
        const stationNameSearch = "test"
        const mockedStations: Station[] = []
        const stationBuilder = new StationBuilder()
        stationBuilder.withName(stationNameSearch + " higher bitrate")
        stationBuilder.withBitrate(128)
        mockedStations.push(stationBuilder.getStation())
        stationBuilder.withName(stationNameSearch)
        stationBuilder.withBitrate(64)
        mockedStations.push(stationBuilder.getStation())
        await page.route(
          `*/**/json/stations/search?**name=${stationNameSearch}**`,
          async (route) => {
            if (route.request().url().includes("order=bitrate&reverse=true")) {
              const json = mockedStations
              await route.fulfill({ json })
            } else {
              await route.fulfill({ json: [] })
            }
          }
        )
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        await getStationSearchByNameInput(page).fill(stationNameSearch)
        await getSortSelect(page).selectOption(["bitrate"])
        await getForm(page).locator("button[type='submit']").click()
        await expect(getDrawerStationResultCard(page)).toHaveCount(2)
        await expect(
          getDrawerStationResultCard(page)
            .nth(0)
            .getByText(stationNameSearch + " higher bitrate", { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(0)
            .getByText("128 kbps", { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(1)
            .getByText(stationNameSearch, { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(1)
            .getByText("64 kbps", { exact: true })
        ).toBeVisible()
      })

      test("sort by votes shows station results in descending order by default", async ({
        page,
      }) => {
        const stationNameSearch = "test"
        const mockedStations: Station[] = []
        const stationBuilder = new StationBuilder()
        stationBuilder.withName(stationNameSearch + " higher votes")
        stationBuilder.withVotes(200)
        mockedStations.push(stationBuilder.getStation())
        stationBuilder.withName(stationNameSearch)
        stationBuilder.withVotes(5)
        mockedStations.push(stationBuilder.getStation())
        await page.route(
          `*/**/json/stations/search?**name=${stationNameSearch}**`,
          async (route) => {
            if (route.request().url().includes("order=votes&reverse=true")) {
              const json = mockedStations
              await route.fulfill({ json })
            } else {
              await route.fulfill({ json: [] })
            }
          }
        )
        await page.goto(HOMEPAGE)
        await getSearchStationButton(page).click()
        await getStationSearchByNameInput(page).fill(stationNameSearch)
        await getSortSelect(page).selectOption(["votes"])
        await getForm(page).locator("button[type='submit']").click()
        await expect(getDrawerStationResultCard(page)).toHaveCount(2)
        await expect(
          getDrawerStationResultCard(page)
            .nth(0)
            .getByText(stationNameSearch + " higher votes", { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(0)
            .getByText("200", { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(1)
            .getByText(stationNameSearch, { exact: true })
        ).toBeVisible()
        await expect(
          getDrawerStationResultCard(page)
            .nth(1)
            .getByText("5", { exact: true })
        ).toBeVisible()
      })
    })

    test("search radio station for name shows one entry in drawer", async ({
      page,
    }) => {
      const stationName = "vinyl hd"
      await page.route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getStationSearchByNameInput(page).fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
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
      const stationName = "vinyl hd"
      await page.route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getStationSearchByNameInput(page).fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
      await expect(getDrawerStationResultCard(page)).toBeVisible()
      await getDrawerStationResultCard(page)
        .getByRole("button", {
          name: "load station",
        })
        .click()
      await expect(getDrawerComponent(page)).not.toBeVisible()
      await expect(getRadioCardPopup(page)).toBeVisible()
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
      await expect(getDrawerComponent(page)).toBeVisible()
      await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
      await getStationSearchByNameInput(page).fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
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
      await expect(getDrawerComponent(page)).toBeVisible()
      await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
      await getStationSearchByNameInput(page).fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
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
      await expect(getDrawerComponent(page)).toBeVisible()
      await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
      await getForm(page)
        .getByLabel("Search By Name")
        .fill(firstStationNameSearch)
      await getForm(page).locator("button[type='submit']").click()
      await expect(getDrawerStationResultCard(page)).toHaveCount(1)
      await expect(
        getDrawerStationResultCard(page).nth(0).locator(".station-card-title")
      ).toHaveText("first station name")

      await getStationSearchByNameInput(page).clear()
      await getForm(page)
        .getByLabel("Search By Name")
        .fill(secondStationNameSearch)
      await getForm(page).locator("button[type='submit']").click()
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
      await expect(getDrawerComponent(page)).toBeVisible()
      await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
      await getStationSearchByNameInput(page).fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
      await expect(getDrawerStationResultCard(page)).toHaveCount(0)
      await expect(getDrawerLoadMoreStationButton(page)).not.toBeVisible()
    })
  })
})
