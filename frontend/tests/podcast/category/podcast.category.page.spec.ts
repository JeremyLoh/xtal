import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants.ts"
import { tenArtTrendingPodcasts } from "../../mocks/podcast.trending.ts"
import {
  podcastId_259760_FirstTenEpisodes,
  podcastId_259760_OffsetTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import { getNextPaginationButton } from "../../constants/podcast/pagination/podcastDetailPagination.ts"

test.describe("Podcast Category Page /podcasts/<category_name>", () => {
  test("should display trending podcasts in category", async ({ page }) => {
    const category = "Arts"
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    await expect(page.locator(".podcast-trending-container")).toBeVisible()
    for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
      const expectedPodcast = tenArtTrendingPodcasts.data[i]
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-artwork")
          .nth(i),
        `(Podcast ${i + 1}) should have artwork present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-title")
          .nth(i)
          .getByText(expectedPodcast.title, { exact: true }),
        `(Podcast ${i + 1}) should have title present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-author")
          .nth(i)
          .getByText(expectedPodcast.author, { exact: true }),
        `(Podcast ${i + 1}) should have author present`
      ).toBeVisible()
    }
  })

  test("should navigate to podcast homepage (/podcasts) when podcasts breadcrumb link is clicked", async ({
    page,
  }) => {
    const category = "Arts"
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    await expect(page.locator(".podcast-trending-container")).toBeVisible()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
    await page.getByTestId("podcast-category-page-podcasts-link").click()
    await expect(page).toHaveTitle("xtal - podcasts")
    expect(page.url()).toMatch(/\/podcasts$/)
  })

  test("should navigate to podcast category page when back button on podcast detail page is clicked", async ({
    page,
  }) => {
    const category = "Arts"
    const i = 0
    const expectedPodcastTitle = tenArtTrendingPodcasts.data[i].title
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    await expect(page.locator(".podcast-trending-container")).toBeVisible()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
    await page
      .locator(".podcast-trending-card-container .podcast-card-title")
      .nth(i)
      .getByText(expectedPodcastTitle, { exact: true })
      .click()
    // click of podcast detail back button should redirect user to podcast category page
    await expect(page.locator(".podcast-detail-back-button")).toBeVisible()
    await expect(page).not.toHaveTitle(
      `xtal - ${category.toLowerCase()} podcasts`
    )
    await page.locator(".podcast-detail-back-button").click()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
  })

  test("should navigate to podcast category page when back button on podcast detail page is clicked after pagination is done on the page", async ({
    page,
  }) => {
    const category = "Business"
    const i = 0
    const expectedPodcastTitle = tenArtTrendingPodcasts.data[i].title
    const mockPodcastId = tenArtTrendingPodcasts.data[i].id
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        // trending podcast endpoint returns data in different format
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    // mock the podcast detail page (we are only using the pagination feature)
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${mockPodcastId}**`,
      async (route) => {
        const requestUrl = route.request().url()
        const isFirstPageRequest =
          !requestUrl.includes("offset=") &&
          requestUrl.includes(`limit=${limit}`)
        const isSecondPageRequest =
          requestUrl.includes("offset=10") &&
          requestUrl.includes(`limit=${limit}`)
        if (isFirstPageRequest) {
          // ensure backend api call does not have offset parameter
          const json = podcastId_259760_FirstTenEpisodes
          await route.fulfill({ json })
        } else if (isSecondPageRequest) {
          const json = podcastId_259760_OffsetTenEpisodes
          await route.fulfill({ json })
        } else {
          const json = []
          await route.fulfill({ json })
        }
      }
    )

    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    await expect(page.locator(".podcast-trending-container")).toBeVisible()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
    await page
      .locator(".podcast-trending-card-container .podcast-card-title")
      .nth(i)
      .getByText(expectedPodcastTitle, { exact: true })
      .click()
    await expect(getNextPaginationButton(page)).toBeVisible()
    await getNextPaginationButton(page).click()
    // click back button, it should ignore pagination done and return to the respective podcast category page
    await expect(page.locator(".podcast-detail-back-button")).toBeVisible()
    await page.locator(".podcast-detail-back-button").click()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
  })
})
