import { test } from "../../fixture/test.ts"
import { expect, Page } from "@playwright/test"
import { Podcast } from "../../../src/api/podcast/model/podcast.ts"
import { podcastSearch_similarTerm_syntax_limit_10 } from "../../mocks/podcast.search.ts"
import PodcastHomePage from "../../pageObjects/PodcastHomePage.ts"
import { homePageUrl, podcastHomePageUrl } from "../../constants/paths.ts"

test.describe("Podcast Homepage /podcasts - Podcast Search Section", () => {
  async function clickSearchResultTitle(
    podcastHomePage: PodcastHomePage,
    index: number
  ) {
    await expect(
      podcastHomePage.getPodcastSearchResultTitle().nth(index)
    ).toBeVisible()
    await podcastHomePage.getPodcastSearchResultTitle().nth(index).click()
  }

  async function assertPodcastSearchResults(
    podcastHomePage: PodcastHomePage,
    expectedPodcasts: Podcast[]
  ) {
    await expect(
      podcastHomePage.getPodcastSearchResultContainer()
    ).toBeVisible()
    await expect(podcastHomePage.getPodcastSearchResultTitle()).toHaveCount(
      expectedPodcasts.length
    )
    for (let i = 0; i < expectedPodcasts.length; i++) {
      const podcast = expectedPodcasts[i]
      await expect(
        podcastHomePage
          .getPodcastSearchResultTitle()
          .nth(i)
          .getByText(podcast.title, { exact: true })
      ).toBeVisible()
      await expect(
        podcastHomePage
          .getPodcastSearchResultAuthor()
          .nth(i)
          .getByText(podcast.author, { exact: true })
      ).toBeVisible()
    }
  }

  test("should allow podcast search input max length of 200 characters", async ({
    podcastHomePage,
  }) => {
    // should be sync with backend max character length for /api/podcast/search
    const maxInputLength = 200
    const query = "a".repeat(maxInputLength)
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          await route.fulfill({ json: [] })
        }
      )
    await podcastHomePage.goto()
    const podcastSearchInput = podcastHomePage.getPodcastSearchInput()
    await expect(podcastSearchInput).toBeVisible()
    await podcastSearchInput.fill(query)
    await expect(podcastSearchInput).toHaveValue(query)
  })

  test("should limit podcast search input to max length of 200 characters", async ({
    podcastHomePage,
  }) => {
    // should be sync with backend max character length for /api/podcast/search
    const maxInputLength = 200
    const query = "a".repeat(maxInputLength + 1)
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          await route.fulfill({ json: [] })
        }
      )
    await podcastHomePage.goto()
    const podcastSearchInput = podcastHomePage.getPodcastSearchInput()
    await expect(podcastSearchInput).toBeVisible()
    await podcastSearchInput.fill(query)
    await expect(podcastSearchInput).toHaveValue(query.slice(0, maxInputLength))
  })

  test("should clear podcast search input values when user press keyboard 'Escape' key", async ({
    podcastHomePage,
  }) => {
    const query = "syntax"
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    const podcastSearchInput = podcastHomePage.getPodcastSearchInput()
    await expect(podcastSearchInput).toBeVisible()
    await podcastSearchInput.fill(query)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
    await podcastSearchInput.click()
    await podcastHomePage.getPage().keyboard.press("Escape")
    await expect(
      podcastHomePage.getPodcastSearchResultContainer(),
      "should not display search result list when user clicks outside podcast search input and result list"
    ).not.toBeVisible()
  })

  test("should remove podcast search result popup element when user clicks outside of search input element", async ({
    podcastHomePage,
  }) => {
    const query = "syntax"
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
    await podcastHomePage.getPodcastSearchInput().fill(query)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
    // click outside of podcast search input and search result popup element
    await podcastHomePage
      .getPage()
      .locator("body")
      .click({ position: { x: 1, y: 1 } })
    await expect(
      podcastHomePage.getPodcastSearchResultContainer(),
      "should not display search result list when user clicks outside podcast search input and result list"
    ).not.toBeVisible()
    await expect(podcastHomePage.getPodcastSearchInput()).toHaveValue(query)
  })

  test("should not close podcast search result popup element when user clicks inside the podcat search result popup", async ({
    podcastHomePage,
  }) => {
    const query = "syntax"
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
    await podcastHomePage.getPodcastSearchInput().fill(query)

    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
    // click inside podcast search result popup element
    await podcastHomePage.getPodcastSearchResultContainer().click({
      position: { x: 1, y: 1 },
    })
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
  })

  test("should search and display similar podcasts", async ({
    podcastHomePage,
  }) => {
    const query = "syntax"
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
    await podcastHomePage.getPodcastSearchInput().fill(query)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
  })

  test("should display zero results when search input is cleared", async ({
    podcastHomePage,
  }) => {
    test.slow()
    const query = "syntax"
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
    await podcastHomePage.getPodcastSearchInput().fill(query)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
    await podcastHomePage.getPodcastSearchInput().clear()
    await expect(
      podcastHomePage.getPodcastSearchResultContainer(),
      "should not display search result list when input is empty"
    ).not.toBeVisible()
  })

  test("should update search results when search input is changed", async ({
    podcastHomePage,
  }) => {
    test.slow()
    const query = "syntax"
    const updatedQuery = "updateSyntaxSearch"
    const limit = 10
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage
      .getPage()
      .route(
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
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
    await podcastHomePage.getPodcastSearchInput().fill(query)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )

    await podcastHomePage.getPodcastSearchInput().clear()
    await podcastHomePage.getPodcastSearchInput().fill(updatedQuery)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data.slice(0, 2)
    )
  })

  test("should redirect user to podcast detail page on click of a search result title", async ({
    podcastHomePage,
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
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/search?q=${query}&limit=${limit}`,
        async (route) => {
          const json = podcastSearch_similarTerm_syntax_limit_10
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
    await podcastHomePage.getPodcastSearchInput().fill(query)
    await assertPodcastSearchResults(
      podcastHomePage,
      podcastSearch_similarTerm_syntax_limit_10.data
    )

    await clickSearchResultTitle(podcastHomePage, podcastIndex)
    expect(podcastHomePage.getPage().url()).toMatch(
      expectedPodcastDetailPageUrl
    )
  })

  test.describe("redirect user to podcast search page", () => {
    async function assertPodcastSearchPageTitle(page: Page, query: string) {
      await expect(page).toHaveTitle(
        `Showing results for ${query} - xtal - podcasts`
      )
    }

    test("should redirect user to podcast search page if keyboard enter key is pressed", async ({
      podcastHomePage,
    }) => {
      const query = "syntax"
      const limit = 10
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/search?q=${query}&limit=${limit}`,
          async (route) => {
            const json = podcastSearch_similarTerm_syntax_limit_10
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
      await podcastHomePage.getPodcastSearchInput().fill(query)
      await podcastHomePage.getPage().keyboard.press("Enter")
      await expect(podcastHomePage.getPage()).toHaveURL(
        homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(podcastHomePage.getPage(), query)
      await expect(
        podcastHomePage
          .getPage()
          .getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })

    test("should not redirect user to podcast search page if search input is empty and keyboard enter key is pressed", async ({
      podcastHomePage,
    }) => {
      await podcastHomePage
        .getPage()
        .route(`*/**/api/podcast/search?**`, async (route) => {
          await route.fulfill({ json: [] })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
      await podcastHomePage.getPodcastSearchInput().click()
      await podcastHomePage.getPage().keyboard.press("Enter")
      await expect(podcastHomePage.getPage()).toHaveURL(podcastHomePageUrl())

      await podcastHomePage.getPodcastSearchInput().fill(" ") // ensure whitespace input is ignored
      await podcastHomePage.getPage().keyboard.press("Enter")
      await expect(podcastHomePage.getPage()).toHaveURL(podcastHomePageUrl())
    })

    test("should handle percent symbol in search input", async ({
      podcastHomePage,
    }) => {
      const query = "99% Invisible"
      await podcastHomePage
        .getPage()
        .route(`*/**/api/podcast/search?**`, async (route) => {
          await route.fulfill({ json: [] })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
      await podcastHomePage.getPodcastSearchInput().fill(query)
      await podcastHomePage.getPage().keyboard.press("Enter")
      await expect(podcastHomePage.getPage()).toHaveURL(
        homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(podcastHomePage.getPage(), query)
      await expect(
        podcastHomePage
          .getPage()
          .getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })

    test("should handle forward slash and back slash symbol in search input", async ({
      podcastHomePage,
    }) => {
      const query = "/ \\"
      await podcastHomePage
        .getPage()
        .route(`*/**/api/podcast/search?**`, async (route) => {
          await route.fulfill({ json: [] })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
      await podcastHomePage.getPodcastSearchInput().fill(query)
      await podcastHomePage.getPage().keyboard.press("Enter")
      await expect(podcastHomePage.getPage()).toHaveURL(
        homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(podcastHomePage.getPage(), query)
      await expect(
        podcastHomePage
          .getPage()
          .getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })

    test("should handle non english characters in search input", async ({
      podcastHomePage,
    }) => {
      // https://sakuratips.com/
      const query = "sakuratips ゴールデンウィーク Golden Week"
      await podcastHomePage
        .getPage()
        .route(`*/**/api/podcast/search?**`, async (route) => {
          await route.fulfill({ json: [] })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastSearchInput()).toBeVisible()
      await podcastHomePage.getPodcastSearchInput().fill(query)
      await podcastHomePage.getPage().keyboard.press("Enter")
      await expect(podcastHomePage.getPage()).toHaveURL(
        homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(podcastHomePage.getPage(), query)
      await expect(
        podcastHomePage
          .getPage()
          .getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })
  })
})
