/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test"
import type { Page } from "@playwright/test"
import { mockMapTiles } from "../mocks/map/radio.map.tiles"
import HomePage from "../pageObjects/HomePage"
import PodcastHomePage from "../pageObjects/PodcastHomePage"
import PodcastCategoryPage from "../pageObjects/PodcastCategoryPage"
import PodcastDetailPage from "../pageObjects/PodcastDetailPage"
import PodcastEpisodeDetailPage from "../pageObjects/PodcastEpisodeDetailPage"
import PodcastSearchPage from "../pageObjects/PodcastSearchPage"

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
  podcastEpisodeDetailPage: PodcastEpisodeDetailPage
  podcastSearchPage: PodcastSearchPage
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
  podcastEpisodeDetailPage: async ({ page }, use) => {
    await use(new PodcastEpisodeDetailPage(page))
  },
  podcastSearchPage: async ({ page }, use) => {
    await use(new PodcastSearchPage(page))
  },
})

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

export { test }
