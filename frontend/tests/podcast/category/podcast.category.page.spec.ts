import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import { tenArtTrendingPodcasts } from "../../mocks/podcast.trending.ts"
import {
  podcastId_259760_FirstTenEpisodes,
  podcastId_259760_OffsetTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants.ts"

test.describe("Podcast Category Page /podcasts/<category_name>", () => {
  test("should display trending podcasts in category", async ({
    podcastCategoryPage,
  }) => {
    test.slow()
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
    await expect(
      podcastCategoryPage.getTrendingPodcastContainer()
    ).toBeVisible()
    for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
      const expectedPodcast = tenArtTrendingPodcasts.data[i]
      await expect(
        podcastCategoryPage.getTrendingPodcastArtwork().nth(i),
        `(Podcast ${i + 1}) should have artwork present`
      ).toBeVisible()
      await expect(
        podcastCategoryPage
          .getTrendingPodcastTitle()
          .nth(i)
          .getByText(expectedPodcast.title, { exact: true }),
        `(Podcast ${i + 1}) should have title present`
      ).toBeVisible()
      await expect(
        podcastCategoryPage
          .getTrendingPodcastAuthor()
          .nth(i)
          .getByText(expectedPodcast.author, { exact: true }),
        `(Podcast ${i + 1}) should have author present`
      ).toBeVisible()
    }
  })

  test("should navigate to podcast homepage (/podcasts) when podcasts breadcrumb link is clicked", async ({
    podcastCategoryPage,
  }) => {
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
    await expect(
      podcastCategoryPage.getTrendingPodcastContainer()
    ).toBeVisible()
    await expect(podcastCategoryPage.getPage()).toHaveTitle(
      `xtal - ${category.toLowerCase()} podcasts`
    )
    await podcastCategoryPage.getBreadcrumbPodcastCategoryPageLink().click()
    await expect(podcastCategoryPage.getPage()).toHaveTitle("xtal - podcasts")
    expect(podcastCategoryPage.getPage().url()).toMatch(/\/podcasts$/)
  })

  test("should navigate to podcast category page when category breadcrumb link on podcast detail page is clicked after pagination is done on the page", async ({
    podcastCategoryPage,
    podcastDetailPage,
  }) => {
    test.slow()
    const category = "Business"
    const i = 0
    const expectedPodcastTitle = tenArtTrendingPodcasts.data[i].title
    const mockPodcastId = tenArtTrendingPodcasts.data[i].id
    await podcastCategoryPage
      .getPage()
      .route(
        `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
        async (route) => {
          // trending podcast endpoint returns data in different format
          const json = tenArtTrendingPodcasts
          await route.fulfill({ json })
        }
      )
    // mock the podcast detail page (we are only using the pagination feature)
    const limit = 10
    await podcastCategoryPage
      .getPage()
      .route(
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
    await podcastCategoryPage.goto(category)
    await assertLoadingSpinnerIsMissing(podcastCategoryPage.getPage())
    await expect(
      podcastCategoryPage.getTrendingPodcastContainer()
    ).toBeVisible()
    await expect(podcastCategoryPage.getPage()).toHaveTitle(
      `xtal - ${category.toLowerCase()} podcasts`
    )
    await podcastCategoryPage
      .getTrendingPodcastTitle()
      .nth(i)
      .getByText(expectedPodcastTitle, { exact: true })
      .click()
    const nextPaginationButton =
      podcastDetailPage.getNextEpisodeListPaginationButton()
    await expect(nextPaginationButton).toBeVisible()
    await nextPaginationButton.click()
    await assertLoadingSpinnerIsMissing(podcastDetailPage.getPage())
    // click back button, it should ignore pagination done and return to the respective podcast category page
    await expect(
      podcastDetailPage.getBreadcrumbPodcastDetailPageLink()
    ).toBeVisible()
    await podcastDetailPage.getBreadcrumbPodcastDetailPageLink().click()
    await expect(podcastCategoryPage.getPage()).toHaveTitle(
      `xtal - ${category.toLowerCase()} podcasts`
    )
  })
})
