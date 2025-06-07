import { Locator, Page } from "@playwright/test"

class PodcastSearchBarResult {
  readonly page: Page
  readonly container: Locator
  readonly title: Locator
  readonly author: Locator

  constructor(page: Page) {
    this.page = page
    this.container = this.page.locator(".search-result-list-container")
    this.title = this.container.locator(".podcast-search-result-title")
    this.author = this.container.locator(".podcast-search-result-author")
  }

  getContainer() {
    return this.container
  }

  getTitle() {
    return this.title
  }

  getAuthor() {
    return this.author
  }
}

export default PodcastSearchBarResult
