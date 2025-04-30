import test, { expect } from "@playwright/test"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { HOMEPAGE } from "../../constants/homepageConstants"
import {
  getAllVisiblePodcastEpisodeTitles,
  getEpisodeDurationSelectFilter,
} from "../../constants/podcast/detail/podcastDetailConstants"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"
import {
  getActivePageNumberElement,
  getNextPaginationButton,
} from "../../constants/podcast/pagination/podcastDetailPagination"

test.describe("Podcast Episode Filters on Podcast Detail Page for individual podcast", () => {
  test.describe("filter episode by duration", () => {
    test("should not change duration filter selection on page navigation", async ({
      page,
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
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      await page.route(
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
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await assertLoadingSpinnerIsMissing(page)
      await expect(getEpisodeDurationSelectFilter(page)).toBeVisible()
      await expect(getEpisodeDurationSelectFilter(page)).toHaveValue("0")
      await getEpisodeDurationSelectFilter(page).selectOption("5")
      await expect(getEpisodeDurationSelectFilter(page)).toHaveValue("5")
      await assertLoadingSpinnerIsMissing(page)

      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getNextPaginationButton(page)).toBeVisible()
      await getNextPaginationButton(page).click()
      await assertLoadingSpinnerIsMissing(page)
      await expect(getEpisodeDurationSelectFilter(page)).toBeVisible()
      await expect(getEpisodeDurationSelectFilter(page)).toHaveValue("5")
      const visibleEpisodeTitles = await getAllVisiblePodcastEpisodeTitles(page)
      expect(visibleEpisodeTitles.size).toBe(
        expectedVisibleEpisodesAfterFilter.length
      )
      for (const expectedEpisode of expectedVisibleEpisodesAfterFilter) {
        expect(visibleEpisodeTitles.has(expectedEpisode.title)).toBe(true)
      }
    })

    test("should remove podcast episodes more than 5 minutes long on current pagination page", async ({
      page,
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
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = mockDurationPodcastEpisodes
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await assertLoadingSpinnerIsMissing(page)

      await expect(getEpisodeDurationSelectFilter(page)).toBeVisible()
      await expect(getEpisodeDurationSelectFilter(page)).toHaveValue("0")
      await getEpisodeDurationSelectFilter(page).selectOption("5")
      await expect(getEpisodeDurationSelectFilter(page)).toHaveValue("5")

      await assertLoadingSpinnerIsMissing(page)
      const visibleEpisodeTitles = await getAllVisiblePodcastEpisodeTitles(page)
      expect(visibleEpisodeTitles.size).toBe(
        expectedVisibleEpisodesAfterFilter.length
      )
      for (const expectedEpisode of expectedVisibleEpisodesAfterFilter) {
        expect(visibleEpisodeTitles.has(expectedEpisode.title)).toBe(true)
      }
    })
  })
})
