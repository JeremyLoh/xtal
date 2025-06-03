import { Locator, Page } from "@playwright/test"
import { podcastHomePageUrl } from "../constants/paths"
import Sidebar, { SidebarMenuItemAction } from "../pageComponents/Sidebar"

class PodcastHomePage {
  readonly page: Page
  readonly sidebar: Sidebar
  readonly podcastCategoryContainer: Locator
  readonly podcastCategoryTitle: Locator
  readonly podcastCategorySlider: Locator
  readonly podcastCategoryRefreshButton: Locator

  constructor(page: Page) {
    this.page = page
    this.sidebar = new Sidebar(this.page)
    this.podcastCategoryContainer = this.page.locator(
      ".podcast-category-container"
    )
    this.podcastCategoryTitle = this.podcastCategoryContainer.locator(
      ".podcast-category-title"
    )
    this.podcastCategorySlider = this.page.locator(".podcast-category-slider")
    this.podcastCategoryRefreshButton = this.podcastCategoryContainer.getByRole(
      "button",
      {
        name: "refresh podcast categories",
        exact: true,
      }
    )
  }

  async goto() {
    await this.page.goto(podcastHomePageUrl())
  }

  getPage() {
    return this.page
  }

  getErrorMessage(message: string) {
    return this.podcastCategoryContainer.getByText(message, { exact: true })
  }

  getSidebarToggleButton() {
    return this.sidebar.getToggleButton()
  }

  getSidebar() {
    return this.sidebar.getSidebar()
  }

  getSidebarMenuItem(action: SidebarMenuItemAction) {
    return this.sidebar.getMenuItem(action)
  }

  getPodcastCategoryContainer() {
    return this.podcastCategoryContainer
  }

  getPodcastCategoryTitle() {
    return this.podcastCategoryTitle
  }

  getPodcastCategorySliderItem(categoryName: string) {
    return this.podcastCategorySlider.getByText(categoryName, { exact: true })
  }

  getPodcastCategoryRefreshButton() {
    return this.podcastCategoryRefreshButton
  }
}

export default PodcastHomePage
