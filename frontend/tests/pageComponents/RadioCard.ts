import { Locator, Page } from "@playwright/test"

class RadioCard {
  readonly page: Page
  readonly radioCard: Locator

  constructor(page: Page) {
    this.page = page
    this.radioCard = this.page.locator(".radio-card")
  }

  async clickFavouriteIcon() {
    await this.radioCard.locator(".station-card-favourite-icon").click()
  }
}

export default RadioCard
