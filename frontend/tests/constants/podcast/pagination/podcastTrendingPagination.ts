import { Page } from "@playwright/test"

export function getPageNumberElement(page: Page, expectedPageNumber: string) {
  return page
    .locator(".trending-podcast-pagination")
    .getByText(expectedPageNumber)
}

export function getActivePageNumberElement(
  page: Page,
  activePageNumber: string
) {
  return page
    .locator(".trending-podcast-pagination .active")
    .getByText(activePageNumber)
}

export function getNextPaginationButton(page: Page) {
  return page
    .locator(".trending-podcast-pagination")
    .getByRole("button", { name: "Next" })
}

export function getPreviousPaginationButton(page: Page) {
  return page
    .locator(".trending-podcast-pagination")
    .getByRole("button", { name: "Previous" })
}

export function getSinceSelectFilter(page: Page) {
  return page.locator(
    ".podcast-trending-container .podcast-trending-since-select"
  )
}
