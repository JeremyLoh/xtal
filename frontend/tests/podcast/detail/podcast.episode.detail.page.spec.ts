import { test } from "../../fixture/test.ts"
import { expect } from "@playwright/test"
import {
  podcastId_259760_episodeId_34000697601,
  podcastId_259760_FirstTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import { assertPodcastEpisodeOnPodcastEpisodeDetailPage } from "../../constants/podcast/detail/podcastDetailConstants.ts"
import { homePageUrl } from "../../constants/paths.ts"

test.describe("Podcast Episode Detail Page for viewing single podcast episode /podcasts/PODCAST-TITLE/PODCAST-ID/PODCAST-EPISODE-ID", () => {
  test("should display podcast episode detail page", async ({
    podcastEpisodeDetailPage,
  }) => {
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    await assertPodcastEpisodeOnPodcastEpisodeDetailPage(
      podcastEpisodeDetailPage.getPage(),
      podcastId_259760_episodeId_34000697601
    )
  })

  test("should display error message if no podcast data is found", async ({
    podcastEpisodeDetailPage,
  }) => {
    const expectedErrorMessage =
      "Could not retrieve podcast episode by episode id. Please try again later"
    const podcastTitle = "No Podcast Data"
    const podcastId = "2"
    const podcastEpisodeId = "3"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = { count: 0, data: null }
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    await expect(
      podcastEpisodeDetailPage.getErrorMessage(expectedErrorMessage)
    ).toBeVisible()
    await expect(
      podcastEpisodeDetailPage.getBreadcrumbPodcastHomepageLink()
    ).toBeVisible()
  })

  test("should display error message when request is aborted", async ({
    podcastEpisodeDetailPage,
  }) => {
    test.slow()
    const expectedErrorMessage =
      "Could not retrieve podcast episode by episode id. Please try again later"
    const podcastTitle = "Aborted Request"
    const podcastId = "2"
    const podcastEpisodeId = "3"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          await route.abort()
        }
      )
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    await expect(
      podcastEpisodeDetailPage.getErrorMessage(expectedErrorMessage)
    ).toBeVisible()
    await expect(
      podcastEpisodeDetailPage.getBreadcrumbPodcastHomepageLink()
    ).toBeVisible()
  })

  test("should navigate back to the podcast detail page when podcast detail breadcrumb link is clicked", async ({
    podcastEpisodeDetailPage,
    podcastDetailPage,
  }) => {
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    const limit = "10"
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          // mock podcast detail page data for back button navigation
          const json = podcastId_259760_FirstTenEpisodes
          await route.fulfill({ json })
        }
      )

    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    await expect(
      podcastEpisodeDetailPage.getBreadcrumbPodcastDetailLink()
    ).toBeVisible()
    await expect(podcastEpisodeDetailPage.getPage()).toHaveURL(
      homePageUrl() +
        `/podcasts/${encodeURIComponent(
          podcastTitle
        )}/${podcastId}/${podcastEpisodeId}`
    )
    await podcastEpisodeDetailPage.getBreadcrumbPodcastDetailLink().click()
    const expectedUrl =
      homePageUrl() +
      `/podcasts/${encodeURIComponent(podcastTitle)}/${podcastId}`
    await expect(podcastDetailPage.getPage()).toHaveURL(expectedUrl)
  })
})
