import { Locator, Page } from "@playwright/test"

class TrendingPodcastSection {
  readonly page: Page
  readonly container: Locator
  readonly sinceSelectFilter: Locator

  readonly paginationContainer: Locator
  readonly nextPaginationButton: Locator
  readonly previousPaginationButton: Locator
  readonly activePageNumber: Locator

  constructor(page: Page) {
    this.page = page
    this.container = this.page.locator(".podcast-trending-container")
    this.sinceSelectFilter = this.container.locator(
      ".podcast-trending-since-select"
    )
    this.paginationContainer = this.page.locator(".trending-podcast-pagination")
    this.nextPaginationButton = this.paginationContainer.getByTestId(
      "pagination-next-button"
    )
    this.previousPaginationButton = this.paginationContainer.getByTestId(
      "pagination-previous-button"
    )
    this.activePageNumber = this.page.locator(
      ".trending-podcast-pagination .active"
    )
  }

  getContainer() {
    return this.container
  }

  getSinceSelectFilter() {
    return this.sinceSelectFilter
  }

  getNextPaginationButton() {
    return this.nextPaginationButton
  }

  getPreviousPaginationButton() {
    return this.previousPaginationButton
  }

  getActivePageNumber() {
    return this.activePageNumber
  }

  getPageNumber(pageNumber: string) {
    return this.paginationContainer.getByText(pageNumber)
  }

  getPodcastCards() {
    return this.container.locator(".podcast-trending-card")
  }

  getPodcastCardDetailLink(index: number) {
    return this.getPodcastCards()
      .nth(index)
      .locator(".podcast-trending-card-detail-link")
  }
}

export default TrendingPodcastSection
