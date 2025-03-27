import { expect, Page } from "@playwright/test"

export const HOMEPAGE = "http://localhost:5173"

export async function clickRandomRadioStationButton(page: Page) {
  await expect(page.getByTestId("random-radio-station-button")).toBeEnabled()
  await page.getByTestId("random-radio-station-button").click()
}

export function getGenreSearchButton(page: Page) {
  return page.locator("#station-search-type-container .genre-search-button")
}

export function getCountrySearchButton(page: Page) {
  return page.locator("#station-search-type-container .country-search-button")
}

export function getRadioCardMapPopup(page: Page) {
  return page.locator("#map .radio-card")
}

export function getRadioStationMapPopupCloseButton(page: Page) {
  return page.locator(".leaflet-popup-close-button")
}

export async function assertToastMessage(
  page: Page,
  message: string,
  count: number = 1
) {
  await expect(page.locator(".toaster").getByText(message)).toHaveCount(count)
}

export async function assertToastMessageIsMissing(page: Page, message: string) {
  await expect(page.locator(".toaster").getByText(message)).toHaveCount(0)
}

export function getNavbarRadioLink(page: Page) {
  return page.locator(".header-navbar-radio-link")
}

export function getNavbarPodcastLink(page: Page) {
  return page.locator(".header-navbar-podcast-link")
}
