import { Locator, Page } from "@playwright/test"

class RadioCard {
  readonly page: Page
  readonly parentComponent: Locator
  readonly radioCard: Locator

  constructor(page: Page, parentComponent: Locator) {
    this.page = page
    this.parentComponent = parentComponent
    this.radioCard = this.parentComponent.locator(".radio-card")
  }

  getRadioCard() {
    return this.radioCard
  }

  getFavouriteIcon() {
    return this.radioCard.locator(".station-card-favourite-icon")
  }

  getShareIcon() {
    return this.radioCard.locator(".station-card-share-icon")
  }

  async clickFavouriteIcon() {
    await this.radioCard.locator(".station-card-favourite-icon").click()
  }

  async clickCloseButton() {
    await this.page.locator(".leaflet-popup-close-button").click()
  }
}

export default RadioCard
