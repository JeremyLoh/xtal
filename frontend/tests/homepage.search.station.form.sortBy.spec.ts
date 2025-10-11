import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { StationBuilder } from "./mocks/station"
import { Station } from "../src/api/radiobrowser/types"

test.describe("radio station search form sort options", () => {
  test("display available sort options", async ({ homePage }) => {
    const expectedSortOptions = ["none", "bitrate", "votes"]
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    expect(
      await homePage.getSearchStationFormSortOptions().allTextContents()
    ).toEqual(expect.arrayContaining([...expectedSortOptions]))
    await expect(homePage.getSearchStationFormSortOptions()).toHaveCount(
      expectedSortOptions.length
    )
  })

  test("sort by none does not sort station results", async ({ homePage }) => {
    const stationNameSearch = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(stationNameSearch)
    mockedStations.push(stationBuilder.getStation())
    stationBuilder.withName(stationNameSearch + " 2")
    mockedStations.push(stationBuilder.getStation())
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${stationNameSearch}**`,
        async (route) => {
          const json = mockedStations
          await route.fulfill({ json })
        }
      )
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${stationNameSearch}**order=**`,
        async (route) => {
          // ensure that order search param is not called
          await route.fulfill({ json: [] })
        }
      )
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormNameInput().fill(stationNameSearch)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(2)
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .getByText(stationNameSearch, { exact: true })
    ).toBeVisible()
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(1)
        .getByText(stationNameSearch + " 2", { exact: true })
    ).toBeVisible()
  })

  test("sort by bitrate shows station results in descending order by default", async ({
    homePage,
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
    await homePage
      .getPage()
      .route(
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
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormNameInput().fill(stationNameSearch)
    await homePage.getSearchStationFormSortSelect().selectOption(["bitrate"])
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(2)

    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .getByText(stationNameSearch + " higher bitrate", { exact: true })
    ).toBeVisible()
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .getByText("128 kbps", { exact: true })
    ).toBeVisible()

    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(1)
        .getByText(stationNameSearch, { exact: true })
    ).toBeVisible()
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(1)
        .getByText("64 kbps", { exact: true })
    ).toBeVisible()
  })

  test("sort by votes shows station results in descending order by default", async ({
    homePage,
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
    await homePage
      .getPage()
      .route(
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
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormNameInput().fill(stationNameSearch)
    await homePage.getSearchStationFormSortSelect().selectOption(["votes"])
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toHaveCount(2)
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .getByText(stationNameSearch + " higher votes", { exact: true })
    ).toBeVisible()
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(0)
        .getByText("200", { exact: true })
    ).toBeVisible()
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(1)
        .getByText(stationNameSearch, { exact: true })
    ).toBeVisible()
    await expect(
      homePage
        .getSearchStationResultCards()
        .nth(1)
        .getByText("5", { exact: true })
    ).toBeVisible()
  })
})
