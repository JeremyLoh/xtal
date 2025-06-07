import { Locator, Page } from "@playwright/test"

class Drawer {
  readonly page: Page
  readonly drawer: Locator

  constructor(page: Page) {
    this.page = page
    this.drawer = this.page.locator(".drawer")
  }

  getDrawer() {
    return this.drawer
  }

  getBackgroundContainer() {
    return this.page.locator(".drawer-background-container")
  }

  getTitle() {
    return this.drawer.locator(".drawer-title")
  }

  getDragButton() {
    return this.drawer.locator(".drawer-drag-button")
  }

  getCloseButton() {
    return this.drawer.locator(".drawer-close-button")
  }
}

export default Drawer
