import { expect, Locator, Page } from "@playwright/test"
import { homePageUrl } from "../constants/paths"
import Sidebar, { SidebarMenuItemAction } from "../pageComponents/Sidebar"
import Map from "../pageComponents/Map"
import RadioCard from "../pageComponents/RadioCard"

class HomePage {
  readonly page: Page
  readonly appThemeToggleButton: Locator
  readonly sidebar: Sidebar
  readonly map: Map
  readonly radioCard: RadioCard

  constructor(page: Page) {
    this.page = page
    this.appThemeToggleButton = this.page.getByTestId("theme-toggle-button")
    this.sidebar = new Sidebar(this.page)
    this.map = new Map(this.page)
    this.radioCard = new RadioCard(this.page)
  }

  async goto() {
    await this.page.goto(homePageUrl())
  }

  getPage(): Page {
    return this.page
  }

  getAppThemeToggleButton(themeMode: "light" | "dark") {
    return this.appThemeToggleButton.locator(
      themeMode === "light" ? ".light-mode-icon" : ".dark-mode-icon"
    )
  }

  getRadioCard() {
    return this.radioCard.getRadioCard()
  }

  getRadioCardFavouriteIcon() {
    return this.radioCard.getFavouriteIcon()
  }

  getDrawer() {
    return this.page.locator(".drawer")
  }

  getDrawerTitle() {
    return this.page.locator(".drawer .drawer-title")
  }

  async toggleAppTheme() {
    await this.appThemeToggleButton.click()
  }

  async openFavouriteStationsDrawer() {
    await this.sidebar.open()
    await this.sidebar
      .getMenuItem(SidebarMenuItemAction.RadioFavouriteStations)
      .click()
  }

  async closeDrawer() {
    await this.page.locator(".drawer-close-button").click()
  }

  async clickRandomRadioStationButton() {
    await expect(
      this.page.getByTestId("random-radio-station-button")
    ).toBeEnabled()
    await this.page.getByTestId("random-radio-station-button").click()
  }

  async clickRadioCardFavouriteIcon() {
    await this.radioCard.clickFavouriteIcon()
  }

  async clickRadioCardCloseButton() {
    await this.radioCard.clickCloseButton()
  }
}

export default HomePage
