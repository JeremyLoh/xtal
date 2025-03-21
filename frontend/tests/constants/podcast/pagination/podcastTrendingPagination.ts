import { Page } from "@playwright/test"

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
