import { Locator, Page } from "@playwright/test"
import { podcastCategoryPageUrl } from "../constants/paths"

class PodcastCategoryPage {
  readonly page: Page
  readonly trendingPodcastContainer: Locator
  readonly trendingPodcastCardContainer: Locator
  readonly trendingPodcastNextPaginationButton: Locator
  readonly trendingPodcastPreviousPaginationButton: Locator
  readonly breadcrumbPodcastCategoryPageLink: Locator

  constructor(page: Page) {
    this.page = page
    this.trendingPodcastContainer = this.page.locator(
      ".podcast-trending-container"
    )
    this.trendingPodcastCardContainer = this.page.locator(
      ".podcast-trending-card-container"
    )
    this.trendingPodcastNextPaginationButton = this.page
      .locator(".trending-podcast-pagination")
      .getByTestId("pagination-next-button")
    this.trendingPodcastPreviousPaginationButton = this.page
      .locator(".trending-podcast-pagination")
      .getByTestId("pagination-previous-button")
    this.breadcrumbPodcastCategoryPageLink = this.page.getByTestId(
      "podcast-category-page-podcasts-link"
    )
  }

  getPage() {
    return this.page
  }

  async goto(categoryName: string) {
    await this.page.goto(podcastCategoryPageUrl(categoryName))
  }

  getBreadcrumbPodcastCategoryPageLink() {
    return this.breadcrumbPodcastCategoryPageLink
  }

  getTrendingPodcastContainer() {
    return this.trendingPodcastContainer
  }

  getTrendingPodcastArtwork() {
    return this.trendingPodcastCardContainer.locator(".podcast-card-artwork")
  }

  getTrendingPodcastTitle() {
    return this.trendingPodcastCardContainer.locator(".podcast-card-title")
  }

  getTrendingPodcastAuthor() {
    return this.trendingPodcastCardContainer.locator(".podcast-card-author")
  }

  getTrendingPodcastNextPaginationButton() {
    return this.trendingPodcastNextPaginationButton
  }

  getTrendingPodcastPreviousPaginationButton() {
    return this.trendingPodcastPreviousPaginationButton
  }

  getTrendingPodcastPaginationActivePageNumber(activePage: string) {
    return this.page
      .locator(".trending-podcast-pagination .active")
      .getByText(activePage)
  }

  getTrendingPodcastPaginationPageNumber(page: string) {
    return this.page.locator(".trending-podcast-pagination").getByText(page)
  }

  getTrendingPodcastSinceSelectFilter() {
    return this.trendingPodcastContainer.locator(
      ".podcast-trending-since-select"
    )
  }
}

export default PodcastCategoryPage
