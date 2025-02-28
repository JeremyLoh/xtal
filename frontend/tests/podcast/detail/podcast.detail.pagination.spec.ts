import test, { expect, Page } from "@playwright/test"
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
  function getPreviousPaginationButton(page: Page) {
    return page
      .locator(".podcast-episode-pagination")
      .getByRole("button", { name: "Previous" })
  }
  function getNextPaginationButton(page: Page) {
    return page
      .locator(".podcast-episode-pagination")
      .getByRole("button", { name: "Next" })
  }
  function getActivePageNumberElement(page: Page, activePageNumber: string) {
    return page
      .locator(".podcast-episode-pagination")
      .getByText(activePageNumber)
  }

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
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      await expect(getNextPaginationButton(page)).toBeVisible()
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
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
      await expect(getNextPaginationButton(page)).toBeVisible()
    })
  })

  test.describe("Previous Pagination Button", () => {
    test("should navigate to first page when previous pagination button is clicked from second page", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 2
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest =
            !requestUrl.includes("offset=") &&
            requestUrl.includes(`limit=${limit}`)
          const isSecondPageRequest =
            requestUrl.includes("offset=10") &&
            requestUrl.includes(`limit=${limit}`)

          if (isSecondPageRequest) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else if (isFirstPageRequest) {
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
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
      expect(page.url(), "should match url param of page=2").toMatch(/page=2$/)

      await getPreviousPaginationButton(page).click()

      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
      expect(page.url(), "should match url param of page=1").toMatch(/page=1$/)
    })
  })

  test.describe("Next Pagination Button", () => {
    test("should disable next pagination button on last page", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const expectedTotalEpisodes =
        podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
      const expectedTotalPages = Math.ceil(expectedTotalEpisodes / limit)
      const pageNumber = expectedTotalPages
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          const isLastPageRequest =
            requestUrl.includes(`offset=${expectedTotalEpisodes - limit}`) &&
            requestUrl.includes(`limit=${limit}`)

          if (isLastPageRequest) {
            // treat the last page request as the first ten episode data
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
      await expect(
        getActivePageNumberElement(page, `${pageNumber}`)
      ).toBeVisible()
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).toBeDisabled()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
    })

    test("should navigate to second page when next pagination button is clicked from first page", async ({
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
          const isFirstPageRequest =
            !requestUrl.includes("offset=") &&
            requestUrl.includes(`limit=${limit}`)
          const isSecondPageRequest =
            requestUrl.includes("offset=10") &&
            requestUrl.includes(`limit=${limit}`)

          if (isSecondPageRequest) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else if (isFirstPageRequest) {
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
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      expect(page.url(), "should match url param of page=1").toMatch(/page=1$/)

      await getNextPaginationButton(page).click()

      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
      await assertPodcastInfo(
        page,
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
      expect(page.url(), "should match url param of page=2").toMatch(/page=2$/)
    })
  })
})
