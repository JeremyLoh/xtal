import test, { expect, Page } from "@playwright/test"
import {
  podcastId_259760_episodeId_34000697601,
  podcastId_259760_FirstTenEpisodes,
  podcastTitleWithSlash_firstEpisodeId_36643018274,
  podcastTitleWithSlash_tenEpisodes,
} from "../../mocks/podcast.episode"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { assertPodcastInfo } from "../../constants/podcast/detail/podcastDetailConstants"

test.describe("Podcast Detail Page navigation", () => {
  test.describe("navigate to podcast category page using podcast category pills", () => {
    function getPodcastInfoCategoryPill(page: Page, category: string) {
      return page
        .locator(".podcast-info-container")
        .getByText(category, { exact: true })
    }

    test("should navigate to the first category pill on click of podcast category pill in podcast info section", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent(
        podcastTitleWithSlash_tenEpisodes.data.podcast.title
      )
      const podcastCategories =
        podcastTitleWithSlash_tenEpisodes.data.podcast.categories
      const podcastId = podcastTitleWithSlash_tenEpisodes.data.podcast.id
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = podcastTitleWithSlash_tenEpisodes
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await assertPodcastInfo(
        page,
        podcastTitleWithSlash_tenEpisodes.data.podcast
      )
      const firstCategory = podcastCategories[0]
      await expect(
        getPodcastInfoCategoryPill(page, firstCategory)
      ).toBeVisible()
      await getPodcastInfoCategoryPill(page, firstCategory).click()
      await expect(page).toHaveURL(HOMEPAGE + `/podcasts/${firstCategory}`)
      await expect(page).toHaveTitle(
        `xtal - ${firstCategory.toLowerCase()} podcasts`
      )
    })
  })

  test.describe("navigate to podcast episode detail page using episode title link", () => {
    test("podcast title with forward slash character should allow navigation to podcast episode detail page", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent(
        podcastTitleWithSlash_tenEpisodes.data.podcast.title
      )
      const podcastId = podcastTitleWithSlash_tenEpisodes.data.podcast.id
      const limit = 10
      await page.route(
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
        `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}$`
      )
      await page.route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastTitleWithSlash_firstEpisodeId_36643018274
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await assertPodcastInfo(
        page,
        podcastTitleWithSlash_tenEpisodes.data.podcast
      )
      // do not assert podcast data as list is virtualized (rended items based on viewport visibility)
      const expectedEpisodeTitle =
        podcastTitleWithSlash_firstEpisodeId_36643018274.data.title
      const expectedEpisodeWebsite =
        podcastTitleWithSlash_firstEpisodeId_36643018274.data.externalWebsiteUrl
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .scrollIntoViewIfNeeded()
      await expect(
        page
          .locator(".podcast-episode-card")
          .getByText(expectedEpisodeTitle, { exact: true })
      ).toBeVisible()
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .click()

      await expect(
        page.locator(".podcast-episode-detail-container")
      ).toBeVisible()
      // podcast no data error message should not be shown
      await expect(
        page.getByText(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
      ).not.toBeVisible()

      expect(page.url(), "should be on podcast detail page url").toMatch(
        expectedEpisodeDetailRoute
      )
      await expect(
        page
          .locator(".podcast-episode-detail-container")
          .getByText(expectedEpisodeTitle)
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-detail-container")
          .getByText(expectedEpisodeWebsite)
      ).toBeVisible()
    })

    test("podcast title without forward slash should navigate to podcast episode detail page on click of episode title", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = podcastId_259760_FirstTenEpisodes
          await route.fulfill({ json })
        }
      )
      const { id: podcastEpisodeId } =
        podcastId_259760_episodeId_34000697601.data
      const expectedEpisodeDetailRoute = new RegExp(
        `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}$`
      )
      await page.route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      // do not assert podcast data as list is virtualized (rended items based on viewport visibility)
      const expectedEpisodeTitle =
        podcastId_259760_episodeId_34000697601.data.title
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .scrollIntoViewIfNeeded()
      await expect(
        page
          .locator(".podcast-episode-card")
          .getByText(expectedEpisodeTitle, { exact: true })
      ).toBeVisible()
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .click()
      await expect(
        page.locator(".podcast-episode-detail-container")
      ).toBeVisible()
      // podcast no data error message should not be shown
      await expect(
        page.getByText(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
      ).not.toBeVisible()

      expect(page.url(), "should be on podcast detail page url").toMatch(
        expectedEpisodeDetailRoute
      )
    })
  })
})
