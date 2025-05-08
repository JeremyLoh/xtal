import test, { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import {
  defaultTenTrendingPodcasts,
  threeTrendingPodcasts,
} from "../../mocks/podcast.trending"
import { HOMEPAGE } from "../../constants/homepageConstants"
import {
  getActivePageNumberElement,
  getPageNumberElement,
  getNextPaginationButton,
  getPreviousPaginationButton,
  getSinceSelectFilter,
} from "../../constants/podcast/pagination/podcastTrendingPagination"
import { getPodcastCards } from "../../constants/podcast/trending/podcastTrendingConstants"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"

test.describe("Podcast Homepage /podcasts", () => {
  function convertToUnixTimestamp(daysBefore: number): number {
    return dayjs().startOf("day").subtract(daysBefore, "days").unix()
  }

  async function assertTrendingPodcastIsShown(page: Page, podcastData) {
    await expect(
      getPodcastCards(page).getByText(podcastData.title, {
        exact: true,
      })
    ).toBeVisible()
    const imageLocator = getPodcastCards(page).getByRole("img", {
      name: podcastData.title + " podcast image",
      exact: true,
    })
    await expect(imageLocator).toBeVisible()
  }

  test.describe("Trending Podcasts Section", () => {
    test("should display active page, next and previous pagination buttons", async ({
      page,
    }) => {
      test.slow()
      const expectedActivePage = "1"
      await page.route(
        "*/**/api/podcast/trending?limit=10&since=*",
        async (route) => {
          const json = defaultTenTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()

      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await expect(
        getActivePageNumberElement(page, expectedActivePage)
      ).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
    })

    test("should allow pagination to next page on next pagination button click", async ({
      page,
    }) => {
      test.slow()
      const limit = 10
      await page.route("*/**/api/podcast/category", async (route) => {
        await route.fulfill({ status: 200 })
      })
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=*`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*`,
        async (route) => {
          const json = threeTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await assertLoadingSpinnerIsMissing(page)
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }

      await getNextPaginationButton(page).click()
      await assertLoadingSpinnerIsMissing(page)
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
    })

    test("should allow pagination to previous page on previous pagination button click", async ({
      page,
    }) => {
      test.slow()
      const limit = 10
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=*`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*`,
        async (route) => {
          const json = threeTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
      await getNextPaginationButton(page).click()
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()

      await getPreviousPaginationButton(page).click()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
    })

    test("should allow desktop pagination via page number button between first and second page", async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "skip desktop test")
      test.slow()
      const limit = 10
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=*`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*`,
        async (route) => {
          const json = threeTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()

      await getPageNumberElement(page, "2").click()
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }

      await getPageNumberElement(page, "1").click()
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
    })

    test("should reset pagination page to one when trending podcasts since filter is updated on second pagination page", async ({
      page,
    }) => {
      test.slow()
      const defaultSinceDays = 3
      const sinceDaysSelect = 1
      const defaultSinceTimestamp = convertToUnixTimestamp(defaultSinceDays)
      const limit = 10
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=${defaultSinceTimestamp}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? defaultTenTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=${defaultSinceTimestamp}`,
        async (route) => {
          const json = threeTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      // mock page one of different since time selection
      const differentSinceTimestamp = convertToUnixTimestamp(sinceDaysSelect)
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=${differentSinceTimestamp}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isMissingOffset = !requestUrl.includes(`offset=${limit}`)
          const json = isMissingOffset ? defaultTenTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
      await expect(getSinceSelectFilter(page)).toHaveValue(
        `${defaultSinceDays}`
      )

      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await getNextPaginationButton(page).click()
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      for (const podcastData of threeTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }

      await getSinceSelectFilter(page).selectOption(`${sinceDaysSelect}`)
      await expect(getSinceSelectFilter(page)).toHaveValue(`${sinceDaysSelect}`)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await assertTrendingPodcastIsShown(page, podcastData)
      }
    })
  })
})
