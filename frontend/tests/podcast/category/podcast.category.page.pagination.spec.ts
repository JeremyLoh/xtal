import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import dayjs from "dayjs"
import {
  tenArtTrendingPodcasts,
  tenArtTrendingPodcastsOffsetTen,
} from "../../mocks/podcast.trending"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"
import PodcastCategoryPage from "../../pageObjects/PodcastCategoryPage"

test.describe("Pagination on Podcast Category Page /podcasts/<category_name>", () => {
  function convertToUnixTimestamp(daysBefore: number): number {
    return dayjs().startOf("day").subtract(daysBefore, "days").unix()
  }

  async function assertTrendingPodcastIsShown(
    podcastCategoryPage: PodcastCategoryPage,
    expectedIndex: number,
    expectedPodcast: (typeof tenArtTrendingPodcasts.data)[0]
  ) {
    await expect(
      podcastCategoryPage.getTrendingPodcastArtwork().nth(expectedIndex),
      `(Podcast ${expectedIndex + 1}) should have artwork present`
    ).toBeVisible()
    await expect(
      podcastCategoryPage
        .getTrendingPodcastTitle()
        .nth(expectedIndex)
        .getByText(expectedPodcast.title, { exact: true }),
      `(Podcast ${expectedIndex + 1}) should have title present`
    ).toBeVisible()
    await expect(
      podcastCategoryPage
        .getTrendingPodcastAuthor()
        .nth(expectedIndex)
        .getByText(expectedPodcast.author, { exact: true }),
      `(Podcast ${expectedIndex + 1}) should have author present`
    ).toBeVisible()
  }

  test.describe("Trending Podcasts Section", () => {
    test("should display active page, next and previous pagination buttons", async ({
      podcastCategoryPage,
    }) => {
      test.slow()
      const expectedActivePage = "1"
      const category = "Arts"
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
          async (route) => {
            const json = tenArtTrendingPodcasts
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage.goto(category)
      await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      const nextPaginationButton =
        podcastCategoryPage.getTrendingPodcastNextPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber(
          expectedActivePage
        )
      ).toBeVisible()
      const previousPaginationButton =
        podcastCategoryPage.getTrendingPodcastPreviousPaginationButton()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
    })

    test("should allow pagination to next page on next pagination button click", async ({
      podcastCategoryPage,
    }) => {
      test.slow()
      const limit = 10
      const category = "Arts"
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=*&category=${category}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*&category=${category}`,
          async (route) => {
            const json = tenArtTrendingPodcastsOffsetTen
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage.goto(category)
      await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("1")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      const nextPaginationButton =
        podcastCategoryPage.getTrendingPodcastNextPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await nextPaginationButton.click()
      await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())

      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("2")
      ).toBeVisible()
    })

    test("should allow pagination to previous page on previous pagination button click", async ({
      podcastCategoryPage,
    }) => {
      test.slow()
      const limit = 10
      const category = "Arts"
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=*&category=${category}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*&category=${category}`,
          async (route) => {
            const json = tenArtTrendingPodcastsOffsetTen
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage.goto(category)
      await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("1")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      const nextPaginationButton =
        podcastCategoryPage.getTrendingPodcastNextPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await nextPaginationButton.click()
      await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())

      const previousPaginationButton =
        podcastCategoryPage.getTrendingPodcastPreviousPaginationButton()
      await expect(previousPaginationButton).not.toBeDisabled()
      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("2")
      ).toBeVisible()
      await previousPaginationButton.click()
      await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())

      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("1")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
    })

    test("should allow desktop pagination via page number button between first and second page", async ({
      podcastCategoryPage,
      isMobile,
    }) => {
      test.skip(isMobile, "skip desktop test")
      test.slow()
      const limit = 10
      const category = "Arts"
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=*&category=${category}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*&category=${category}`,
          async (route) => {
            const json = tenArtTrendingPodcastsOffsetTen
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage.goto(category)
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("1")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }

      await podcastCategoryPage
        .getTrendingPodcastPaginationPageNumber("2")
        .click()
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("2")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
    })

    test("should reset pagination page to one when trending podcasts since filter is updated on second pagination page", async ({
      podcastCategoryPage,
    }) => {
      test.slow()
      const defaultSinceDays = 3
      const sinceDaysSelect = 1
      const limit = 10
      const defaultSinceTimestamp = convertToUnixTimestamp(defaultSinceDays)
      const category = "Arts"
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=${defaultSinceTimestamp}&category=${category}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=${defaultSinceTimestamp}&category=${category}`,
          async (route) => {
            const json = tenArtTrendingPodcastsOffsetTen
            await route.fulfill({ json })
          }
        )
      // mock page one of a different since time selection
      const differentSinceTimestamp = convertToUnixTimestamp(sinceDaysSelect)
      await podcastCategoryPage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=${differentSinceTimestamp}&category=${category}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isMissingOffset = !requestUrl.includes(`offset=${limit}`)
            const json = isMissingOffset ? tenArtTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastCategoryPage.goto(category)
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("1")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      await expect(
        podcastCategoryPage.getTrendingPodcastSinceSelectFilter()
      ).toHaveValue(`${defaultSinceDays}`)
      const nextPaginationButton =
        podcastCategoryPage.getTrendingPodcastNextPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await nextPaginationButton.click()
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("2")
      ).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
      // should reset the filters to zero offset with a new different since date search
      await podcastCategoryPage
        .getTrendingPodcastSinceSelectFilter()
        .selectOption(`${sinceDaysSelect}`)
      await expect(
        podcastCategoryPage.getTrendingPodcastPaginationActivePageNumber("1")
      ).toBeVisible()
      const previousPaginationButton =
        podcastCategoryPage.getTrendingPodcastPreviousPaginationButton()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(
          podcastCategoryPage,
          i,
          expectedPodcast
        )
      }
    })
  })
})
