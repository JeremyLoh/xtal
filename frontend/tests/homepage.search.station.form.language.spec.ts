import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { cantoneseStation } from "./mocks/station"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"

test.describe("radio station search form language filter", () => {
  test("should display languages in select options", async ({ homePage }) => {
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
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    expect(
      await homePage
        .getSearchStationForm()
        .getLanguageOptions()
        .allTextContents()
    ).toEqual(
      expect.arrayContaining([...expectedLanguageOptions, "any language"])
    )
    await expect(
      homePage.getSearchStationForm().getLanguageOptions()
    ).toHaveCount(expectedLanguageOptions.length + 1) // add one for "any language"
  })

  test("display english as default language", async ({ homePage }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await expect(
      homePage.getSearchStationForm().getCurrentLanguageOption()
    ).toHaveValue("english")
    await homePage
      .getSearchStationForm()
      .getCurrentLanguageOption()
      .selectOption(["cantonese"])
    await expect(
      homePage.getSearchStationForm().getCurrentLanguageOption()
    ).toHaveValue("cantonese")
  })

  test("search for cantonese language radio station", async ({ homePage }) => {
    const name = cantoneseStation.name.split(" ").join("+")
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?name=${name}&limit=**`,
        async (route) => {
          // force test failure for searching endpoint without language search param
          const json = []
          await route.fulfill({ json })
        }
      )
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/search?**name=${name}**language=cantonese**`,
        async (route) => {
          const json = [cantoneseStation]
          await route.fulfill({ json })
        }
      )
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await homePage
      .getSearchStationForm()
      .getCurrentLanguageOption()
      .selectOption(["cantonese"])
    await homePage
      .getSearchStationForm()
      .getSearchNameInput()
      .fill(cantoneseStation.name)
    await homePage.getSearchStationForm().getSubmitButton().click()

    await expect(
      homePage.getDrawer().locator(".station-search-result-card")
    ).toBeVisible()
    await expect(
      homePage
        .getDrawer()
        .locator(".station-search-result-card")
        .getByText(cantoneseStation.name)
    ).toBeVisible()
  })
})
