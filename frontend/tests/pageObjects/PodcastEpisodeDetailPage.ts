import { Locator, Page } from "@playwright/test"

class PodcastEpisodeDetailPage {
  readonly page: Page
  readonly podcastEpisodeDetailContainer: Locator

  constructor(page: Page) {
    this.page = page
    this.podcastEpisodeDetailContainer = this.page.locator(
      ".podcast-episode-detail-container"
    )
  }

  getPage() {
    return this.page
  }

  getErrorMessage(errorMessage: string) {
    return this.podcastEpisodeDetailContainer.getByText(errorMessage)
  }

  getPodcastEpisodeDetailContainer() {
    return this.podcastEpisodeDetailContainer
  }
}

export default PodcastEpisodeDetailPage
