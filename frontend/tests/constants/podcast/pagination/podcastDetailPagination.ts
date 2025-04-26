import { Page } from "@playwright/test"

export function getPageNumberElement(page: Page, expectedPageNumber: string) {
  return page
    .locator(".podcast-episode-pagination")
    .getByText(expectedPageNumber)
}

export function getActivePageNumberElement(
  page: Page,
  activePageNumber: string
) {
  return page
    .locator(".podcast-episode-pagination .active")
    .getByText(activePageNumber)
}

export function getNextPaginationButton(page: Page) {
  return page
    .locator(".podcast-episode-pagination")
    .getByTestId("pagination-next-button")
}

export function getPreviousPaginationButton(page: Page) {
  return page
    .locator(".podcast-episode-pagination")
    .getByTestId("pagination-previous-button")
}
