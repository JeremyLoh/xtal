import test, { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import { HOMEPAGE } from "../../constants/homepageConstants"
import {
  tenArtTrendingPodcasts,
  tenArtTrendingPodcastsOffsetTen,
} from "../../mocks/podcast.trending"
import {
  getActivePageNumberElement,
  getNextPaginationButton,
  getPageNumberElement,
  getPreviousPaginationButton,
  getSinceSelectFilter,
} from "../../constants/podcast/pagination/podcastTrendingPagination"

test.describe("Pagination on Podcast Category Page /podcasts/<category_name>", () => {
  function convertToUnixTimestamp(daysBefore: number): number {
    return dayjs().startOf("day").subtract(daysBefore, "days").unix()
  }

  async function assertTrendingPodcastIsShown(
    page: Page,
    expectedIndex: number,
    expectedPodcast: (typeof tenArtTrendingPodcasts.data)[0]
  ) {
    await expect(
      page
        .locator(".podcast-trending-card-container .podcast-card-artwork")
        .nth(expectedIndex),
      `(Podcast ${expectedIndex + 1}) should have artwork present`
    ).toBeVisible()
    await expect(
      page
        .locator(".podcast-trending-card-container .podcast-card-title")
        .nth(expectedIndex)
        .getByText(expectedPodcast.title, { exact: true }),
      `(Podcast ${expectedIndex + 1}) should have title present`
    ).toBeVisible()
    await expect(
      page
        .locator(".podcast-trending-card-container .podcast-card-author")
        .nth(expectedIndex)
        .getByText(expectedPodcast.author, { exact: true }),
      `(Podcast ${expectedIndex + 1}) should have author present`
    ).toBeVisible()
  }

  test.describe("Trending Podcasts Section", () => {
    test("should display active page, next and previous pagination buttons", async ({
      page,
    }) => {
      const expectedActivePage = "1"
      const category = "Arts"
      await page.route(
        `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
        async (route) => {
          const json = tenArtTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${category}`)
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
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
      const limit = 10
      const category = "Arts"
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=*&category=${category}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*&category=${category}`,
        async (route) => {
          const json = tenArtTrendingPodcastsOffsetTen
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${category}`)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await getNextPaginationButton(page).click()

      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
    })

    test("should allow pagination to previous page on previous pagination button click", async ({
      page,
    }) => {
      const limit = 10
      const category = "Arts"
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=*&category=${category}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*&category=${category}`,
        async (route) => {
          const json = tenArtTrendingPodcastsOffsetTen
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${category}`)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await getNextPaginationButton(page).click()

      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await getPreviousPaginationButton(page).click()

      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
    })

    test("should allow desktop pagination via page number button between first and second page", async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "skip desktop test")
      const limit = 10
      const category = "Arts"
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=*&category=${category}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=*&category=${category}`,
        async (route) => {
          const json = tenArtTrendingPodcastsOffsetTen
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${category}`)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }

      await getPageNumberElement(page, "2").click()
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
    })

    test("should reset pagination page to one when trending podcasts since filter is updated on second pagination page", async ({
      page,
    }) => {
      const defaultSinceDays = 3
      const sinceDaysSelect = 1
      const limit = 10
      const defaultSinceTimestamp = convertToUnixTimestamp(defaultSinceDays)
      const category = "Arts"
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=${defaultSinceTimestamp}&category=${category}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest = !requestUrl.includes(`offset=${limit}`)
          const json = isFirstPageRequest ? tenArtTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&offset=${limit}&since=${defaultSinceTimestamp}&category=${category}`,
        async (route) => {
          const json = tenArtTrendingPodcastsOffsetTen
          await route.fulfill({ json })
        }
      )
      // mock page one of a different since time selection
      const differentSinceTimestamp = convertToUnixTimestamp(sinceDaysSelect)
      await page.route(
        `*/**/api/podcast/trending?limit=${limit}&since=${differentSinceTimestamp}&category=${category}`,
        async (route) => {
          const requestUrl = route.request().url()
          const isMissingOffset = !requestUrl.includes(`offset=${limit}`)
          const json = isMissingOffset ? tenArtTrendingPodcasts : []
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${category}`)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
      await expect(getSinceSelectFilter(page)).toHaveValue(
        `${defaultSinceDays}`
      )
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await getNextPaginationButton(page).click()
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      for (let i = 0; i < tenArtTrendingPodcastsOffsetTen.count; i++) {
        const expectedPodcast = tenArtTrendingPodcastsOffsetTen.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
      // should reset the filters to zero offset with a new different since date search
      await getSinceSelectFilter(page).selectOption(`${sinceDaysSelect}`)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
        const expectedPodcast = tenArtTrendingPodcasts.data[i]
        await assertTrendingPodcastIsShown(page, i, expectedPodcast)
      }
    })
  })
})
