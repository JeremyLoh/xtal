import { Locator, Page } from "@playwright/test"
import { podcastDetailPageUrl } from "../constants/paths"

class PodcastDetailPage {
  readonly page: Page
  readonly breadcrumbPodcastDetailPageLink: Locator
  readonly podcastInfoContainer: Locator
  readonly nextEpisodeListPaginationButton: Locator
  readonly episodePaginationActivePageNumber: Locator
  readonly episodeDurationFilter: Locator
  readonly podcastEpisodeCards: Locator

  constructor(page: Page) {
    this.page = page
    this.breadcrumbPodcastDetailPageLink = this.page.getByTestId(
      "podcast-detail-page-category-link"
    )
    this.podcastInfoContainer = this.page.locator(".podcast-info-container")
    this.nextEpisodeListPaginationButton = this.page
      .locator(".podcast-episode-pagination")
      .getByTestId("pagination-next-button")
    this.episodePaginationActivePageNumber = this.page
      .locator(".podcast-episode-pagination")
      .locator(".active")
    this.episodeDurationFilter = this.page.locator(
      ".podcast-episode-list-filters select.podcast-episode-duration-filter"
    )
    this.podcastEpisodeCards = this.page.locator(".podcast-episode-card")
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

  getPodcastInfoContainer() {
    return this.podcastInfoContainer
  }

  getPodcastInfoCategoryPill(category: string) {
    return this.podcastInfoContainer.getByText(category, { exact: true })
  }

  getPodcastEpisodeCardTitle(title: string) {
    return this.podcastEpisodeCards.getByText(title, { exact: true })
  }
}

export default PodcastDetailPage
