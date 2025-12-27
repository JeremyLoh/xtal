import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../constants/scroller/scrollerConstants"
import PodcastDetailPage from "../../pageObjects/PodcastDetailPage"

dayjs.extend(duration)

function getEpisodeDatePublished(unixSecondsDatePublished: number) {
  return dayjs.unix(unixSecondsDatePublished).format("MMMM D, YYYY")
}

async function assertEpisodePlayerHasText(
  podcastDetailPage: PodcastDetailPage,
  expectedText: string
) {
  await expect(
    podcastDetailPage.getPodcastPlayer().getByText(expectedText, {
      exact: true,
    })
  ).toBeVisible()
}

async function assertPodcastPlayerHasEpisode(
  podcastDetailPage: PodcastDetailPage,
  expectedEpisode,
  expectedArtworkSize: string
) {
  await expect(
    podcastDetailPage.getPodcastPlayerAudio(),
    "should have <audio> loaded with podcast episode"
  ).toHaveAttribute("src", expectedEpisode.contentUrl)
  await expect(
    podcastDetailPage.getPodcastPlayerAudio(),
    "should not have <audio> autoplay with podcast episode"
  ).not.toHaveAttribute("autoplay")
  const artwork = podcastDetailPage.getPodcastPlayerArtwork(
    expectedEpisode.title
  )
  await expect(artwork).toBeVisible()
  expect(
    await artwork.getAttribute("width"),
    `should have podcast artwork image width of ${expectedArtworkSize}`
  ).toBe(expectedArtworkSize)

  await assertEpisodePlayerHasText(podcastDetailPage, expectedEpisode.title)
  await assertEpisodePlayerHasText(
    podcastDetailPage,
    `Episode ${expectedEpisode.episodeNumber}`
  )
  const expectedDateFormat = getEpisodeDatePublished(
    expectedEpisode.datePublished
  )
  await assertEpisodePlayerHasText(podcastDetailPage, expectedDateFormat)
}

