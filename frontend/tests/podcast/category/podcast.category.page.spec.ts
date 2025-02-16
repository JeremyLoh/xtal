import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { tenArtTrendingPodcasts } from "../../mocks/podcast.trending"

test.describe("Podcast Category Page /podcasts/<category_name>", () => {
  test("should display trending podcasts in category", async ({ page }) => {
    const category = "Arts"
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    expect(page.locator(".podcast-trending-container")).toBeVisible()
    for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
      const expectedPodcast = tenArtTrendingPodcasts.data[i]
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-artwork")
          .nth(i),
        `(Podcast ${i + 1}) should have artwork present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-title")
          .nth(i)
          .getByText(expectedPodcast.title, { exact: true }),
        `(Podcast ${i + 1}) should have title present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-author")
          .nth(i)
          .getByText(expectedPodcast.author, { exact: true }),
        `(Podcast ${i + 1}) should have author present`
      ).toBeVisible()
    }
  })
})
