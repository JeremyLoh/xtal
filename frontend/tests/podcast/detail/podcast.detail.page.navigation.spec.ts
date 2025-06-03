import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import {
  podcastId_259760_episodeId_34000697601,
  podcastId_259760_FirstTenEpisodes,
  podcastTitleWithSlash_firstEpisodeId_36643018274,
  podcastTitleWithSlash_tenEpisodes,
} from "../../mocks/podcast.episode"
import { assertPodcastInfo } from "../../constants/podcast/detail/podcastDetailConstants"

test.describe("Podcast Detail Page navigation", () => {
  test.describe("navigate to podcast category page using podcast category pills", () => {
    test("should navigate to the first category pill on click of podcast category pill in podcast info section", async ({
      podcastDetailPage,
    }) => {
      const podcastTitle = podcastTitleWithSlash_tenEpisodes.data.podcast.title
      const podcastCategories =
        podcastTitleWithSlash_tenEpisodes.data.podcast.categories
      const podcastId = `${podcastTitleWithSlash_tenEpisodes.data.podcast.id}`
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = podcastTitleWithSlash_tenEpisodes
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastTitleWithSlash_tenEpisodes.data.podcast
      )
      const firstCategory = podcastCategories[0]
      await expect(
        podcastDetailPage.getPodcastInfoCategoryPill(firstCategory)
      ).toBeVisible()
      await podcastDetailPage.getPodcastInfoCategoryPill(firstCategory).click()
      await expect(podcastDetailPage.getPage()).toHaveURL(
        new RegExp(`/podcasts/${firstCategory}`)
      )
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        `xtal - ${firstCategory.toLowerCase()} podcasts`
      )
    })
  })

  test.describe("navigate to podcast episode detail page using episode title link", () => {
    test("podcast title with forward slash character should allow navigation to podcast episode detail page", async ({
      podcastDetailPage,
      podcastEpisodeDetailPage,
    }) => {
      const podcastTitle = podcastTitleWithSlash_tenEpisodes.data.podcast.title
      const podcastId = `${podcastTitleWithSlash_tenEpisodes.data.podcast.id}`
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = podcastTitleWithSlash_tenEpisodes
            await route.fulfill({ json })
          }
        )
      const firstPodcastEpisode =
        podcastTitleWithSlash_tenEpisodes.data.episodes[0]
      const podcastEpisodeId = firstPodcastEpisode.id
      const expectedEpisodeDetailRoute = new RegExp(
        `/podcasts/${encodeURIComponent(
          podcastTitle
        )}/${podcastId}/${podcastEpisodeId}$`
      )
      await podcastEpisodeDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
          async (route) => {
            const json = podcastTitleWithSlash_firstEpisodeId_36643018274
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastTitleWithSlash_tenEpisodes.data.podcast
      )
      // do not assert podcast data as list is virtualized (rended items based on viewport visibility)
      const expectedEpisodeTitle =
        podcastTitleWithSlash_firstEpisodeId_36643018274.data.title
      const expectedEpisodeWebsite =
        podcastTitleWithSlash_firstEpisodeId_36643018274.data.externalWebsiteUrl
      await podcastDetailPage
        .getPodcastEpisodeCardTitle(expectedEpisodeTitle)
        .scrollIntoViewIfNeeded()
      await expect(
        podcastDetailPage.getPodcastEpisodeCardTitle(expectedEpisodeTitle)
      ).toBeVisible()
      await podcastDetailPage
        .getPodcastEpisodeCardTitle(expectedEpisodeTitle)
        .click()

      await expect(
        podcastEpisodeDetailPage.getEpisodeDetailContainer()
      ).toBeVisible()
      // podcast no data error message should not be shown
      await expect(
        podcastEpisodeDetailPage.getErrorMessage(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
      ).not.toBeVisible()

      expect(
        podcastEpisodeDetailPage.getPage().url(),
        "should be on podcast detail page url"
      ).toMatch(expectedEpisodeDetailRoute)
      await expect(
        podcastEpisodeDetailPage
          .getEpisodeDetailContainer()
          .getByText(expectedEpisodeTitle)
      ).toBeVisible()
      await expect(
        podcastEpisodeDetailPage
          .getEpisodeDetailContainer()
          .getByText(expectedEpisodeWebsite)
      ).toBeVisible()
    })

    test("podcast title without forward slash should navigate to podcast episode detail page on click of episode title", async ({
      podcastDetailPage,
      podcastEpisodeDetailPage,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          }
        )
      const { id: podcastEpisodeId } =
        podcastId_259760_episodeId_34000697601.data
      const expectedEpisodeDetailRoute = new RegExp(
        `/podcasts/${encodeURIComponent(
          podcastTitle
        )}/${podcastId}/${podcastEpisodeId}$`
      )
      await podcastEpisodeDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
          async (route) => {
            const json = podcastId_259760_episodeId_34000697601
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      // do not assert podcast data as list is virtualized (rended items based on viewport visibility)
      const expectedEpisodeTitle =
        podcastId_259760_episodeId_34000697601.data.title
      await podcastDetailPage
        .getPodcastEpisodeCardTitle(expectedEpisodeTitle)
        .scrollIntoViewIfNeeded()
      await expect(
        podcastDetailPage.getPodcastEpisodeCardTitle(expectedEpisodeTitle)
      ).toBeVisible()
      await podcastDetailPage
        .getPodcastEpisodeCardTitle(expectedEpisodeTitle)
        .click()
      await expect(
        podcastEpisodeDetailPage.getEpisodeDetailContainer()
      ).toBeVisible()
      // podcast no data error message should not be shown
      await expect(
        podcastEpisodeDetailPage.getErrorMessage(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
      ).not.toBeVisible()

      expect(
        podcastEpisodeDetailPage.getPage().url(),
        "should be on podcast detail page url"
      ).toMatch(expectedEpisodeDetailRoute)
    })
  })
})
