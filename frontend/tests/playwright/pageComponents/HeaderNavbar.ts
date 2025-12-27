import { Locator, Page } from "@playwright/test"

type ThemeModeType = "light" | "dark"

class HeaderNavbar {
  readonly page: Page
  readonly radioLink: Locator
  readonly podcastLink: Locator
  readonly getAppThemeToggleButton: (themeMode: ThemeModeType) => Locator

  constructor(page: Page) {
    this.page = page
    this.radioLink = this.page
      .locator("header")
      .locator(".header-navbar-radio-link")
    this.podcastLink = this.page
      .locator("header")
      .locator(".header-navbar-podcast-link")
    this.getAppThemeToggleButton = (themeMode: ThemeModeType) => {
      return this.page
        .getByTestId("theme-toggle-button")
        .locator(themeMode === "light" ? ".light-mode-icon" : ".dark-mode-icon")
    }
  }

  getHeaderRadioLink() {
    return this.radioLink
  }

  getHeaderPodcastLink() {
    return this.podcastLink
  }

  getThemeToggleButton(themeMode: ThemeModeType) {
    return this.getAppThemeToggleButton(themeMode)
  }
}

export default HeaderNavbar
