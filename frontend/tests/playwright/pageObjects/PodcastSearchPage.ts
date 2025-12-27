import { Locator, Page } from "@playwright/test"
import { podcastSearchPageUrl } from "../constants/paths"
import PodcastSearchBar from "../pageComponents/podcast/PodcastSearchBar"

class PodcastSearchPage {
  readonly page: Page
  readonly podcastSearchBar: PodcastSearchBar
  readonly podcastSearchCards: Locator

  constructor(page: Page) {
    this.page = page
    this.podcastSearchBar = new PodcastSearchBar(this.page)
    this.podcastSearchCards = this.page.locator(".podcast-card")
  }

  getPage() {
    return this.page
  }

  getErrorMessage(message: string) {
    return this.page.getByText(message)
  }

  goto(query: string) {
    return this.page.goto(podcastSearchPageUrl(query))
  }

  getSearchBar() {
    return this.podcastSearchBar.getSearchBar()
  }

  getSearchResultHeader(query: string) {
    return this.page.getByText(`Showing results for ${query}`, { exact: true })
  }

  getPodcastSearchCards() {
    return this.podcastSearchCards
  }

  getPodcastCardArtwork(artworkName: string) {
    return this.getPodcastSearchCards().getByRole("img", {
      name: artworkName,
      exact: true,
    })
  }

  getPodcastCardTitle(title: string) {
    return this.getPodcastSearchCards()
      .locator(".podcast-card-title")
      .getByText(title, { exact: true })
  }

  getPodcastCardAuthor(author: string) {
    return this.getPodcastSearchCards()
      .locator(".podcast-card-author")
      .getByText(author, { exact: true })
  }
}

export default PodcastSearchPage
