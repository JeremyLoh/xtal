import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../constants/homepageConstants"
import { defaultTenPodcastEpisodes } from "../mocks/podcast.episode"
import { Podcast } from "../../src/api/podcast/model/podcast"

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  function getPodcastInfoElement(page: Page, text: string) {
    return page.locator(".podcast-info-container").getByText(text, {
      exact: true,
    })
  }

  async function assertPodcastInfo(page: Page, expectedPodcast: Podcast) {
    await expect(
      page.locator(".podcast-info-container").getByRole("img", {
        name: expectedPodcast.title + " podcast image",
        exact: true,
      }),
      "Podcast Info Artwork should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(page, expectedPodcast.title),
      "Podcast Info Title should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(page, expectedPodcast.author),
      "Podcast Info Author should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(page, expectedPodcast.language),
      "Podcast Info Language should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(
        page,
        expectedPodcast.episodeCount
          ? `${expectedPodcast.episodeCount} episodes`
          : "0 episodes"
      ),
      "Podcast Info Episode Count should be present"
    ).toBeVisible()
    for (const category of expectedPodcast.categories) {
      await expect(
        getPodcastInfoElement(page, category),
        `Podcast Info Category '${category}' should be present`
      ).toBeVisible()
    }
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
          .locator(".podcast-episode-card .podcast-episode-card-title")
          .getByText(episode.title, { exact: true }),
        `(Episode ${i + 1}) podcast episode card Title should be present`
      ).toBeVisible()

      // ensure description has no duplicates - remove all empty lines "" and newlines ("\n")
      const descriptions = (
        await page
          .locator(".podcast-episode-card .podcast-episode-card-description")
          .nth(i)
          .allInnerTexts()
      )
        .join("")
        .split("\n")
        .filter((line) => line.trim() !== "")

      expect(
        new Set(descriptions).size,
        `(Episode ${
          i + 1
        }) podcast episode card Description should not be duplicated due to React Strict Mode`
      ).toBe(descriptions.length)
    }
  })
})
