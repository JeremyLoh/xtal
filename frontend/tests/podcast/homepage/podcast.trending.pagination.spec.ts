import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import dayjs from "dayjs"
import {
  defaultTenTrendingPodcasts,
  threeTrendingPodcasts,
} from "../../mocks/podcast.trending"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"
import PodcastHomePage from "../../pageObjects/PodcastHomePage"

test.describe("Podcast Homepage /podcasts", () => {
  function convertToUnixDaysBefore(daysBefore: number): number {
    return dayjs().startOf("day").subtract(daysBefore, "days").unix()
  }

  async function assertTrendingPodcastIsShown(
    podcastHomePage: PodcastHomePage,
    podcastData
  ) {
    await expect(
      podcastHomePage.getTrendingPodcastCards().getByText(podcastData.title, {
        exact: true,
      })
    ).toBeVisible()
    const imageLocator = podcastHomePage
      .getTrendingPodcastCards()
      .getByRole("img", {
        name: podcastData.title + " podcast image",
        exact: true,
      })
    await expect(imageLocator).toBeVisible()
  }

  test.describe("Trending Podcasts Section", () => {
    test("should display active page, next and previous pagination buttons", async ({
      podcastHomePage,
    }) => {
      test.slow()
      const expectedActivePage = "1"
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=10&since=*", async (route) => {
          const json = defaultTenTrendingPodcasts
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()

      const nextPaginationButton =
        podcastHomePage.getTrendingPodcastSectionNextPaginationButton()
      const previousPaginationButton =
        podcastHomePage.getTrendingPodcastSectionPreviousPaginationButton()
      const expectedActivePageNumber =
        podcastHomePage.getTrendingPodcastSectionActivePageNumber(
          expectedActivePage
        )
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await expect(expectedActivePageNumber).toBeVisible()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
    })

    test("should allow pagination to next page on next pagination button click", async ({
      podcastHomePage,
    }) => {
      test.slow()
      const limit = 10
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/category", async (route) => {
          await route.fulfill({ status: 200 })
        })
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=*`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*`,
          async (route) => {
            const json = threeTrendingPodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await assertLoadingSpinnerIsMissing(podcastHomePage.getPage())
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }

      const nextPaginationButton =
        podcastHomePage.getTrendingPodcastSectionNextPaginationButton()
      await nextPaginationButton.click()
      await assertLoadingSpinnerIsMissing(podcastHomePage.getPage())
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("2")
      ).toBeVisible()
      const previousPaginationButton =
        podcastHomePage.getTrendingPodcastSectionPreviousPaginationButton()
      await expect(previousPaginationButton).not.toBeDisabled()
    })

    test("should allow pagination to previous page on previous pagination button click", async ({
      podcastHomePage,
    }) => {
      test.slow()
      const limit = 10
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=*`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*`,
          async (route) => {
            const json = threeTrendingPodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
      const nextPaginationButton =
        podcastHomePage.getTrendingPodcastSectionNextPaginationButton()
      await nextPaginationButton.click()
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("2")
      ).toBeVisible()
      const previousPaginationButton =
        podcastHomePage.getTrendingPodcastSectionPreviousPaginationButton()
      await expect(previousPaginationButton).not.toBeDisabled()

      await previousPaginationButton.click()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
    })

    test("should allow desktop pagination via page number button between first and second page", async ({
      podcastHomePage,
      isMobile,
    }) => {
      test.skip(isMobile, "skip desktop test")
      test.slow()
      const limit = 10
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=*`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*`,
          async (route) => {
            const json = threeTrendingPodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()

      await podcastHomePage.getTrendingPodcastSectionPageNumber("2").click()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("2")
      ).toBeVisible()
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }

      await podcastHomePage.getTrendingPodcastSectionPageNumber("1").click()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
    })

    test("should reset pagination page to one when trending podcasts since filter is updated on second pagination page", async ({
      podcastHomePage,
    }) => {
      test.slow()
      const defaultSinceDays = 3
      const sinceDaysSelect = 1
      const defaultSinceTimestamp = convertToUnixDaysBefore(defaultSinceDays)
      const limit = 10
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=${defaultSinceTimestamp}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
            const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=${defaultSinceTimestamp}`,
          async (route) => {
            const json = threeTrendingPodcasts
            await route.fulfill({ json })
          }
        )
      // mock page one of different since time selection
      const differentSinceTimestamp = convertToUnixDaysBefore(sinceDaysSelect)
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/trending?limit=${limit}&since=${differentSinceTimestamp}`,
          async (route) => {
            const requestUrl = route.request().url()
            const isMissingOffset = !requestUrl.includes(`offset=${limit}`)
            const json = isMissingOffset ? defaultTenTrendingPodcasts : []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
      await expect(
        podcastHomePage.getTrendingPodcastSectionSinceSelectFilter()
      ).toHaveValue(`${defaultSinceDays}`)

      const nextPaginationButton =
        podcastHomePage.getTrendingPodcastSectionNextPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await nextPaginationButton.click()
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("2")
      ).toBeVisible()
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }

      const sinceSelectFilter =
        podcastHomePage.getTrendingPodcastSectionSinceSelectFilter()
      await sinceSelectFilter.selectOption(`${sinceDaysSelect}`)
      await expect(sinceSelectFilter).toHaveValue(`${sinceDaysSelect}`)
      await expect(
        podcastHomePage.getTrendingPodcastSectionActivePageNumber("1")
      ).toBeVisible()
      const previousPaginationButton =
        podcastHomePage.getTrendingPodcastSectionPreviousPaginationButton()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(podcastHomePage, podcastData)
      }
    })
  })
})
