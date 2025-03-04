import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants.ts"
import {
  podcastId_259760_episodeId_34000697601,
  podcastId_259760_FirstTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import { assertPodcastEpisodeOnPodcastEpisodeDetailPage } from "../../constants/podcast/detail/podcastDetailConstants.ts"

test.describe("Podcast Episode Detail Page for viewing single podcast episode /podcasts/PODCAST-TITLE/PODCAST-ID/PODCAST-EPISODE-ID", () => {
  test("should display podcast episode detail page", async ({ page }) => {
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await assertPodcastEpisodeOnPodcastEpisodeDetailPage(
      page,
      podcastId_259760_episodeId_34000697601
    )
  })

  test("should display error message if no podcast data is found", async ({
    page,
  }) => {
    const expectedErrorMessage = "Podcast episode data is not available"
    const podcastTitle = encodeURIComponent("No Podcast Data")
    const podcastId = "2"
    const podcastEpisodeId = "3"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = { count: 0, data: null }
        await route.fulfill({ json })
      }
    )
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(
      page
        .locator(".error-text")
        .getByText(expectedErrorMessage, { exact: true })
    ).toBeVisible()
    await expect(
      page.locator(".podcast-episode-detail-back-button")
    ).toBeVisible()
  })

  test("should display error message when request is aborted", async ({
    page,
  }) => {
    const expectedErrorMessage =
      "Could not retrieve podcast episode by episode id. Please try again later"
    const podcastTitle = encodeURIComponent("Aborted Request")
    const podcastId = "2"
    const podcastEpisodeId = "3"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        await route.abort("aborted")
      }
    )
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(
      page
        .locator(".error-text")
        .getByText(expectedErrorMessage, { exact: true })
    ).toBeVisible()
    await expect(
      page.locator(".podcast-episode-detail-back-button")
    ).toBeVisible()
  })

  test("should navigate back to the podcast detail page when back button is clicked", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    const limit = "10"
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        // mock podcast detail page data for back button navigation
        const json = podcastId_259760_FirstTenEpisodes
        await route.fulfill({ json })
      }
    )

    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(
      page.locator(".podcast-episode-detail-back-button")
    ).toBeVisible()
    expect(page.url()).toMatch(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await page.locator(".podcast-episode-detail-back-button").click()

    const expectedUrl = HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`
    expect(page.url()).toMatch(expectedUrl)
  })
})
