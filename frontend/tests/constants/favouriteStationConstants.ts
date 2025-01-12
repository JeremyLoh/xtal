import { Page } from "@playwright/test"

export function getFavouriteStationsButton(page: Page) {
  return page.getByTestId("favourite-station-toggle-btn")
}

export function getFavouriteStationsDrawer(page: Page) {
  return page.locator(".drawer")
}

export async function closeFavouriteStationsDrawer(page: Page) {
  await page.locator(".drawer-close-button").click()
}

export function getRadioCardFavouriteIcon(page: Page) {
  return page.locator("#map .radio-card .station-card-favourite-icon")
}
