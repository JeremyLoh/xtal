import { Locator, Page } from "@playwright/test"
import RadioPlayer from "./RadioPlayer"

class RadioCard {
  readonly page: Page
  readonly parentComponent: Locator
  readonly radioCard: Locator
  readonly radioPlayer: RadioPlayer

  constructor(page: Page, parentComponent: Locator) {
    this.page = page
    this.parentComponent = parentComponent
    this.radioCard = this.parentComponent.locator(".radio-card")
    this.radioPlayer = new RadioPlayer(this.page)
  }

  getRadioCard() {
    return this.radioCard
  }

  getPlayer() {
    return this.radioPlayer.getPlayer()
  }

  async getPlayerAudioMetadata() {
    return await this.radioPlayer.getAudioMetadata()
  }

  getTags() {
    return this.radioCard.locator(".station-card-tag-container")
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
