import test, { expect, Page } from "@playwright/test"
import {
  defaultTenTrendingPodcasts,
  threeTrendingPodcasts,
} from "../../mocks/podcast.trending"
import { HOMEPAGE } from "../../constants/homepageConstants"
import {
  getActivePageNumberElement,
  getNextPaginationButton,
  getPreviousPaginationButton,
} from "../../constants/podcast/pagination/podcastTrendingPagination"
import { getPodcastCards } from "../../constants/podcast/trending/podcastTrendingConstants"

test.describe("Podcast Homepage /podcasts", () => {
  async function assertTrendingPodcastIsShown(page: Page, podcastData) {
    await getPodcastCards(page)
      .getByText(podcastData.title, { exact: true })
      .scrollIntoViewIfNeeded()
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
    })

    test("should allow pagination to previous page on previous pagination button click", async ({
      page,
    }) => {
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
  })
})
