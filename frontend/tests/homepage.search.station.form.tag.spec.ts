import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants"
import {
  getDrawerStationResultCard,
  getSearchStationForm,
  getSearchStationButton,
  getSearchStationDrawer,
  getStationSearchByNameInput,
} from "./constants/searchStationConstants"
import { StationBuilder } from "./mocks/station"
import { Station } from "../src/api/radiobrowser/types"

test.describe("radio station search form tag filter", () => {
  function getTagFilterInput(page: Page) {
    return getSearchStationForm(page).locator("input#tag")
  }

  test("should display tag filter in radio station search form", async ({
    page,
  }) => {
    const expectedTag = "rock"
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getTagFilterInput(page)).toBeVisible()
    await getTagFilterInput(page).fill(expectedTag)
  })

  test("should allow empty tag search", async ({ page }) => {
    const expectedTag = "rock"
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await page.route(
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
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await getStationSearchByNameInput(page).fill(expectedStationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).getByText(expectedStationName)
    ).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).getByText(expectedTag)
    ).toBeVisible()
  })

  test("should search by given tag filter", async ({ page }) => {
    const expectedTag = "rock"
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await page.route(
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
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await getTagFilterInput(page).fill(expectedTag)
    await getStationSearchByNameInput(page).fill(expectedStationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).getByText(expectedStationName)
    ).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).getByText(expectedTag)
    ).toBeVisible()
  })

  test("should trim whitespace of given tag used for search", async ({
    page,
  }) => {
    const expectedTag = "rock"
    const tagInput = "  " + expectedTag + "  "
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await page.route(
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
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await getTagFilterInput(page).fill(tagInput)
    await getStationSearchByNameInput(page).fill(expectedStationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(
      getDrawerStationResultCard(page).getByText(expectedStationName)
    ).toBeVisible()
  })

  test("should limit max tag length to 30 characters", async ({ page }) => {
    const expectedTag = "a".repeat(31)
    const expectedStationName = "test"
    const mockedStations: Station[] = []
    const stationBuilder = new StationBuilder()
    stationBuilder.withName(expectedStationName)
    stationBuilder.withTags(expectedTag)
    mockedStations.push(stationBuilder.getStation())
    await page.route(
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
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await getTagFilterInput(page).fill(expectedTag)
    await getStationSearchByNameInput(page).fill(expectedStationName)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).not.toBeVisible()
    await expect(
      getSearchStationDrawer(page).getByText(
        "Tag cannot be longer than 30 characters"
      )
    ).toBeVisible()
  })
})
