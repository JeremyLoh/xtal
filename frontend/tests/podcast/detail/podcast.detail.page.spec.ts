import { test } from "../../fixture/test.ts"
import { expect } from "@playwright/test"
import { assertToastMessage } from "../../constants/toasterConstants.ts"
import {
  defaultTenPodcastEpisodes,
  podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import {
  assertPodcastEpisodes,
  assertPodcastInfo,
  getExpectedEpisodeDuration,
} from "../../constants/podcast/detail/podcastDetailConstants.ts"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../constants/scroller/scrollerConstants.ts"
import PodcastDetailPage from "../../pageObjects/PodcastDetailPage.ts"
import { podcastHomePageUrl } from "../../constants/paths.ts"

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test("should display podcast detail page", async ({ podcastDetailPage }) => {
    test.slow()
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = defaultTenPodcastEpisodes
          await route.fulfill({ json })
        }
      )
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /Batman University - xtal - podcasts/
    )
    await assertPodcastInfo(
      podcastDetailPage.getPage(),
      defaultTenPodcastEpisodes.data.podcast
    )
    await assertPodcastEpisodes(
      podcastDetailPage.getPage(),
      defaultTenPodcastEpisodes
    )
  })

  test("should display podcast detail page where podcast title has % symbol", async ({
    podcastDetailPage,
  }) => {
    test.slow()
    const podcastTitle = "99% Invisible" // encodeURIComponent => "99%25%20Invisible"
    const podcastId = "387129"
    const limit = 10
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json =
            podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes
          await route.fulfill({ json })
        }
      )
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /99% Invisible - xtal - podcasts/
    )
    await expect(
      podcastDetailPage.getPage().getByText("404 Not Found")
    ).not.toBeVisible()
    await assertPodcastInfo(
      podcastDetailPage.getPage(),
      podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes.data
        .podcast
    )
    await assertPodcastEpisodes(
      podcastDetailPage.getPage(),
      podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes
    )
  })

  test("should display podcast info without last active time when podcast latestPublishTime is missing", async ({
    podcastDetailPage,
  }) => {
    test.slow()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { latestPublishTime, ...podcastWithoutLatestPublishTime } =
      podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes.data
        .podcast
    const podcastWithoutLastPublishTime = {
      ...podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes,
      data: {
        ...podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes.data,
        podcast: podcastWithoutLatestPublishTime,
      },
    }
    const podcastTitle = "99% Invisible" // encodeURIComponent => "99%25%20Invisible"
    const podcastId = "387129"
    const limit = 10
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = podcastWithoutLastPublishTime
          await route.fulfill({ json })
        }
      )
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /99% Invisible - xtal - podcasts/
    )
    await assertPodcastInfo(
      podcastDetailPage.getPage(),
      podcastWithoutLastPublishTime.data.podcast
    )
    await assertPodcastEpisodes(
      podcastDetailPage.getPage(),
      podcastWithoutLastPublishTime
    )
  })

  test.describe("cache data", () => {
    test("should use cached podcast episode values after page refresh of first successful request", async ({
      podcastDetailPage,
      headless,
    }) => {
      test.skip(headless, "Remove failing CI test in headless mode")
      test.slow()
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      let shouldFetchData = true
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = shouldFetchData ? defaultTenPodcastEpisodes : []
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        defaultTenPodcastEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        defaultTenPodcastEpisodes
      )
      await podcastDetailPage.getPage().waitForLoadState("networkidle")
      shouldFetchData = false
      await podcastDetailPage.getPage().reload()
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        defaultTenPodcastEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        defaultTenPodcastEpisodes
      )
    })
  })

  test.describe("data fetch failed", () => {
    test("should display podcast detail page refresh episode button on data fetch error", async ({
      podcastDetailPage,
    }) => {
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = []
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      await expect(
        podcastDetailPage
          .getPage()
          .getByText("Could not get podcast episodes. Please try again later")
      ).toBeVisible()
      await expect(
        podcastDetailPage.getRefreshPodcastEpisodeButton()
      ).toBeVisible()
    })

    test("should fetch podcast episode on refresh button click", async ({
      browser,
      headless,
    }) => {
      test.skip(headless, "Skip flaky headless test")
      test.slow()
      const context = await browser.newContext()
      const page = await context.newPage()
      const podcastDetailPage = new PodcastDetailPage(page)
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      let shouldFetchData = false
      await podcastDetailPage
        .getPage()
        .route(
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
      await podcastDetailPage
        .getPage()
        .route("*/**/auth/session/refresh", async (route) => {
          const json = []
          await route.fulfill({ json })
        })
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      await expect(
        podcastDetailPage
          .getPage()
          .getByText("Could not get podcast episodes. Please try again later")
      ).toBeVisible()

      await podcastDetailPage.getPage().waitForLoadState("networkidle")
      shouldFetchData = true
      await podcastDetailPage.getRefreshPodcastEpisodeButton().click()
      await podcastDetailPage.getPage().waitForTimeout(1000)
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        defaultTenPodcastEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        defaultTenPodcastEpisodes
      )
      await context.close()
    })
  })

  test.describe("episode duration", () => {
    test("should display duration of episode in hours and minutes", async ({
      podcastDetailPage,
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
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = mockDurationPodcastEpisodes
            await route.fulfill({ json })
          }
        )
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      for (
        let i = 0;
        i < mockDurationPodcastEpisodes.data.episodes.length;
        i++
      ) {
        const episode = mockDurationPodcastEpisodes.data.episodes[i]
        const expectedDuration = getExpectedEpisodeDuration(
          episode.durationInSeconds
        )

        const artwork = podcastDetailPage.getPodcastEpisodeCardArtwork(
          episode.title
        )
        const duration = podcastDetailPage.getPodcastEpisodeCardDuration(
          episode.title,
          expectedDuration
        )
        await scrollUntilElementIsVisible(
          podcastDetailPage.getPage(),
          artwork,
          getVirtualizedListParentElement(podcastDetailPage.getPage())
        )
        await expect(
          duration,
          `(Episode ${i + 1}) podcast episode card Duration should be present`
        ).toBeVisible()
      }
    })
  })

  test("should allow podcasts breadcrumb link click to navigate back to /podcasts homepage", async ({
    podcastDetailPage,
  }) => {
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = defaultTenPodcastEpisodes
          await route.fulfill({ json })
        }
      )
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /Batman University - xtal - podcasts/
    )
    await assertPodcastInfo(
      podcastDetailPage.getPage(),
      defaultTenPodcastEpisodes.data.podcast
    )
    await expect(podcastDetailPage.getBreadcrumbPodcastPageLink()).toBeVisible()
    await podcastDetailPage.getBreadcrumbPodcastPageLink().click()
    await expect(podcastDetailPage.getPage()).toHaveTitle("xtal - podcasts")
    await expect(podcastDetailPage.getPage()).toHaveURL(podcastHomePageUrl())
  })

  test("should display error toast for rate limit exceeded", async ({
    podcastDetailPage,
  }) => {
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await podcastDetailPage
      .getPage()
      .route(
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
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /Batman University - xtal - podcasts/
    )
    await assertToastMessage(
      podcastDetailPage.getPage(),
      "Rate Limit Exceeded, please try again later",
      2 // react strict mode calls endpoint twice
    )
  })

  test("should display generic error toast for server HTTP 404 error", async ({
    podcastDetailPage,
  }) => {
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          await route.fulfill({
            status: 404,
          })
        }
      )
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /Batman University - xtal - podcasts/
    )
    await assertToastMessage(
      podcastDetailPage.getPage(),
      "Could not retrieve podcast episodes. Please try again later",
      2 // react strict mode calls endpoint twice
    )
  })
})
