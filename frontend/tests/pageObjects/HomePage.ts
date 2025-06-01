import { expect, Locator, Page } from "@playwright/test"
import { homePageUrl } from "../constants/paths"
import Sidebar, { SidebarMenuItemAction } from "../pageComponents/Sidebar"
import Map from "../pageComponents/Map"

class HomePage {
  readonly page: Page
  readonly appThemeToggleButton: Locator
  readonly genreSearchButton: Locator
  readonly countrySearchButton: Locator
  readonly genreSliderContainer: Locator
  readonly sidebar: Sidebar
  readonly map: Map

  constructor(page: Page) {
    this.page = page
    this.appThemeToggleButton = this.page.getByTestId("theme-toggle-button")
    this.genreSearchButton = this.page.locator(
      "#station-search-type-container .genre-search-button"
    )
    this.countrySearchButton = this.page.locator(
      "#station-search-type-container .country-search-button"
    )
    this.genreSliderContainer = this.page.locator(".genre-slider-container")
    this.sidebar = new Sidebar(this.page)
    this.map = new Map(this.page)
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

  getGenreSearchButton() {
    return this.genreSearchButton
  }

  getGenreSliderContainer() {
    return this.genreSliderContainer
  }

  getGenreSlideLeftIcon() {
    return this.genreSliderContainer.locator(".slide-left-icon")
  }

  getGenreSlideRightIcon() {
    return this.genreSliderContainer.locator(".slide-right-icon")
  }

  getCountrySearchButton() {
    return this.countrySearchButton
  }

  getCountrySearchSliderOptions() {
    return this.page.locator(".slider .country-slider-option")
  }

  getRadioCard() {
    return this.map.getRadioCard()
  }

  getRadioCardFavouriteIcon() {
    return this.map.getRadioCardFavouriteIcon()
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
    await this.map.clickRadioCardFavouriteIcon()
  }

  async clickRadioCardCloseButton() {
    await this.map.clickRadioCardCloseButton()
  }
}

export default HomePage
