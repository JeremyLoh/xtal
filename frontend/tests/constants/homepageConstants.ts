import { Page } from "@playwright/test"

export const HOMEPAGE = "http://localhost:5173"

export async function clickRandomRadioStationButton(page: Page) {
  await page.getByTestId("random-radio-station-btn").isEnabled()
  await page.getByTestId("random-radio-station-btn").click()
}

export function getDrawerComponent(page: Page) {
  return page.locator(".drawer")
}

export function getGenreSearchButton(page: Page) {
  return page.locator("#station-search-type-container .genre-search-button")
}

export function getCountrySearchButton(page: Page) {
  return page.locator("#station-search-type-container .country-search-button")
}
