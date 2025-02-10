import test, { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import { getToastMessages, HOMEPAGE } from "../constants/homepageConstants"
import { defaultTenPodcastEpisodes } from "../mocks/podcast.episode"
import { Podcast } from "../../src/api/podcast/model/podcast"

test.describe("Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  function getPodcastInfoElement(page: Page, text: string) {
    return page.locator(".podcast-info-container").getByText(text, {
      exact: true,
    })
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
        `should have podcast artwork image width of ${expectedArtworkSize}`
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
          .getByText(expectedDate, { exact: true })
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
          .locator(".podcast-episode-card .podcast-episode-play-button")
          .nth(i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
    }
  })

  test.describe("podcast episode player", () => {
    function getEpisodePlayButton(page: Page, index: number) {
      return page
        .locator(".podcast-episode-card .podcast-episode-play-button")
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
    const toastMessages = await getToastMessages(page)
    expect(
      toastMessages,
      "should have rate limit exceeded error toast message"
    ).toEqual(
      expect.arrayContaining([
        "Rate Limit Exceeded, please try again after 2 seconds",
      ])
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
    const toastMessages = await getToastMessages(page)
    expect(toastMessages, "should have server error toast message").toEqual(
      expect.arrayContaining([
        "Could not retrieve podcast episodes. Please try again later",
      ])
    )
  })
})
