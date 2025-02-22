import test, { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import { assertToastMessage, HOMEPAGE } from "../constants/homepageConstants"
import { defaultTenPodcastEpisodes } from "../mocks/podcast.episode"
import { Podcast } from "../../src/api/podcast/model/podcast"

dayjs.extend(duration)

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  function getPodcastInfoElement(page: Page, text: string) {
    return page.locator(".podcast-info-container").getByText(text, {
      exact: true,
    })
  }
  function getExpectedEpisodeDuration(durationInSeconds: number) {
    const expectedHours = Math.floor(durationInSeconds / 3600)
    const expectedMins =
      expectedHours === 0
        ? Math.floor(durationInSeconds / 60)
        : Math.floor((durationInSeconds - expectedHours * 3600) / 60)
    const expectedDuration =
      expectedHours === 0
        ? `${expectedMins} min`
        : `${expectedHours} hr ${expectedMins} min`
    return expectedDuration
  }

  async function assertPodcastInfo(page: Page, expectedPodcast: Podcast) {
    await expect(
      page.locator(".podcast-info-container").getByRole("img", {
        name: expectedPodcast.title + " podcast image",
        exact: true,
      }),
      "Podcast Info Artwork should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(page, expectedPodcast.title),
      "Podcast Info Title should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(page, expectedPodcast.author),
      "Podcast Info Author should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(page, expectedPodcast.language),
      "Podcast Info Language should be present"
    ).toBeVisible()
    await expect(
      getPodcastInfoElement(
        page,
        expectedPodcast.episodeCount
          ? `${expectedPodcast.episodeCount} episodes`
          : "0 episodes"
      ),
      "Podcast Info Episode Count should be present"
    ).toBeVisible()
    for (const category of expectedPodcast.categories) {
      await expect(
        getPodcastInfoElement(page, category),
        `Podcast Info Category '${category}' should be present`
      ).toBeVisible()
    }
  }

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

    for (let i = 0; i < defaultTenPodcastEpisodes.count; i++) {
      const episode = defaultTenPodcastEpisodes.data.episodes[i]
      const expectedEpisodeDuration = getExpectedEpisodeDuration(
        episode.durationInSeconds
      )
      const expectedDate = dayjs
        .unix(episode.datePublished)
        .format("MMMM D, YYYY")
      const expectedArtworkSize = "144"
      const artwork = page.locator(".podcast-episode-card").getByRole("img", {
        name: episode.title + " podcast image",
        exact: true,
      })
      await expect(
        artwork,
        `(Episode ${i + 1}) podcast episode card Artwork should be present`
      ).toBeVisible()
      expect(
        await artwork.getAttribute("width"),
        `(Episode ${
          i + 1
        }) podcast episode card should have artwork image width of ${expectedArtworkSize}`
      ).toBe(expectedArtworkSize)
      await expect(
        page
          .locator(".podcast-episode-card .podcast-episode-card-title")
          .getByText(episode.title, { exact: true }),
        `(Episode ${i + 1}) podcast episode card Title should be present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-card")
          .getByText(expectedDate, { exact: true }),
        `(Episode ${i + 1}) podcast episode card Episode Date should be present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-card")
          .getByText(`Episode ${episode.episodeNumber}`, { exact: true }),
        `(Episode ${
          i + 1
        }) podcast episode card Episode Number should be present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-episode-card")
          .nth(i)
          .getByText(expectedEpisodeDuration, { exact: true }),
        `(Episode ${
          i + 1
        }) podcast episode card Duration in Minutes should be present`
      ).toBeVisible()
      // ensure description has no duplicates - remove all empty lines "" and newlines ("\n")
      const descriptions = (
        await page
          .locator(".podcast-episode-card .podcast-episode-card-description")
          .nth(i)
          .allInnerTexts()
      )
        .join("")
        .split("\n")
        .filter((line) => line.trim() !== "")
      expect(
        new Set(descriptions).size,
        `(Episode ${
          i + 1
        }) podcast episode card Description should not be duplicated due to React Strict Mode`
      ).toBe(descriptions.length)
      await expect(
        page
          .locator(".podcast-episode-card .podcast-episode-card-play-button")
          .nth(i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
    }
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
        "should have <audio> autoplay with podcast episode"
      ).toHaveAttribute("autoplay")
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

    test("should still display currently playing podcast after clicking back button to podcast homepage", async ({
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
      await page.locator(".podcast-detail-back-button").click()
      await expect(page).toHaveTitle("xtal - podcasts")
      await assertPodcastPlayerHasEpisode(
        page,
        expectedEpisode,
        expectedArtworkSize
      )
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
  })

  test("should allow back button click to navigate back to /podcasts homepage", async ({
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
    await expect(page.locator(".podcast-detail-back-button")).toBeVisible()
    await page.locator(".podcast-detail-back-button").click()
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
      "Rate Limit Exceeded, please try again after 2 seconds"
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
      "Could not retrieve podcast episodes. Please try again later"
    )
  })
})
