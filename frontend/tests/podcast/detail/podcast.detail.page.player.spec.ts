import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import test, { expect, Page } from "@playwright/test"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { HOMEPAGE } from "../../constants/homepageConstants"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../constants/scroller/scrollerConstants"

dayjs.extend(duration)

test.describe("Podcast detail page for individual podcast", () => {
  test.describe("podcast episode player", () => {
    function getEpisodePlayButton(page: Page, index: number) {
      return page
        .locator(".podcast-episode-card .podcast-episode-card-play-button")
        .nth(index)
    }

    function getEpisodeDatePublished(unixSecondsDatePublished: number) {
      return dayjs.unix(unixSecondsDatePublished).format("MMMM D, YYYY")
    }

    function getMinimizePlayerButton(page: Page) {
      return page.locator(
        ".audio-player .podcast-play-episode-minimize-player-button"
      )
    }

    function getExpandPlayerButton(page: Page) {
      return page.locator(
        ".audio-player .podcast-play-episode-expand-player-button"
      )
    }

    async function assertEpisodePlayerDoesNotHaveText(
      page: Page,
      text: string
    ) {
      await expect(
        page.locator(".audio-player").getByText(text, {
          exact: true,
        })
      ).not.toBeVisible()
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
      const expectedDateFormat = getEpisodeDatePublished(
        expectedEpisode.datePublished
      )
      await assertEpisodePlayerHasText(page, expectedDateFormat)
    }

    test.describe("minimize and expand podcast player", () => {
      test("should minimize podcast player episode when minimize podcast player button is clicked", async ({
        page,
      }) => {
        test.slow()
        const i = 0
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
          `(Episode ${
            i + 1
          }) podcast episode card Play button should be present`
        ).toBeVisible()
        await getEpisodePlayButton(page, i).click()
        await expect(
          page.locator(".audio-player audio"),
          "should have <audio> loaded with podcast episode"
        ).toHaveAttribute("src", expectedEpisode.contentUrl)
        const artwork = page.locator(".audio-player").getByRole("img", {
          name: expectedEpisode.title + " podcast image",
          exact: true,
        })
        await expect(artwork).toBeVisible()
        await expect(getExpandPlayerButton(page)).not.toBeVisible()
        await expect(getMinimizePlayerButton(page)).toBeVisible()
        await getMinimizePlayerButton(page).click()
        await expect(artwork).not.toBeVisible()
        const episodeDatePublishedText = getEpisodeDatePublished(
          expectedEpisode.datePublished
        )
        await assertEpisodePlayerDoesNotHaveText(page, episodeDatePublishedText)
        await assertEpisodePlayerDoesNotHaveText(
          page,
          `Episode ${expectedEpisode.episodeNumber}`
        )
      })

      test("should maximize podcast player when user clicks on maximize podcast player button", async ({
        page,
      }) => {
        test.slow()
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
          `(Episode ${
            i + 1
          }) podcast episode card Play button should be present`
        ).toBeVisible()
        await getEpisodePlayButton(page, i).click()
        const artwork = page.locator(".audio-player").getByRole("img", {
          name: expectedEpisode.title + " podcast image",
          exact: true,
        })
        await expect(artwork).toBeVisible()
        await expect(getMinimizePlayerButton(page)).toBeVisible()
        await getMinimizePlayerButton(page).click()
        await expect(artwork).not.toBeVisible()
        await expect(getMinimizePlayerButton(page)).not.toBeVisible()
        await expect(getExpandPlayerButton(page)).toBeVisible()

        await getExpandPlayerButton(page).click()
        await assertPodcastPlayerHasEpisode(
          page,
          expectedEpisode,
          expectedArtworkSize
        )
      })
    })

    test("should still display currently playing podcast after clicking podcast breadcrumb link to podcast homepage", async ({
      page,
    }) => {
      test.slow()
      // podcast episodes are rendered in virtualized list, use first visible podcast episode card element
      const i = 0
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
      test.slow()
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
        await scrollUntilElementIsVisible(
          page,
          artwork,
          getVirtualizedListParentElement(page)
        )
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
      test.slow()
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
})
