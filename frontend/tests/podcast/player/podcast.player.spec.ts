import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"

test.describe("podcast audio player", () => {
  async function assertMobilePlayerIsVisible(page: Page) {
    await expect(
      page.getByTestId("audio-player-mobile-play-button"),
      "should display mobile play button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-mobile-seek-backward-button"),
      "should display mobile seek backward button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-mobile-playback-rate-button"),
      "should display mobile playback rate button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-mobile-time-display-button"),
      "should display mobile time display button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-mobile-mute-button"),
      "should display mobile mute button"
    ).toBeVisible()

    await assertLoadingSpinnerIsMissing(page)
  }

  async function assertDesktopPlayerIsVisible(page: Page) {
    await expect(
      page.getByTestId("audio-player-desktop-play-button"),
      "should display desktop play button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-seek-backward-button"),
      "should display desktop seek backward button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-seek-forward-button"),
      "should display desktop seek forward button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-time-range-button"),
      "should display desktop time range button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-time-display-button"),
      "should display desktop time display button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-playback-rate-button"),
      "should display desktop playback rate button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-mute-button"),
      "should display desktop mute button"
    ).toBeVisible()
    await expect(
      page.getByTestId("audio-player-desktop-volume-range-button"),
      "should display desktop volume range button"
    ).toBeVisible()

    await assertLoadingSpinnerIsMissing(page)
  }

  test.describe("podcast homepage (/podcasts)", () => {
    test("should display audio player on mobile view", async ({
      page,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip(!isMobile)
        return
      }
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-player")).toBeVisible()
      await assertMobilePlayerIsVisible(page)
    })

    test("should display audio player on desktop view", async ({
      page,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-player")).toBeVisible()
      await assertDesktopPlayerIsVisible(page)
    })
  })

  test.describe("podcast detail page", () => {
    test("should display audio player on mobile view", async ({
      page,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip(!isMobile)
        return
      }
      const podcastTitle = "testTitle"
      const podcastId = "12"
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page.locator(".podcast-player")).toBeVisible()
      await assertMobilePlayerIsVisible(page)
    })

    test("should display audio player on desktop view", async ({
      page,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      const podcastTitle = "testTitle"
      const podcastId = "12"
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page.locator(".podcast-player")).toBeVisible()
      await assertDesktopPlayerIsVisible(page)
    })
  })

  test.describe("podcast home page", () => {
    test("should display audio player on mobile view", async ({
      page,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip(!isMobile)
        return
      }
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-player")).toBeVisible()
      await assertMobilePlayerIsVisible(page)
    })

    test("should display audio player on desktop view", async ({
      page,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      await page.goto(HOMEPAGE + "/podcasts/")
      await expect(page.locator(".podcast-player")).toBeVisible()
      await assertDesktopPlayerIsVisible(page)
    })
  })
})
