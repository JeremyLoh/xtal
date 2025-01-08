import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants"
import { cantoneseStation } from "./mocks/station"
import {
  getDrawerStationResultCard,
  getSearchStationForm,
  getSearchStationButton,
  getStationSearchByNameInput,
} from "./constants/searchStationConstants"

test.describe("radio station search form language filter", () => {
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
      await getSearchStationForm(page)
        .locator("select#language option")
        .allTextContents()
    ).toEqual(
      expect.arrayContaining([...expectedLanguageOptions, "any language"])
    )
    await expect(
      getSearchStationForm(page).locator("select#language option")
    ).toHaveCount(expectedLanguageOptions.length + 1) // add one for "any language"
  })

  test("display english as default language", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(
      getSearchStationForm(page).locator("select#language")
    ).toHaveValue("english")
    await getSearchStationForm(page)
      .locator("select#language")
      .selectOption(["cantonese"])
    await expect(
      getSearchStationForm(page).locator("select#language")
    ).toHaveValue("cantonese")
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
    await getSearchStationForm(page)
      .locator("select#language")
      .selectOption(["cantonese"])
    await getStationSearchByNameInput(page).fill(cantoneseStation.name)
    await getSearchStationForm(page).locator("button[type='submit']").click()
    await expect(getDrawerStationResultCard(page)).toBeVisible()
    await expect(
      getDrawerStationResultCard(page).getByText(cantoneseStation.name)
    ).toBeVisible()
  })
})
