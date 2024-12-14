import { Page } from "@playwright/test"
import { getDrawerComponent } from "./homepageConstants"

export function getSearchStationButton(page: Page) {
  return page.getByRole("button", { name: "search stations" })
}

export function getForm(page: Page) {
  return getDrawerComponent(page).locator(
    ".drawer-content .station-search-form"
  )
}

export function getDrawerStationResultCard(page: Page) {
  return page.locator(".station-search-result-card")
}

export function getStationSearchByNameInput(page: Page) {
  return getForm(page).getByLabel("Search By Name")
}
