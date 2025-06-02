/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test"
import type { Page } from "@playwright/test"
import { mockMapTiles } from "../mocks/map/radio.map.tiles"
import HomePage from "../pageObjects/HomePage"
import PodcastHomePage from "../pageObjects/PodcastHomePage"
import PodcastCategoryPage from "../pageObjects/PodcastCategoryPage"
import PodcastDetailPage from "../pageObjects/PodcastDetailPage"

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
  podcastHomePage: PodcastHomePage
  podcastCategoryPage: PodcastCategoryPage
  podcastDetailPage: PodcastDetailPage
}

const test = base.extend<Fixtures>({
  mapPage: async ({ page }, use) => {
    await use(new MapPage(page))
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  podcastHomePage: async ({ page }, use) => {
    await use(new PodcastHomePage(page))
  },
  podcastCategoryPage: async ({ page }, use) => {
    await use(new PodcastCategoryPage(page))
  },
  podcastDetailPage: async ({ page }, use) => {
    await use(new PodcastDetailPage(page))
  },
})

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

export { test }
