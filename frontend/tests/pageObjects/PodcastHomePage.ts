import { Page } from "@playwright/test"
import { podcastHomePageUrl } from "../constants/paths"
import Sidebar, { SidebarMenuItemAction } from "../pageComponents/Sidebar"

class PodcastHomePage {
  readonly page: Page
  readonly sidebar: Sidebar

  constructor(page: Page) {
    this.page = page
    this.sidebar = new Sidebar(this.page)
  }

  async goto() {
    await this.page.goto(podcastHomePageUrl())
  }

  getPage() {
    return this.page
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
}

export default PodcastHomePage
