import { Locator, Page } from "@playwright/test"

class Map {
  readonly page: Page
  readonly map: Locator

  constructor(page: Page) {
    this.page = page
    this.map = this.page.locator("#map")
  }

  getRadioCardFavouriteIcon() {
    return this.map.locator(".radio-card .station-card-favourite-icon")
  }
}

export default Map
