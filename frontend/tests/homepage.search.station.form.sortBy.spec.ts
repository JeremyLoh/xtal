import test, { expect, Page } from "@playwright/test"
import { StationBuilder } from "./mocks/station"
import { Station } from "../src/api/radiobrowser/types"
import { HOMEPAGE } from "./constants"

function getSearchStationButton(page: Page) {
  return page.getByRole("button", { name: "search stations" })
}
function getDrawerComponent(page: Page) {
  return page.locator(".drawer")
}
function getForm(page: Page) {
  return getDrawerComponent(page).locator(
    ".drawer-content .station-search-form"
  )
}
function getStationSearchByNameInput(page: Page) {
  return getForm(page).getByLabel("Search By Name")
}
function getDrawerStationResultCard(page: Page) {
  return page.locator(".station-search-result-card")
}

test.describe("radio station search form sort options", () => {
  function getSortSelect(page: Page) {
    return getForm(page).locator("select#sort")
  }

  test("display available sort options", async ({ page }) => {
    const expectedSortOptions = ["none", "bitrate", "votes"]
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
      getDrawerStationResultCard(page).nth(0).getByText("200", { exact: true })
    ).toBeVisible()
    await expect(
      getDrawerStationResultCard(page)
        .nth(1)
        .getByText(stationNameSearch, { exact: true })
    ).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).nth(1).getByText("5", { exact: true })
    ).toBeVisible()
  })
})
