import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { podcastSearch_similarTerm_syntax_limit_10 } from "../../mocks/podcast.search"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../constants/scroller/scrollerConstants"

test.describe("Podcast Search Page /podcasts/search", () => {
  async function navigateToPodcastSearchPage(page: Page, query: string) {
    await page.goto(
      HOMEPAGE + `/podcasts/search?q=${encodeURIComponent(query)}`
    )
  }

  test("should display podcasts matching search query input", async ({
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
    await navigateToPodcastSearchPage(page, query)
    await expect(page).toHaveURL(
      HOMEPAGE + `/podcasts/search?q=${encodeURIComponent(query)}`
    )
    await expect(
      page.getByText(`Showing results for ${query}`, { exact: true })
    ).toBeVisible()

    const expectedPodcasts = podcastSearch_similarTerm_syntax_limit_10.data
    for (const expectedPodcast of expectedPodcasts) {
      const virtualizedListParentElement = getVirtualizedListParentElement(page)
      const artwork = page.locator(".podcast-card").getByRole("img", {
        name: expectedPodcast.title + " podcast image",
        exact: true,
      })
      // to handle virtualized list rendering (not all elements are rendered to DOM at once)
      await scrollUntilElementIsVisible(
        page,
        artwork,
        virtualizedListParentElement
      )
      const podcastCard = page.locator(".podcast-search-result-item", {
        has: artwork,
      })
      await expect(podcastCard).toBeVisible()
      await expect(
        podcastCard
          .locator(".podcast-card-title")
          .getByText(expectedPodcast.title, { exact: true })
      ).toBeVisible()
      await expect(
        podcastCard
          .locator(".podcast-card-author")
          .getByText(expectedPodcast.author, { exact: true })
      ).toBeVisible()
    }
  })
})
