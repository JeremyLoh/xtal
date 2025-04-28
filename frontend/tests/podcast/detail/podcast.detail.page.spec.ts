import test, { expect, Page } from "@playwright/test"
import {
  assertToastMessage,
  HOMEPAGE,
} from "../../constants/homepageConstants.ts"
import {
  defaultTenPodcastEpisodes,
  podcastId_259760_episodeId_34000697601,
  podcastId_259760_FirstTenEpisodes,
  podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes,
  podcastTitleWithSlash_firstEpisodeId_36643018274,
  podcastTitleWithSlash_tenEpisodes,
} from "../../mocks/podcast.episode.ts"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants.ts"
import {
  assertPodcastEpisodes,
  assertPodcastInfo,
  getExpectedEpisodeDuration,
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../constants/podcast/detail/podcastDetailConstants.ts"

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test("should display podcast detail page", async ({ page }) => {
    test.slow()
    const podcastTitle = encodeURIComponent("Batman University")
    const podcastId = "75075"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        const json = defaultTenPodcastEpisodes
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)
    await assertPodcastEpisodes(page, defaultTenPodcastEpisodes)
  })

  test("should display podcast detail page where podcast title has % symbol", async ({
    page,
  }) => {
    test.slow()
    const podcastTitle = "99%25%20Invisible" // "99% Invisible"
    const podcastId = "387129"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        const json =
          podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/99% Invisible - xtal - podcasts/)
    await expect(page.getByText("404 Not Found")).not.toBeVisible()
    await assertPodcastInfo(
      page,
      podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes.data
        .podcast
    )
    await assertPodcastEpisodes(
      page,
      podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes
    )
  })

  test.describe("navigate to podcast episode detail page", () => {
    test("podcast title with forward slash character should allow navigation to podcast episode detail page", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent(
        podcastTitleWithSlash_tenEpisodes.data.podcast.title
      )
      const podcastId = podcastTitleWithSlash_tenEpisodes.data.podcast.id
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = podcastTitleWithSlash_tenEpisodes
          await route.fulfill({ json })
        }
      )
      const firstPodcastEpisode =
        podcastTitleWithSlash_tenEpisodes.data.episodes[0]
      const podcastEpisodeId = firstPodcastEpisode.id
      const expectedEpisodeDetailRoute = new RegExp(
        `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}$`
      )
      await page.route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastTitleWithSlash_firstEpisodeId_36643018274
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await assertPodcastInfo(
        page,
        podcastTitleWithSlash_tenEpisodes.data.podcast
      )
      // do not assert podcast data as list is virtualized (rended items based on viewport visibility)
      const expectedEpisodeTitle =
        podcastTitleWithSlash_firstEpisodeId_36643018274.data.title
      const expectedEpisodeWebsite =
        podcastTitleWithSlash_firstEpisodeId_36643018274.data.externalWebsiteUrl
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .scrollIntoViewIfNeeded()
      await expect(
        page
          .locator(".podcast-episode-card")
          .getByText(expectedEpisodeTitle, { exact: true })
      ).toBeVisible()
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .click()

      await expect(
        page.locator(".podcast-episode-detail-container")
      ).toBeVisible()
      // podcast no data error message should not be shown
      await expect(
        page.getByText(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
      ).not.toBeVisible()

      expect(page.url(), "should be on podcast detail page url").toMatch(
        expectedEpisodeDetailRoute
      )
      await expect(
        page
          .locator(".podcast-episode-detail-container")
          .getByText(expectedEpisodeTitle)
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-detail-container")
          .getByText(expectedEpisodeWebsite)
      ).toBeVisible()
    })

    test("should navigate to podcast episode detail page on click of episode title", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = podcastId_259760_FirstTenEpisodes
          await route.fulfill({ json })
        }
      )
      const { id: podcastEpisodeId } =
        podcastId_259760_episodeId_34000697601.data
      const expectedEpisodeDetailRoute = new RegExp(
        `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}$`
      )
      await page.route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      // do not assert podcast data as list is virtualized (rended items based on viewport visibility)
      const expectedEpisodeTitle =
        podcastId_259760_episodeId_34000697601.data.title
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .scrollIntoViewIfNeeded()
      await expect(
        page
          .locator(".podcast-episode-card")
          .getByText(expectedEpisodeTitle, { exact: true })
      ).toBeVisible()
      await page
        .locator(".podcast-episode-card")
        .getByText(expectedEpisodeTitle, { exact: true })
        .click()
      await expect(
        page.locator(".podcast-episode-detail-container")
      ).toBeVisible()
      // podcast no data error message should not be shown
      await expect(
        page.getByText(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
      ).not.toBeVisible()

      expect(page.url(), "should be on podcast detail page url").toMatch(
        expectedEpisodeDetailRoute
      )
    })
  })

  test.describe("cache data", () => {
    test("should use cached podcast episode values after page refresh of first successful request", async ({
      page,
      headless,
    }) => {
      test.skip(headless, "Remove failing CI test in headless mode")
      test.slow()
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      let shouldFetchData = true
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = shouldFetchData ? defaultTenPodcastEpisodes : []
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)
      await assertPodcastEpisodes(page, defaultTenPodcastEpisodes)
      shouldFetchData = false
      await page.reload()
      await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)
      await assertPodcastEpisodes(page, defaultTenPodcastEpisodes)
    })
  })

  test.describe("data fetch failed", () => {
    function getPodcastEpisodeRefreshButton(page: Page) {
      return page.locator(".podcast-episode-container").getByRole("button", {
        name: "refresh podcast episodes",
        exact: true,
      })
    }

    test("should display podcast detail page refresh episode button on data fetch error", async ({
      page,
    }) => {
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = []
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await assertLoadingSpinnerIsMissing(page)
      await expect(
        page.getByText("Could not get podcast episodes. Please try again later")
      ).toBeVisible()
      await expect(getPodcastEpisodeRefreshButton(page)).toBeVisible()
    })

    test("should fetch podcast episode on refresh button click", async ({
      browser,
      headless,
    }) => {
      test.skip(headless, "Skip flaky headless test")
      test.slow()
      const context = await browser.newContext()
      const page = await context.newPage()
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      let shouldFetchData = false
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          if (shouldFetchData) {
            const json = defaultTenPodcastEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.route("*/**/auth/session/refresh", async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await assertLoadingSpinnerIsMissing(page)
      await expect(
        page.getByText("Could not get podcast episodes. Please try again later")
      ).toBeVisible()

      shouldFetchData = true
      await getPodcastEpisodeRefreshButton(page).click()
      await page.waitForTimeout(1000)
      await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)
      await assertPodcastEpisodes(page, defaultTenPodcastEpisodes)
      await context.close()
    })
  })

  test.describe("episode duration", () => {
    test("should display duration of episode in hours and minutes", async ({
      page,
    }) => {
      test.slow()
      const expectedDurationsInSeconds = [
        3600, 3601, 3602, 3603, 3604, 3605, 3606, 3607, 3608, 3609,
      ]
      const mockDurationPodcastEpisodes = {
        ...defaultTenPodcastEpisodes,
        data: {
          ...defaultTenPodcastEpisodes.data,
          episodes: defaultTenPodcastEpisodes.data.episodes.map(
            (episode, index) => {
              return {
                ...episode,
                durationInSeconds: expectedDurationsInSeconds[index],
              }
            }
          ),
        },
      }
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = mockDurationPodcastEpisodes
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      for (
        let i = 0;
        i < mockDurationPodcastEpisodes.data.episodes.length;
        i++
      ) {
        const episode = mockDurationPodcastEpisodes.data.episodes[i]
        const expectedDuration = getExpectedEpisodeDuration(
          episode.durationInSeconds
        )

        const artwork = page.locator(".podcast-episode-card").getByRole("img", {
          name: episode.title + " podcast image",
          exact: true,
        })
        const podcastEpisodeCard = page.locator(".podcast-episode-list-item", {
          has: artwork,
        })
        const durationLocator = podcastEpisodeCard.getByText(expectedDuration, {
          exact: true,
        })
        await scrollUntilElementIsVisible(
          page,
          artwork,
          getVirtualizedListParentElement(page)
        )
        await expect(
          durationLocator,
          `(Episode ${i + 1}) podcast episode card Duration should be present`
        ).toBeVisible()
      }
    })
  })

  test("should allow podcasts breadcrumb link click to navigate back to /podcasts homepage", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Batman University")
    const podcastId = "75075"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        const json = defaultTenPodcastEpisodes
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)
    await expect(
      page.getByTestId("podcast-detail-page-podcasts-link")
    ).toBeVisible()
    await page.getByTestId("podcast-detail-page-podcasts-link").click()
    await expect(page).toHaveTitle("xtal - podcasts")
    expect(page.url()).toMatch(/\/podcasts$/)
  })

  test("should display error toast for rate limit exceeded", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Batman University")
    const podcastId = "75075"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        await route.fulfill({
          status: 429,
          // retry-after headers are missing - https://github.com/microsoft/playwright/issues/19788
          headers: {
            "access-control-expose-headers": "retry-after",
            "retry-after": "2",
          },
          body: "Too many requests, please try again later.",
        })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    await assertToastMessage(
      page,
      "Rate Limit Exceeded, please try again later"
    )
  })

  test("should display generic error toast for server HTTP 404 error", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Batman University")
    const podcastId = "75075"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        await route.fulfill({
          status: 404,
        })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    await assertToastMessage(
      page,
      "Could not retrieve podcast episodes. Please try again later"
    )
  })
})
