import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants.ts"
import { Podcast } from "../../../src/api/podcast/model/podcast.ts"
import { podcastSearch_similarTerm_syntax_limit_10 } from "../../mocks/podcast.search.ts"

test.describe("Podcast Homepage /podcasts - Podcast Search Section", () => {
  function getPodcastSearchInput(page: Page) {
    return page.locator(".podcast-search-bar .search-input")
  }

  async function clickSearchResultTitle(page: Page, index: number) {
    await expect(
      page.locator(".podcast-search-result-title").nth(index)
    ).toBeVisible()
    await page.locator(".podcast-search-result-title").nth(index).click()
  }

  async function assertPodcastSearchResults(
    page: Page,
    expectedPodcasts: Podcast[]
  ) {
    await expect(page.locator(".search-result-list-container")).toBeVisible()
    await expect(page.locator(".podcast-search-result-title")).toHaveCount(
      expectedPodcasts.length
    )
    for (let i = 0; i < expectedPodcasts.length; i++) {
      const podcast = expectedPodcasts[i]
      await expect(
        page
          .locator(".podcast-search-result-title")
          .nth(i)
          .getByText(podcast.title, { exact: true })
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-search-result-author")
          .nth(i)
          .getByText(podcast.author, { exact: true })
      ).toBeVisible()
    }
  }

  test("should search and display similar podcasts", async ({ page }) => {
    const query = "syntax"
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${query}&limit=${limit}`,
      async (route) => {
        const json = podcastSearch_similarTerm_syntax_limit_10
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(getPodcastSearchInput(page)).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await assertPodcastSearchResults(
      page,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
  })

  test("should display zero results when search input is cleared", async ({
    page,
  }) => {
    test.slow()
    const query = "syntax"
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${query}&limit=${limit}`,
      async (route) => {
        const json = podcastSearch_similarTerm_syntax_limit_10
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(getPodcastSearchInput(page)).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await assertPodcastSearchResults(
      page,
      podcastSearch_similarTerm_syntax_limit_10.data
    )

    await getPodcastSearchInput(page).clear()
    await expect(
      page.locator(".search-result-list-container"),
      "should not display search result list when input is empty"
    ).not.toBeVisible()
  })

  test("should update search results when search input is changed", async ({
    page,
  }) => {
    test.slow()
    const query = "syntax"
    const updatedQuery = "updateSyntaxSearch"
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${query}&limit=${limit}`,
      async (route) => {
        const json = podcastSearch_similarTerm_syntax_limit_10
        await route.fulfill({ json })
      }
    )
    await page.route(
      `*/**/api/podcast/search?q=${updatedQuery}&limit=${limit}`,
      async (route) => {
        const json = {
          ...podcastSearch_similarTerm_syntax_limit_10,
          count: 2,
          data: podcastSearch_similarTerm_syntax_limit_10.data.slice(0, 2),
        }
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(getPodcastSearchInput(page)).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await assertPodcastSearchResults(
      page,
      podcastSearch_similarTerm_syntax_limit_10.data
    )

    await getPodcastSearchInput(page).clear()
    await getPodcastSearchInput(page).fill(updatedQuery)
    await assertPodcastSearchResults(
      page,
      podcastSearch_similarTerm_syntax_limit_10.data.slice(0, 2)
    )
  })

  test("should redirect user to podcast detail page on click of a search result title", async ({
    page,
  }) => {
    const query = "syntax"
    const limit = 10
    const podcastIndex = 0
    const expectedPodcast =
      podcastSearch_similarTerm_syntax_limit_10.data[podcastIndex]
    const expectedPodcastDetailPageUrl = new RegExp(
      `/podcasts/${encodeURIComponent(expectedPodcast.title)}/${
        expectedPodcast.id
      }$`
    )
    await page.route(
      `*/**/api/podcast/search?q=${query}&limit=${limit}`,
      async (route) => {
        const json = podcastSearch_similarTerm_syntax_limit_10
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(getPodcastSearchInput(page)).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await assertPodcastSearchResults(
      page,
      podcastSearch_similarTerm_syntax_limit_10.data
    )

    await clickSearchResultTitle(page, podcastIndex)
    expect(page.url()).toMatch(expectedPodcastDetailPageUrl)
  })
})
