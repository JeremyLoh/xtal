import { Locator, Page } from "@playwright/test"

class PodcastDetailPage {
  readonly page: Page
  readonly nextEpisodeListPaginationButton: Locator
  readonly breadcrumbPodcastDetailPageLink: Locator

  constructor(page: Page) {
    this.page = page
    this.nextEpisodeListPaginationButton = this.page
      .locator(".podcast-episode-pagination")
      .getByTestId("pagination-next-button")
    this.breadcrumbPodcastDetailPageLink = this.page.getByTestId(
      "podcast-detail-page-category-link"
    )
  }

  getPage() {
    return this.page
  }

  getNextEpisodeListPaginationButton() {
    return this.nextEpisodeListPaginationButton
  }

  getBreadcrumbPodcastDetailPageLink() {
    return this.breadcrumbPodcastDetailPageLink
  }
}

export default PodcastDetailPage
