import { Locator, Page } from "@playwright/test"

class PodcastNewRelease {
  readonly page: Page
  readonly container: Locator
  readonly header: Locator
  readonly subtitle: Locator
  readonly languageFilter: Locator
  readonly refreshNewReleaseButton: Locator
  readonly getNewReleasePodcastCard: (podcastId: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.container = this.page.locator(".new-release-podcast-container")
    this.header = this.container.getByText("New Releases")
    this.subtitle = this.container.getByText(
      "Latest podcasts with new episodes"
    )
    this.languageFilter = this.container.getByTestId(
      "new-release-podcast-language-filter"
    )
    this.refreshNewReleaseButton = this.container.getByRole("button", {
      name: "refresh new release podcasts",
      exact: true,
    })
    this.getNewReleasePodcastCard = (podcastId: string) => {
      if (podcastId === "") {
        return this.container.locator(".new-release-podcast-card")
      }
      return this.container.getByTestId(`new-release-podcast-card-${podcastId}`)
    }
  }

  getContainer() {
    return this.container
  }

  getHeader() {
    return this.header
  }

  getSubtitle() {
    return this.subtitle
  }

  getLanguageFilter() {
    return this.languageFilter
  }

  getRefreshNewReleaseButton() {
    return this.refreshNewReleaseButton
  }

  getPodcastCard(podcastId: string) {
    return this.getNewReleasePodcastCard(podcastId)
  }
}

export default PodcastNewRelease
