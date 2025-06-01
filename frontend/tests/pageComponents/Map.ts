import { Locator, Page } from "@playwright/test"
import RadioCard from "./RadioCard"

class Map {
  readonly page: Page
  readonly map: Locator
  readonly radioCard: RadioCard

  constructor(page: Page) {
    this.page = page
    this.map = this.page.locator("#map")
    this.radioCard = new RadioCard(this.page, this.map)
  }

  getRadioCard() {
    return this.radioCard.getRadioCard()
  }

  getRadioCardFavouriteIcon() {
    return this.radioCard.getFavouriteIcon()
  }

  async clickRadioCardFavouriteIcon() {
    await this.radioCard.clickFavouriteIcon()
  }

  async clickRadioCardCloseButton() {
    await this.radioCard.clickCloseButton()
  }
}

export default Map
