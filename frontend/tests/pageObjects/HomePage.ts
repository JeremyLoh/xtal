import { Locator, Page } from "@playwright/test"
import { homePageUrl } from "../constants/paths"
import Sidebar, { SidebarMenuItemAction } from "../pageComponents/Sidebar"

class HomePage {
  readonly page: Page
  readonly appThemeToggleButton: Locator
  readonly sidebar: Sidebar

  constructor(page: Page) {
    this.page = page
    this.appThemeToggleButton = this.page.getByTestId("theme-toggle-button")
    this.sidebar = new Sidebar(this.page)
  }

  getPage(): Page {
    return this.page
  }

  async goto() {
    await this.page.goto(homePageUrl())
  }

  async toggleAppTheme() {
    await this.appThemeToggleButton.click()
  }

  getAppThemeToggleButton(themeMode: "light" | "dark") {
    return this.appThemeToggleButton.locator(
      themeMode === "light" ? ".light-mode-icon" : ".dark-mode-icon"
    )
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
}

export default HomePage
