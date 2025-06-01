import { Locator, Page } from "@playwright/test"

class RadioCard {
  readonly page: Page
  readonly radioCard: Locator

  constructor(page: Page) {
    this.page = page
    this.radioCard = this.page.locator(".radio-card")
  }

  getRadioCard() {
    return this.radioCard
  }

  getFavouriteIcon() {
    return this.radioCard.locator(".station-card-favourite-icon")
  }

  async clickFavouriteIcon() {
    await this.radioCard.locator(".station-card-favourite-icon").click()
  }

  async clickCloseButton() {
    await this.page.locator(".leaflet-popup-close-button").click()
  }
}

export default RadioCard
