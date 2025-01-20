import { expect, Page } from "@playwright/test"

export const HOMEPAGE = "http://localhost:5173"

export async function clickRandomRadioStationButton(page: Page) {
  await expect(page.getByTestId("random-radio-station-btn")).toBeEnabled()
  await page.getByTestId("random-radio-station-btn").click()
}

export function getGenreSearchButton(page: Page) {
  return page.locator("#station-search-type-container .genre-search-button")
}

export function getCountrySearchButton(page: Page) {
  return page.locator("#station-search-type-container .country-search-button")
}

export function getRadioStationMapPopupCloseButton(page: Page) {
  return page.locator(".leaflet-popup-close-button")
}

export async function getToastMessages(page: Page) {
  const toasts = await page.locator(".toaster").all()
  const toastMessages = (
    await Promise.all(toasts.map((locator) => locator.allTextContents()))
  ).flat(1)
  return toastMessages
}
