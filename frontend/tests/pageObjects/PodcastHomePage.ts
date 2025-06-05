import { Locator, Page } from "@playwright/test"
import { podcastHomePageUrl } from "../constants/paths"
import Sidebar, { SidebarMenuItemAction } from "../pageComponents/Sidebar"
import PodcastNewRelease from "../pageComponents/PodcastNewRelease"
import HeaderNavbar from "../pageComponents/HeaderNavbar"
import Drawer from "../pageComponents/Drawer"

class PodcastHomePage {
  readonly page: Page
  readonly sidebar: Sidebar
  readonly podcastCategoryContainer: Locator
  readonly podcastCategoryTitle: Locator
  readonly podcastCategorySlider: Locator
  readonly podcastCategoryRefreshButton: Locator
  readonly podcastNewRelease: PodcastNewRelease
  readonly headerNavbar: HeaderNavbar
  readonly drawer: Drawer

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
    this.podcastNewRelease = new PodcastNewRelease(this.page)
    this.headerNavbar = new HeaderNavbar(this.page)
    this.drawer = new Drawer(this.page)
  }

  async goto() {
    await this.page.goto(podcastHomePageUrl())
  }

  getPage() {
    return this.page
  }

  getErrorMessage(message: string) {
    return this.page.getByText(message, { exact: true })
  }

  getNavbarRadioLink() {
    return this.headerNavbar.getHeaderRadioLink()
  }

  getNavbarPodcastLink() {
    return this.headerNavbar.getHeaderPodcastLink()
  }

  getDrawer() {
    return this.drawer.getDrawer()
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

  getNewReleaseContainer() {
    return this.podcastNewRelease.getContainer()
  }

  getNewReleaseRefreshButton() {
    return this.podcastNewRelease.getRefreshNewReleaseButton()
  }

  getNewReleaseHeader() {
    return this.podcastNewRelease.getHeader()
  }

  getNewReleaseSubtitle() {
    return this.podcastNewRelease.getSubtitle()
  }

  getNewReleasePodcastCard(podcastId: string) {
    return this.podcastNewRelease.getPodcastCard(podcastId)
  }
}

export default PodcastHomePage
