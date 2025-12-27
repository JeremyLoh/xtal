import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import PodcastHomePage from "../../pageObjects/PodcastHomePage"
import PodcastDetailPage from "../../pageObjects/PodcastDetailPage"

test.describe("podcast audio player", () => {
  async function assertMobilePlayerIsVisible(
    page: PodcastHomePage | PodcastDetailPage
  ) {
    const {
      playButton,
      seekBackwardButton,
      playbackRateButton,
      timeDisplayButton,
      muteButton,
    } = page.getMobilePodcastPlayerElements()
    await expect(playButton, "should display mobile play button").toBeVisible()
    await expect(
      seekBackwardButton,
      "should display mobile seek backward button"
    ).toBeVisible()
    await expect(
      playbackRateButton,
      "should display mobile playback rate button"
    ).toBeVisible()
    await expect(
      timeDisplayButton,
      "should display mobile time display button"
    ).toBeVisible()
    await expect(muteButton, "should display mobile mute button").toBeVisible()
  }

  async function assertDesktopPlayerIsVisible(
    page: PodcastHomePage | PodcastDetailPage
  ) {
    const {
      playButton,
      seekBackwardButton,
      seekForwardButton,
      playbackRateButton,
      timeDisplayButton,
      timeRangeButton,
      muteButton,
      volumeRangeButton,
    } = page.getDesktopPodcastPlayerElements()
    await expect(playButton, "should display desktop play button").toBeVisible()
    await expect(
      seekBackwardButton,
      "should display desktop seek backward button"
    ).toBeVisible()
    await expect(
      seekForwardButton,
      "should display desktop seek forward button"
    ).toBeVisible()
    await expect(
      timeRangeButton,
      "should display desktop time range button"
    ).toBeVisible()
    await expect(
      timeDisplayButton,
      "should display desktop time display button"
    ).toBeVisible()
    await expect(
      playbackRateButton,
      "should display desktop playback rate button"
    ).toBeVisible()
    await expect(muteButton, "should display desktop mute button").toBeVisible()
    await expect(
      volumeRangeButton,
      "should display desktop volume range button"
    ).toBeVisible()
  }

  test.describe("podcast homepage (/podcasts)", () => {
    test("should display audio player on mobile view", async ({
      podcastHomePage,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip(!isMobile)
        return
      }
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastPlayerContainer()).toBeVisible()
      await assertMobilePlayerIsVisible(podcastHomePage)
    })

    test("should display audio player on desktop view", async ({
      podcastHomePage,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastPlayerContainer()).toBeVisible()
      await assertDesktopPlayerIsVisible(podcastHomePage)
    })
  })

  test.describe("podcast detail page", () => {
    test("should display audio player on mobile view", async ({
      podcastDetailPage,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip(!isMobile)
        return
      }
      const podcastTitle = "testTitle"
      const podcastId = "12"
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPodcastPlayerContainer()).toBeVisible()
      await assertMobilePlayerIsVisible(podcastDetailPage)
    })

    test("should display audio player on desktop view", async ({
      podcastDetailPage,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      const podcastTitle = "testTitle"
      const podcastId = "12"
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPodcastPlayerContainer()).toBeVisible()
      await assertDesktopPlayerIsVisible(podcastDetailPage)
    })
  })

  test.describe("podcast home page", () => {
    test("should display audio player on mobile view", async ({
      podcastHomePage,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip(!isMobile)
        return
      }
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastPlayerContainer()).toBeVisible()
      await assertMobilePlayerIsVisible(podcastHomePage)
    })

    test("should display audio player on desktop view", async ({
      podcastHomePage,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPodcastPlayerContainer()).toBeVisible()
      await assertDesktopPlayerIsVisible(podcastHomePage)
    })
  })
})
