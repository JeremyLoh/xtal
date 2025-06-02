import { Locator, Page } from "@playwright/test"
import { podcastDetailPageUrl } from "../constants/paths"

class PodcastDetailPage {
  readonly page: Page
  readonly nextEpisodeListPaginationButton: Locator
  readonly episodePaginationActivePageNumber: Locator
  readonly breadcrumbPodcastDetailPageLink: Locator
  readonly episodeDurationFilter: Locator

  constructor(page: Page) {
    this.page = page
    this.nextEpisodeListPaginationButton = this.page
      .locator(".podcast-episode-pagination")
      .getByTestId("pagination-next-button")
    this.episodePaginationActivePageNumber = this.page
      .locator(".podcast-episode-pagination")
      .locator(".active")
    this.breadcrumbPodcastDetailPageLink = this.page.getByTestId(
      "podcast-detail-page-category-link"
    )
    this.episodeDurationFilter = this.page.locator(
      ".podcast-episode-list-filters select.podcast-episode-duration-filter"
    )
  }

  getPage() {
    return this.page
  }

  async goto({
    podcastId,
    podcastTitle,
  }: {
    podcastId: string
    podcastTitle: string
  }) {
    await this.page.goto(podcastDetailPageUrl({ podcastId, podcastTitle }))
  }

  getBreadcrumbPodcastDetailPageLink() {
    return this.breadcrumbPodcastDetailPageLink
  }

  getEpisodeDurationFilter() {
    return this.episodeDurationFilter
  }

  getNextEpisodeListPaginationButton() {
    return this.nextEpisodeListPaginationButton
  }

  getEpisodePaginationActivePageNumber(activePageNumber: string) {
    return this.episodePaginationActivePageNumber.getByText(activePageNumber)
  }
}

export default PodcastDetailPage