test.describe("Podcast detail page for individual podcast", () => {
  test.describe("podcast episode player", () => {
    test.describe("minimize and expand podcast player", () => {
      test("should minimize podcast player episode when minimize podcast player button is clicked", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        const i = 0
        const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
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
        await expect(
          podcastDetailPage.getPodcastEpisodePlayButton(i),
          `(Episode ${
            i + 1
          }) podcast episode card Play button should be present`
        ).toBeVisible()
        await podcastDetailPage.getPodcastEpisodePlayButton(i).click()
        await expect(
          podcastDetailPage.getPodcastPlayerAudio(),
          "should have <audio> loaded with podcast episode"
        ).toHaveAttribute("src", expectedEpisode.contentUrl)
        const artwork = podcastDetailPage.getPodcastPlayerArtwork(
          expectedEpisode.title
        )
        await expect(artwork).toBeVisible()
        await expect(
          podcastDetailPage.getPodcastPlayerExpandPlayerButton()
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getPodcastPlayerMinimizePlayerButton()
        ).toBeVisible()
        await podcastDetailPage.getPodcastPlayerMinimizePlayerButton().click()
        await expect(artwork).not.toBeVisible()
        const episodeDatePublishedText = getEpisodeDatePublished(
          expectedEpisode.datePublished
        )
        await expect(
          podcastDetailPage
            .getPodcastPlayer()
            .getByText(episodeDatePublishedText, { exact: true })
        ).not.toBeVisible()

        await expect(
          podcastDetailPage
            .getPodcastPlayer()
            .getByText(`Episode ${expectedEpisode.episodeNumber}`, {
              exact: true,
            })
        ).not.toBeVisible()
      })

      test("should maximize podcast player when user clicks on maximize podcast player button", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        const i = 0
        const expectedArtworkSize = "96"
        const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
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
        await expect(
          podcastDetailPage.getPodcastEpisodePlayButton(i),
          `(Episode ${
            i + 1
          }) podcast episode card Play button should be present`
        ).toBeVisible()
        await podcastDetailPage.getPodcastEpisodePlayButton(i).click()
        const artwork = podcastDetailPage.getPodcastPlayerArtwork(
          expectedEpisode.title
        )
        await expect(artwork).toBeVisible()
        await expect(
          podcastDetailPage.getPodcastPlayerMinimizePlayerButton()
        ).toBeVisible()
        await podcastDetailPage.getPodcastPlayerMinimizePlayerButton().click()
        await expect(artwork).not.toBeVisible()
        await expect(
          podcastDetailPage.getPodcastPlayerMinimizePlayerButton()
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getPodcastPlayerExpandPlayerButton()
        ).toBeVisible()

        await podcastDetailPage.getPodcastPlayerExpandPlayerButton().click()
        await assertPodcastPlayerHasEpisode(
          podcastDetailPage,
          expectedEpisode,
          expectedArtworkSize
        )
      })
    })

    test("should still display currently playing podcast after clicking podcast breadcrumb link to podcast homepage", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      // podcast episodes are rendered in virtualized list, use first visible podcast episode card element
      const i = 0
      const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
      const expectedArtworkSize = "96"
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
      await podcastDetailPage.getPodcastEpisodePlayButton(i).click()
      await podcastDetailPage.getBreadcrumbPodcastPageLink().click()
      await expect(podcastDetailPage.getPage()).toHaveTitle("xtal - podcasts")
      await assertPodcastPlayerHasEpisode(
        podcastDetailPage,
        expectedEpisode,
        expectedArtworkSize
      )
    })

    test("should have lazy loaded podcast image from third episode image onwards", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const lazyLoadedImageStartIndex = 2 // zero based index
      const episodeCount = defaultTenPodcastEpisodes.data.episodes.length
      expect(
        episodeCount,
        "should have episode count greater than lazyLoadedImageStartIndex"
      ).toBeGreaterThanOrEqual(lazyLoadedImageStartIndex + 1)

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
      for (let i = 0; i < episodeCount; i++) {
        const episode = defaultTenPodcastEpisodes.data.episodes[i]
        const artwork = podcastDetailPage.getPodcastEpisodeCardArtwork(
          episode.title
        )
        await scrollUntilElementIsVisible(
          podcastDetailPage.getPage(),
          artwork,
          getVirtualizedListParentElement(podcastDetailPage.getPage())
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
      podcastDetailPage,
    }) => {
      test.slow()
      const i = 0
      const expectedArtworkSize = "96"
      const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
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
      await expect(
        podcastDetailPage.getPodcastEpisodePlayButton(i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
      await podcastDetailPage.getPodcastEpisodePlayButton(i).click()

      await assertPodcastPlayerHasEpisode(
        podcastDetailPage,
        expectedEpisode,
        expectedArtworkSize
      )
    })

    test("should set audio MediaSession metadata for currently playing media info when podcast is playing", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const i = 0
      const expectedArtworkSize = "96"
      const expectedEpisode = defaultTenPodcastEpisodes.data.episodes[i]
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
      await expect(
        podcastDetailPage.getPodcastEpisodePlayButton(i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
      await podcastDetailPage.getPodcastEpisodePlayButton(i).click()
      await assertPodcastPlayerHasEpisode(
        podcastDetailPage,
        expectedEpisode,
        expectedArtworkSize
      )

      await podcastDetailPage.getPage().waitForFunction(() => {
        // wait for metadata to populate on podcast play
        const mediaSession = navigator.mediaSession
        if (!mediaSession || !mediaSession.metadata) {
          return undefined
        }
        return mediaSession.metadata
      })
      const audioMetadata =
        await podcastDetailPage.getPodcastPlayerAudioMetadata()
      expect(audioMetadata).toMatchObject({
        title: expectedEpisode.title,
        artist: podcastTitle,
        album: "Xtal Podcasts",
        // artwork is not tested currently, will be removed for artwork with non https urls
      })
    })

    test("should redirect to podcast episode detail page on click of episode title in podcast player", async ({
      podcastDetailPage,
    }) => {
      const i = 0
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
      await expect(
        podcastDetailPage.getPodcastEpisodePlayButton(i),
        `(Episode ${i + 1}) podcast episode card Play button should be present`
      ).toBeVisible()
      await podcastDetailPage.getPodcastEpisodePlayButton(i).click()
      const expectedPodcastEpisodeId =
        defaultTenPodcastEpisodes.data.episodes[i].id
      const expectedEpisodeTitle =
        defaultTenPodcastEpisodes.data.episodes[i].title
      await podcastDetailPage.getPodcastPlayerLink(expectedEpisodeTitle).click()
      expect(podcastDetailPage.getPage()).toHaveURL(
        new RegExp(
          `/podcasts/${encodeURIComponent(
            podcastTitle
          )}/${podcastId}/${expectedPodcastEpisodeId}` + "$"
        )
      )
    })
  })
})
