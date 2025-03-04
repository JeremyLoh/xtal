import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants.ts"
import { podcastSearch_similarTerm_syntax_limit_10 } from "../../mocks/podcast.search.ts"

test.describe("Podcast Homepage /podcasts - Podcast Search Section", () => {
  function getPodcastSearchInput(page: Page) {
    return page.locator(".podcast-search-bar .search-input")
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
    await expect(page.locator(".podcast-search-bar")).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await expect(page.locator(".search-result-list-container")).toBeVisible()
    for (let i = 0; i < podcastSearch_similarTerm_syntax_limit_10.count; i++) {
      const podcast = podcastSearch_similarTerm_syntax_limit_10.data[i]
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

    await getPodcastSearchInput(page).clear()
    await expect(
      page.locator(".search-result-list-container"),
      "should not display search result list when input is empty"
    ).not.toBeVisible()
  })
})
