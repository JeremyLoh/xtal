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

  function getPodcastSearchResultListElement(page: Page) {
    return page.locator(".search-result-list-container")
  }

  async function assertPodcastSearchResults(
    page: Page,
    expectedPodcasts: Podcast[]
  ) {
    await expect(getPodcastSearchResultListElement(page)).toBeVisible()
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

  test("should allow podcast search input max length of 200 characters", async ({
    page,
  }) => {
    // should be sync with backend max character length for /api/podcast/search
    const maxInputLength = 200
    const query = "a".repeat(maxInputLength)
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${query}&limit=${limit}`,
      async (route) => {
        const json = []
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(getPodcastSearchInput(page)).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await expect(getPodcastSearchInput(page)).toHaveValue(query)
  })

  test("should limit podcast search input to max length of 200 characters", async ({
    page,
  }) => {
    // should be sync with backend max character length for /api/podcast/search
    const maxInputLength = 200
    const query = "a".repeat(maxInputLength + 1)
    const limit = 10
    await page.route(
      `*/**/api/podcast/search?q=${query}&limit=${limit}`,
      async (route) => {
        const json = []
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(getPodcastSearchInput(page)).toBeVisible()
    await getPodcastSearchInput(page).fill(query)
    await expect(getPodcastSearchInput(page)).toHaveValue(
      query.slice(0, maxInputLength)
    )
  })

  test("should clear podcast search input values when user press keyboard 'Escape' key", async ({
    page,
  }) => {
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
    await getPodcastSearchInput(page).click()
    await page.keyboard.press("Escape")
    await expect(
      getPodcastSearchResultListElement(page),
      "should not display search result list when user clicks outside podcast search input and result list"
    ).not.toBeVisible()
  })

  test("should remove podcast search result popup element when user clicks outside of search input element", async ({
    page,
  }) => {
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
    // click outside of podcast search input and search result popup element
    await page.locator("body").click({ position: { x: 1, y: 1 } })
    await expect(
      getPodcastSearchResultListElement(page),
      "should not display search result list when user clicks outside podcast search input and result list"
    ).not.toBeVisible()
    await expect(getPodcastSearchInput(page)).toHaveValue(query)
  })

  test("should not close podcast search result popup element when user clicks inside the podcat search result popup", async ({
    page,
  }) => {
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
    // click inside podcast search result popup element
    await getPodcastSearchResultListElement(page).click({
      position: { x: 1, y: 1 },
    })
    await assertPodcastSearchResults(
      page,
      podcastSearch_similarTerm_syntax_limit_10.data
    )
  })

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
      getPodcastSearchResultListElement(page),
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

  test.describe("redirect user to podcast search page", () => {
    async function assertPodcastSearchPageTitle(page: Page, query: string) {
      await expect(page).toHaveTitle(
        `Showing results for ${query} - xtal - podcasts`
      )
    }

    test("should redirect user to podcast search page if keyboard enter key is pressed", async ({
      page,
    }) => {
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
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(
        HOMEPAGE + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(page, query)
      await expect(
        page.getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })

    test("should not redirect user to podcast search page if search input is empty and keyboard enter key is pressed", async ({
      page,
    }) => {
      await page.route(`*/**/api/podcast/search?**`, async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(getPodcastSearchInput(page)).toBeVisible()
      await getPodcastSearchInput(page).click()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(HOMEPAGE + "/podcasts")

      await getPodcastSearchInput(page).fill(" ") // ensure whitespace input is ignored
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(HOMEPAGE + "/podcasts")
    })

    test("should handle percent symbol in search input", async ({ page }) => {
      const query = "99% Invisible"
      await page.route(`*/**/api/podcast/search?**`, async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(getPodcastSearchInput(page)).toBeVisible()
      await getPodcastSearchInput(page).fill(query)
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(
        HOMEPAGE + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(page, query)
      await expect(
        page.getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })

    test("should handle forward slash and back slash symbol in search input", async ({
      page,
    }) => {
      const query = "/ \\"
      await page.route(`*/**/api/podcast/search?**`, async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(getPodcastSearchInput(page)).toBeVisible()
      await getPodcastSearchInput(page).fill(query)
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(
        HOMEPAGE + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(page, query)
      await expect(
        page.getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })

    test("should handle non english characters in search input", async ({
      page,
    }) => {
      // https://sakuratips.com/
      const query = "sakuratips ゴールデンウィーク Golden Week"
      await page.route(`*/**/api/podcast/search?**`, async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(getPodcastSearchInput(page)).toBeVisible()
      await getPodcastSearchInput(page).fill(query)
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(
        HOMEPAGE + `/podcasts/search?q=${encodeURIComponent(query)}`
      )
      await assertPodcastSearchPageTitle(page, query)
      await expect(
        page.getByText(`Showing results for ${query}`, { exact: true })
      ).toBeVisible()
    })
  })
})
