import { Locator, Page } from "@playwright/test"

export enum SidebarMenuItemAction {
  // contains the data-testid values for the sidebar menu item
  Radio = "sidebar-menu-item-radio",
  Podcasts = "sidebar-menu-item-podcasts",
  PodcastSearch = "sidebar-menu-item-podcast-search",
  RadioFavouriteStations = "sidebar-menu-item-radio-view-favourite-stations",
  Profile = "sidebar-menu-item-profile",
  ProfileFollowing = "sidebar-menu-item-profile-following",
  ProfileListenHistory = "sidebar-menu-item-profile-listen-history",
  ProfileSignIn = "sidebar-menu-item-profile-sign-in",
  ProfileSignUp = "sidebar-menu-item-profile-sign-up",
  ProfileLogout = "sidebar-menu-item-profile-logout",
  ProfileResetPassword = "sidebar-menu-item-profile-reset-password",
  About = "sidebar-menu-item-about",
}

class Sidebar {
  readonly page: Page
  readonly sidebar: Locator
  readonly sidebarToggleButton: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.sidebar = this.page.getByTestId("sidebar")
    this.sidebarToggleButton = this.page.getByTestId("sidebar-toggle-button")
    this.closeButton = this.page.getByTestId("sidebar-close-button")
  }

  async open() {
    await this.sidebarToggleButton.click()
  }

  getSidebar() {
    return this.sidebar
  }

  getToggleButton() {
    return this.sidebarToggleButton
  }

  getCloseButton() {
    return this.closeButton
  }

  getTitle() {
    return this.page.getByTestId("sidebar-title")
  }

  getMenuItem(action: SidebarMenuItemAction) {
    return this.page.locator(".sidebar-menu-item").getByTestId(action)
  }
}

export default Sidebar
