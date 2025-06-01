import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { StationBuilder } from "./mocks/station"
import { Station } from "../src/api/radiobrowser/types"

test.describe("radio station search form tag filter", () => {
  test("should display tag filter in radio station search form", async ({
    homePage,
  }) => {
    const expectedTag = "rock"
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getSearchStationFormTagInput()).toBeVisible()
    await homePage.getSearchStationFormTagInput().fill(expectedTag)
  })

  test("should allow empty tag search", async ({ homePage }) => {
    const expectedTag = "rock"
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${expectedStationName}**`,
        async (route) => {
          if (route.request().url().includes("tag=")) {
            await route.fulfill({ json: [] })
          } else {
            const json = mockedStations
            await route.fulfill({ json })
          }
        }
      )
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormNameInput().fill(expectedStationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toBeVisible()
    await expect(
      homePage.getSearchStationResultCards().getByText(expectedStationName)
    ).toBeVisible()
    await expect(
      homePage.getSearchStationResultCards().getByText(expectedTag)
    ).toBeVisible()
  })

  test("should search by given tag filter", async ({ homePage }) => {
    const expectedTag = "rock"
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${expectedStationName}**`,
        async (route) => {
          if (route.request().url().includes(`tag=${expectedTag}`)) {
            const json = mockedStations
            await route.fulfill({ json })
          } else {
            await route.fulfill({ json: [] })
          }
        }
      )
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormTagInput().fill(expectedTag)
    await homePage.getSearchStationFormNameInput().fill(expectedStationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).toBeVisible()
    await expect(
      homePage.getSearchStationResultCards().getByText(expectedStationName)
    ).toBeVisible()
    await expect(
      homePage.getSearchStationResultCards().getByText(expectedTag)
    ).toBeVisible()
  })

  test("should trim whitespace of given tag used for search", async ({
    homePage,
  }) => {
    const expectedTag = "rock"
    const tagInput = "  " + expectedTag + "  "
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${expectedStationName}**`,
        async (route) => {
          if (route.request().url().includes(`tag=++${expectedTag}++`)) {
            // check for space character in tag search ("+" for each space)
            await route.fulfill({ json: [] })
          } else {
            const json = mockedStations
            await route.fulfill({ json })
          }
        }
      )
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormTagInput().fill(tagInput)
    await homePage.getSearchStationFormNameInput().fill(expectedStationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(
      homePage.getSearchStationResultCards().getByText(expectedStationName)
    ).toBeVisible()
  })

  test("should limit max tag length to 30 characters", async ({ homePage }) => {
    const expectedTag = "a".repeat(31)
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${expectedStationName}**`,
        async (route) => {
          if (route.request().url().includes(`tag=${expectedTag}`)) {
            const json = mockedStations
            await route.fulfill({ json })
          } else {
            await route.fulfill({ json: [] })
          }
        }
      )
    await homePage.goto()
    await homePage.getSearchStationButton().click()
    await homePage.getSearchStationFormTagInput().fill(expectedTag)
    await homePage.getSearchStationFormNameInput().fill(expectedStationName)
    await homePage.getSearchStationFormSubmitButton().click()
    await expect(homePage.getSearchStationResultCards()).not.toBeVisible()
    await expect(
      homePage.getDrawer().getByText("Tag cannot be longer than 30 characters")
    ).toBeVisible()
  })
})
