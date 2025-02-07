import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../constants/homepageConstants"
import { defaultTenPodcastEpisodes } from "../mocks/podcast.episode"
import { Podcast } from "../../src/api/podcast/model/podcast"

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  async function assertPodcastInfo(page: Page, expectedPodcast: Podcast) {
    await expect(
      page.locator(".podcast-info-container").getByText(expectedPodcast.title, {
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page
        .locator(".podcast-info-container")
        .getByText(expectedPodcast.author, {
          exact: true,
        })
    ).toBeVisible()
  }

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

    await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)

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
