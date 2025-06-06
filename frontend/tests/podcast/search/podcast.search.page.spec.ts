import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import { podcastSearch_similarTerm_syntax_limit_10 } from "../../mocks/podcast.search"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../constants/scroller/scrollerConstants"
import { homePageUrl } from "../../constants/paths"
import PodcastSearchPage from "../../pageObjects/PodcastSearchPage"

test.describe("Podcast Search Page /podcasts/search", () => {
  function replaceWhitespaceWithPlusSymbol(text: string) {
    let output = text
    const regex = new RegExp(/ /g)
    while (regex.test(output)) {
      output = output.replace(regex, "+")
    }
    return output
  }

  async function getPodcastTitleLink(
    podcastSearchPage: PodcastSearchPage,
    podcastTitle: string
  ) {
    const virtualizedListParentElement = getVirtualizedListParentElement(
      podcastSearchPage.getPage()
    )
    const artwork = podcastSearchPage.getPodcastCardArtwork(
      podcastTitle + " podcast image"
    )
    // to handle virtualized list rendering (not all elements are rendered to DOM at once)
    await scrollUntilElementIsVisible(
      podcastSearchPage.getPage(),
      artwork,
      virtualizedListParentElement
    )
    return podcastSearchPage.getPodcastCardTitle(podcastTitle)
  }

  async function assertPodcastsAreVisible(
    podcastSearchPage: PodcastSearchPage,
    expectedPodcasts
  ) {
    for (const expectedPodcast of expectedPodcasts) {
      const virtualizedListParentElement = getVirtualizedListParentElement(
        podcastSearchPage.getPage()
      )
      const artwork = podcastSearchPage.getPodcastCardArtwork(
        expectedPodcast.title + " podcast image"
      )
      // to handle virtualized list rendering (not all elements are rendered to DOM at once)
      await scrollUntilElementIsVisible(
        podcastSearchPage.getPage(),
        artwork,
        virtualizedListParentElement
      )
      await expect(
        podcastSearchPage.getPodcastCardTitle(expectedPodcast.title)
      ).toBeVisible()
      await expect(
        podcastSearchPage.getPodcastCardAuthor(expectedPodcast.author)
      ).toBeVisible()
    }
  }

  test("should display podcasts matching search query input", async ({
    podcastSearchPage,
  }) => {
    test.slow()
    const query = "syntax"
    const limit = 10
    await podcastSearchPage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${replaceWhitespaceWithPlusSymbol(
          query
        )}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastSearchPage.goto(query)
    await expect(podcastSearchPage.getPage()).toHaveURL(
      homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
    )
    await expect(podcastSearchPage.getSearchResultHeader(query)).toBeVisible()
    await expect(podcastSearchPage.getSearchBar()).toBeVisible()
    const expectedPodcasts = podcastSearch_similarTerm_syntax_limit_10.data
    await assertPodcastsAreVisible(podcastSearchPage, expectedPodcasts)
  })

  test("should navigate to podcast detail page on title and author link click", async ({
    podcastSearchPage,
  }) => {
    test.slow()
    const query = "syntax"
    const limit = 10
    await podcastSearchPage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${replaceWhitespaceWithPlusSymbol(
          query
        )}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastSearchPage.goto(query)
    await expect(podcastSearchPage.getPage()).toHaveURL(
      homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
    )
    await expect(podcastSearchPage.getSearchResultHeader(query)).toBeVisible()
    const expectedPodcasts = podcastSearch_similarTerm_syntax_limit_10.data
    const expectedPodcast = expectedPodcasts[0]
    const expectedPodcastDetailPageUrl = new RegExp(
      `/podcasts/${encodeURIComponent(expectedPodcast.title)}/${
        expectedPodcast.id
      }$`
    )
    const titleElement = await getPodcastTitleLink(
      podcastSearchPage,
      expectedPodcast.title
    )
    await titleElement.click()
    expect(podcastSearchPage.getPage().url()).toMatch(
      expectedPodcastDetailPageUrl
    )
  })

  test("should display no podcast found message when query result is empty", async ({
    podcastSearchPage,
  }) => {
    test.slow()
    const query = "zero podcast data"
    const limit = 10
    // replace any whitespace to "+" for the api mock endpoint
    await podcastSearchPage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${replaceWhitespaceWithPlusSymbol(
          query
        )}&limit=${limit}`,
        async (route) => {
          const json = []
          await route.fulfill({ json })
        }
      )
    await podcastSearchPage.goto(query)
    await expect(podcastSearchPage.getPage()).toHaveURL(
      homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
    )
    await expect(podcastSearchPage.getSearchResultHeader(query)).toBeVisible()
    await expect(
      podcastSearchPage.getErrorMessage("No results found")
    ).toBeVisible()
    await expect(
      podcastSearchPage.getErrorMessage(
        "Try searching again using different spelling or keywords"
      )
    ).toBeVisible()
  })
})
