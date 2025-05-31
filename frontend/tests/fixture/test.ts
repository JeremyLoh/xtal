/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test"
import type { Page } from "@playwright/test"
import { mockMapTiles } from "../mocks/map/radio.map.tiles"
import HomePage from "../pageObjects/HomePage"

// https://playwright.dev/docs/test-fixtures
class MapPage {
  constructor(public readonly page: Page) {}

  async mockMapTile() {
    await mockMapTiles(this.page)
  }
}

type Fixtures = {
  mapPage: MapPage
  homePage: HomePage
}

const test = base.extend<Fixtures>({
  mapPage: async ({ page }, use) => {
    await use(new MapPage(page))
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
})

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

export { test }
