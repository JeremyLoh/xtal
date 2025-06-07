import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { getAllVisiblePodcastEpisodeTitles } from "../../constants/podcast/detail/podcastDetailConstants"
import {
  getVirtualizedListParentElement,
  scrollToTop,
} from "../../constants/scroller/scrollerConstants"

test.describe("Podcast Episode Filters on Podcast Detail Page for individual podcast", () => {
  test.describe("filter episode by duration", () => {
    test("should not change duration filter selection on page navigation", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const expectedDurationsInSeconds = [
        3600, 3601, 1, 299, 300, 301, 3603, 3604, 3605, 3606,
      ]
      const mockDurationPodcastEpisodes = {
        ...defaultTenPodcastEpisodes,
        data: {
          ...defaultTenPodcastEpisodes.data,
          episodes: defaultTenPodcastEpisodes.data.episodes.map(
            (episode, index) => {
              return {
                ...episode,
                durationInSeconds: expectedDurationsInSeconds[index],
              }
            }
          ),
        },
      }
      const durationFilterInMinutes = 5
      const expectedVisibleEpisodesAfterFilter =
        mockDurationPodcastEpisodes.data.episodes.filter(
          (e) => e.durationInSeconds <= durationFilterInMinutes * 60
        )
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes("offset=")
            const isSecondPageRequest = requestUrl.includes(`offset=${limit}`)
            if (isFirstPageRequest) {
              const json = mockDurationPodcastEpisodes
              await route.fulfill({ json })
            } else if (isSecondPageRequest) {
              const json = mockDurationPodcastEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      const episodeDurationFilter = podcastDetailPage.getEpisodeDurationFilter()
      await expect(episodeDurationFilter).toBeVisible()
      await expect(episodeDurationFilter).toHaveValue("0")
      await episodeDurationFilter.selectOption("5")
      await expect(episodeDurationFilter).toHaveValue("5")

      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      const nextPaginationButton =
        podcastDetailPage.getNextEpisodeListPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await nextPaginationButton.click()
      await expect(episodeDurationFilter).toBeVisible()
      await expect(episodeDurationFilter).toHaveValue("5")
      const visibleEpisodeTitles = await getAllVisiblePodcastEpisodeTitles(
        podcastDetailPage.getPage()
      )
      expect(visibleEpisodeTitles.size).toBe(
        expectedVisibleEpisodesAfterFilter.length
      )
      for (const expectedEpisode of expectedVisibleEpisodesAfterFilter) {
        expect(visibleEpisodeTitles.has(expectedEpisode.title)).toBe(true)
      }
    })

    test("should reset duration filter when 'All' is selected again", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const expectedDurationsInSeconds = [
        3600, 3601, 1, 299, 300, 301, 3603, 3604, 3605, 3606,
      ]
      const mockDurationPodcastEpisodes = {
        ...defaultTenPodcastEpisodes,
        data: {
          ...defaultTenPodcastEpisodes.data,
          episodes: defaultTenPodcastEpisodes.data.episodes.map(
            (episode, index) => {
              return {
                ...episode,
                durationInSeconds: expectedDurationsInSeconds[index],
              }
            }
          ),
        },
      }
      const durationFilterInMinutes = 5
      const expectedVisibleEpisodesAfterFilter =
        mockDurationPodcastEpisodes.data.episodes.filter(
          (e) => e.durationInSeconds <= durationFilterInMinutes * 60
        )
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = mockDurationPodcastEpisodes
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      const episodeDurationFilter = podcastDetailPage.getEpisodeDurationFilter()
      await expect(episodeDurationFilter).toBeVisible()
      await expect(episodeDurationFilter).toHaveValue("0")
      await episodeDurationFilter.selectOption("5")
      await expect(episodeDurationFilter).toHaveValue("5")

      const visibleEpisodeTitles = await getAllVisiblePodcastEpisodeTitles(
        podcastDetailPage.getPage()
      )
      expect(visibleEpisodeTitles.size).toBe(
        expectedVisibleEpisodesAfterFilter.length
      )
      for (const expectedEpisode of expectedVisibleEpisodesAfterFilter) {
        expect(visibleEpisodeTitles.has(expectedEpisode.title)).toBe(true)
      }

      await episodeDurationFilter.selectOption("0")
      await expect(episodeDurationFilter).toHaveValue("0")

      await scrollToTop(
        getVirtualizedListParentElement(podcastDetailPage.getPage())
      )

      const zeroDurationFilterVisibleEpisodeTitles =
        await getAllVisiblePodcastEpisodeTitles(podcastDetailPage.getPage())
      expect(zeroDurationFilterVisibleEpisodeTitles.size).toBe(
        mockDurationPodcastEpisodes.data.episodes.length
      )
      for (const expectedEpisode of mockDurationPodcastEpisodes.data.episodes) {
        expect(
          zeroDurationFilterVisibleEpisodeTitles.has(expectedEpisode.title)
        ).toBe(true)
      }
    })

    test("should remove podcast episodes more than 5 minutes long on current pagination page", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const expectedDurationsInSeconds = [
        3600, 3601, 1, 299, 300, 301, 3603, 3604, 3605, 3606,
      ]
      const mockDurationPodcastEpisodes = {
        ...defaultTenPodcastEpisodes,
        data: {
          ...defaultTenPodcastEpisodes.data,
          episodes: defaultTenPodcastEpisodes.data.episodes.map(
            (episode, index) => {
              return {
                ...episode,
                durationInSeconds: expectedDurationsInSeconds[index],
              }
            }
          ),
        },
      }
      const durationFilterInMinutes = 5
      const expectedVisibleEpisodesAfterFilter =
        mockDurationPodcastEpisodes.data.episodes.filter(
          (e) => e.durationInSeconds <= durationFilterInMinutes * 60
        )
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = mockDurationPodcastEpisodes
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )

      const episodeDurationFilter = podcastDetailPage.getEpisodeDurationFilter()
      await expect(episodeDurationFilter).toBeVisible()
      await expect(episodeDurationFilter).toHaveValue("0")
      await episodeDurationFilter.selectOption("5")
      await expect(episodeDurationFilter).toHaveValue("5")

      const visibleEpisodeTitles = await getAllVisiblePodcastEpisodeTitles(
        podcastDetailPage.getPage()
      )
      expect(visibleEpisodeTitles.size).toBe(
        expectedVisibleEpisodesAfterFilter.length
      )
      for (const expectedEpisode of expectedVisibleEpisodesAfterFilter) {
        expect(visibleEpisodeTitles.has(expectedEpisode.title)).toBe(true)
      }
    })
  })
})
