import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../constants/homepageConstants"
import { defaultTenPodcastEpisodes } from "../mocks/podcast.episode"

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test("should display podcast detail page", async ({ page }) => {
    // TODO url encode the podcast title during navigation
    const podcastTitle = encodeURIComponent("Batman University")
    const podcastId = "75075"
    const limit = 10

    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        const json = defaultTenPodcastEpisodes
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    // TODO assert that the podcast feed <PodcastCard> is present
    // await expect(
    //   page
    //     .locator(".podcast-card")
    //     .getByText("Batman University", { exact: true })
    // ).toBeVisible()
    for (let i = 0; i < defaultTenPodcastEpisodes.count; i++) {
      const episode = defaultTenPodcastEpisodes.data.episodes[i]
      await expect(
        page
          .locator(".podcast-episode-card .podcast-episode-card-artwork")
          .nth(i)
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-card .podcast-episode-card-title")
          .getByText(episode.title, { exact: true })
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-card .podcast-episode-card-description")
          .nth(i)
      ).toBeVisible()
    }
  })
})
