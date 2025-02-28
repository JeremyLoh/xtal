import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants.ts"
import {
  podcastId_259760_FirstTenEpisodes,
  podcastId_259760_OffsetTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import {
  assertPodcastEpisodes,
  assertPodcastInfo,
} from "../../constants/podcast/detail/podcastDetailConstants.ts"

test.describe("Pagination of Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test.describe("Pagination using url parameter '?page=PAGE-NUMBER'", () => {
    test("should display latest ten podcasts for first page", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 1
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          if (
            !requestUrl.includes(`offset=`) &&
            requestUrl.includes(`limit=${limit}`)
          ) {
            // ensure backend api call does not have offset parameter
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
      await expect(page.locator(".podcast-episode-pagination")).toBeVisible()
      await expect(
        page.locator(".podcast-episode-pagination").getByText("1")
      ).toBeVisible()
    })

    test("should display second page of podcast episodes when url param ?page=2 is given", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 2
      const expectedOffset = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          if (
            requestUrl.includes(`offset=${expectedOffset}`) &&
            requestUrl.includes(`limit=${limit}`)
          ) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
      await expect(page.locator(".podcast-episode-pagination")).toBeVisible()
      await expect(
        page.locator(".podcast-episode-pagination").getByText("2")
      ).toBeVisible()
    })
  })
})
