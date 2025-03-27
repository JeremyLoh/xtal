import test, { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import {
  assertToastMessage,
  HOMEPAGE,
} from "../../constants/homepageConstants.ts"
import {
  defaultTenPodcastEpisodes,
  podcastId_259760_episodeId_34000697601,
  podcastId_259760_FirstTenEpisodes,
  podcastTitleHasPercentSymbol_podcastId_387129_FirstTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants.ts"
import {
  assertPodcastEpisodes,
  assertPodcastInfo,
  getExpectedEpisodeDuration,
} from "../../constants/podcast/detail/podcastDetailConstants.ts"

dayjs.extend(duration)

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test("should display podcast detail page", async ({ page }) => {
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
    test("should navigate to podcast episode detail page on click of episode title", async ({
      page,
    }) => {
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
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)

      const expectedEpisodeTitle =
        podcastId_259760_episodeId_34000697601.data.title
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
        page.getByText("Podcast episode data is not available")
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
      page,
    }) => {
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
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await assertLoadingSpinnerIsMissing(page)
      await expect(getPodcastEpisodeRefreshButton(page)).toBeVisible()
      shouldFetchData = true
      await getPodcastEpisodeRefreshButton(page).click()
      await assertPodcastInfo(page, defaultTenPodcastEpisodes.data.podcast)
      await assertPodcastEpisodes(page, defaultTenPodcastEpisodes)
    })
  })

  test.describe("episode duration", () => {
    test("should display duration of episode in hours and minutes", async ({
      page,
    }) => {
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
        await expect(
          page
            .locator(".podcast-episode-card")
            .nth(i)
            .getByText(expectedDuration, { exact: true }),
          `(Episode ${i + 1}) podcast episode card Duration should be present`
        ).toBeVisible()
      }
    })
  })

  test.describe("podcast episode player", () => {
    function getEpisodePlayButton(page: Page, index: number) {
      return page
        .locator(".podcast-episode-card .podcast-episode-card-play-button")
        .nth(index)
    }
    async function assertEpisodePlayerHasText(
      page: Page,
      expectedText: string
    ) {
      await expect(
        page.locator(".audio-player").getByText(expectedText, {
          exact: true,
        })
      ).toBeVisible()
    }
    async function assertPodcastPlayerHasEpisode(
      page: Page,
      expectedEpisode,
      expectedArtworkSize: string
    ) {
      await expect(
        page.locator(".audio-player audio"),
        "should have <audio> loaded with podcast episode"
      ).toHaveAttribute("src", expectedEpisode.contentUrl)
      await expect(
        page.locator(".audio-player audio"),
        "should not have <audio> autoplay with podcast episode"
      ).not.toHaveAttribute("autoplay")
      const artwork = page.locator(".audio-player").getByRole("img", {
        name: expectedEpisode.title + " podcast image",
        exact: true,
      })
      await expect(artwork).toBeVisible()
      expect(
        await artwork.getAttribute("width"),
        `should have podcast artwork image width of ${expectedArtworkSize}`
      ).toBe(expectedArtworkSize)
      await assertEpisodePlayerHasText(page, expectedEpisode.title)
      await assertEpisodePlayerHasText(
        page,
        `Episode ${expectedEpisode.episodeNumber}`
      )
      const expectedDateFormat = dayjs
        .unix(expectedEpisode.datePublished)
        .format("MMMM D, YYYY")
      await assertEpisodePlayerHasText(page, expectedDateFormat)
    }

    test("should still display currently playing podcast after clicking podcast breadcrumb link to podcast homepage", async ({
      page,
    }) => {
      const i = 2
      const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
      const expectedArtworkSize = "96"
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
      await getEpisodePlayButton(page, i).click()
      await page.getByTestId("podcast-detail-page-podcasts-link").click()
      await expect(page).toHaveTitle("xtal - podcasts")
      await assertPodcastPlayerHasEpisode(
        page,
        expectedEpisode,
        expectedArtworkSize
      )
    })

    test("should have lazy loaded podcast image from third episode image onwards", async ({
      page,
    }) => {
      const lazyLoadedImageStartIndex = 2 // zero based index
      const episodeCount = defaultTenPodcastEpisodes.data.episodes.length
      expect(
        episodeCount,
        "should have episode count greater than lazyLoadedImageStartIndex"
      ).toBeGreaterThanOrEqual(lazyLoadedImageStartIndex + 1)

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
      for (let i = 0; i < episodeCount; i++) {
        const episode = defaultTenPodcastEpisodes.data.episodes[i]
        const artwork = page.locator(".podcast-episode-card").getByRole("img", {
          name: episode.title + " podcast image",
          exact: true,
        })
        if (i < lazyLoadedImageStartIndex) {
          await expect(
            artwork,
            `Artwork ${i + 1} should not have <img> loading='lazy' attribute`
          ).not.toHaveAttribute("loading", "lazy")
        } else {
          await expect(
            artwork,
            `Artwork ${i + 1} should have <img> loading='lazy' attribute`
          ).toHaveAttribute("loading", "lazy")
        }
      }
    })

    test("should play podcast episode when podcast episode card play button is clicked", async ({
      page,
    }) => {
      const i = 0
      const expectedArtworkSize = "96"
      const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
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
      await expect(
        getEpisodePlayButton(page, i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
      await getEpisodePlayButton(page, i).click()

      await assertPodcastPlayerHasEpisode(
        page,
        expectedEpisode,
        expectedArtworkSize
      )
    })

    test("should redirect to podcast episode detail page on click of episode title in podcast player", async ({
      page,
    }) => {
      const i = 0
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
      await expect(
        getEpisodePlayButton(page, i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
      await getEpisodePlayButton(page, i).click()
      const expectedPodcastEpisodeId =
        defaultTenPodcastEpisodes.data.episodes[i].id
      const expectedEpisodeTitle =
        defaultTenPodcastEpisodes.data.episodes[i].title
      await page
        .locator(".audio-player")
        .getByRole("link", { name: expectedEpisodeTitle, exact: true })
        .click()
      expect(page.url()).toBe(
        HOMEPAGE +
          `/podcasts/${podcastTitle}/${podcastId}/${expectedPodcastEpisodeId}`
      )
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
      "Rate Limit Exceeded, please try again later",
      2
    )
  })

  test("should generic error toast for server HTTP 404 error", async ({
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
      "Could not retrieve podcast episodes. Please try again later",
      2
    )
  })
})
