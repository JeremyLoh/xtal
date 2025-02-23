import { Page } from "@playwright/test"

// mock tile requests to https://tile.openstreetmap.org/{z}/{x}/{y}.png
// z, x, y are numbers (zoom and x and y tile number)
const TILE_URL = /https:\/\/tile.openstreetmap.org\/\d+\/\d+\/\d+\.png/

export async function mockMapTiles(page: Page) {
  // placeholder image obtained from https://tile.openstreetmap.org/4/7/10.png
  await page.route(TILE_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      path: "./tests/mocks/map/mapTilePlaceholder.png", // path based on working directory ("/frontend")
    })
  })
}
