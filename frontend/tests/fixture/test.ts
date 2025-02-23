import { test as base } from "@playwright/test"
import type { Page } from "@playwright/test"
import { mockMapTiles } from "../mocks/map/radio.map.tiles"

// https://playwright.dev/docs/test-fixtures
class MapPage {
  constructor(public readonly page: Page) {}

  async mockMapTile() {
    await mockMapTiles(this.page)
  }
}

type Fixtures = {
  mapPage: MapPage
}

export const test = base.extend<Fixtures>({
  mapPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(new MapPage(page))
  },
})
