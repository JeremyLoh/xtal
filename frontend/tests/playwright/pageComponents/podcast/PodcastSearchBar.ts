import { Locator, Page } from "@playwright/test"

class PodcastSearchBar {
  readonly page: Page
  readonly searchBar: Locator
  readonly searchBarInput: Locator

  constructor(page: Page) {
    this.page = page
    this.searchBar = this.page.locator(".podcast-search-bar")
    this.searchBarInput = this.searchBar.locator(".search-input")
  }

  getSearchBar() {
    return this.searchBar
  }

  getSearchInput() {
    return this.searchBarInput
  }
}

export default PodcastSearchBar
