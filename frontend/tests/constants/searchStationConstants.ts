import { Page } from "@playwright/test"

export function getSearchStationButton(page: Page) {
  return page.getByRole("button", { name: "search stations" })
}

export function getSearchStationDrawer(page: Page) {
  return page.locator(".drawer")
}

export function getSearchStationForm(page: Page) {
  return getSearchStationDrawer(page).locator(
    ".drawer-content .station-search-form"
  )
}

export function getDrawerStationResultCard(page: Page) {
  return page.locator(".station-search-result-card")
}

export function getStationSearchByNameInput(page: Page) {
  return getSearchStationForm(page).getByLabel("Search By Name")
}

export async function closeSearchStationDrawer(page: Page) {
  await page.locator(".drawer-close-button").click()
}
