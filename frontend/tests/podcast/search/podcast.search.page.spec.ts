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

  function replaceWhitespaceWithPlusSymbol(text: string) {
    let output = text
    const regex = new RegExp(/ /g)
    while (regex.test(output)) {
      output = output.replace(regex, "+")
    }
    return output
  }

  async function assertPodcastSearchSectionIsVisible(page: Page) {
    await expect(page.locator(".podcast-search-bar")).toBeVisible()
  }

  async function getPodcastTitleAndAuthorLink(
    page: Page,
    podcastTitle: string
  ) {
    const virtualizedListParentElement = getVirtualizedListParentElement(page)
    const artwork = page.locator(".podcast-card").getByRole("img", {
      name: podcastTitle + " podcast image",
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
    return podcastCard
      .locator(".podcast-card-title")
      .getByText(podcastTitle, { exact: true })
  }

  async function assertPodcastsAreVisible(page: Page, expectedPodcasts) {
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
  }

  test("should display podcasts matching search query input", async ({
    page,
  }) => {
    test.slow()
    const query = "syntax"
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${replaceWhitespaceWithPlusSymbol(
        query
      )}&limit=${limit}`,
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
    await assertPodcastSearchSectionIsVisible(page)
    const expectedPodcasts = podcastSearch_similarTerm_syntax_limit_10.data
    await assertPodcastsAreVisible(page, expectedPodcasts)
  })

  test("should navigate to podcast detail page on title and author link click", async ({
    page,
  }) => {
    test.slow()
    const query = "syntax"
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${replaceWhitespaceWithPlusSymbol(
        query
      )}&limit=${limit}`,
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
    const expectedPodcast = expectedPodcasts[0]
    const expectedPodcastDetailPageUrl = new RegExp(
      `/podcasts/${encodeURIComponent(expectedPodcast.title)}/${
        expectedPodcast.id
      }$`
    )
    const titleElement = await getPodcastTitleAndAuthorLink(
      page,
      expectedPodcast.title
    )
    await titleElement.click()
    expect(page.url()).toMatch(expectedPodcastDetailPageUrl)
  })

  test("should display no podcast found message when query result is empty", async ({
    page,
  }) => {
    test.slow()
    const query = "zero podcast data"
    const limit = 10
    // replace any whitespace to "+" for the api mock endpoint
    await page.route(
      `*/**/api/podcast/search?q=${replaceWhitespaceWithPlusSymbol(
        query
      )}&limit=${limit}`,
      async (route) => {
        const json = []
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
    await expect(page.getByText("No results found")).toBeVisible()
    await expect(
      page.getByText("Try searching again using different spelling or keywords")
    ).toBeVisible()
  })
})
