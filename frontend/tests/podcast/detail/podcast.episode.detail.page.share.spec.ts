import test, { expect, Page } from "@playwright/test"
import { podcastId_259760_episodeId_34000697601 } from "../../mocks/podcast.episode"
import { assertToastMessage, HOMEPAGE } from "../../constants/homepageConstants"
import { getClipboardContent } from "../../constants/shareStationConstants"
import {
  getPodcastEpisodeCloseDialogButton,
  getPodcastEpisodeCopyLinkButton,
  getPodcastEpisodeShareButton,
  getPodcastEpisodeDialogTimestampInput,
  getPodcastEpisodePlayButton,
  getPodcastEpisodeShareDialog,
} from "../../constants/podcast/share/podcastEpisodeShareConstants"

test.describe("Share Feature of Podcast Episode Detail Page for viewing single podcast episode /podcasts/PODCAST-TITLE/PODCAST-ID/PODCAST-EPISODE-ID", () => {
  async function assertPodcastPlayerCurrentTime(
    page: Page,
    isMobile: boolean,
    expectedCurrentTime: number
  ) {
    await expect(
      page.locator("media-controller"),
      "Podcast Player should not be in mediapaused state"
    ).not.toHaveAttribute("mediapaused")
    const playerTimeElement = page.getByTestId(
      `audio-player-${isMobile ? "mobile" : "desktop"}-time-display-button`
    )
    await expect(playerTimeElement).toBeVisible()
    expect(
      Math.floor(
        Number(await playerTimeElement.getAttribute("mediacurrenttime"))
      )
    ).toBeGreaterThanOrEqual(expectedCurrentTime)
  }

  test("should open share episode dialog when share button is clicked", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(getPodcastEpisodeShareButton(page)).toBeVisible()
    await getPodcastEpisodeShareButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()
  })

  test("should close share episode dialog on click outside dialog", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(getPodcastEpisodeShareButton(page)).toBeVisible()
    await getPodcastEpisodeShareButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()
    // click outside modal
    await page.locator("body").click({ position: { x: 1, y: 1 } })
    await expect(getPodcastEpisodeShareDialog(page)).not.toBeVisible()
  })

  test("should close share episode dialog on dialog close button click", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(getPodcastEpisodeShareButton(page)).toBeVisible()
    await getPodcastEpisodeShareButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()
    await expect(getPodcastEpisodeCloseDialogButton(page)).toBeVisible()
    await getPodcastEpisodeCloseDialogButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).not.toBeVisible()
  })

  test("should copy podcast episode detail page url using copy button on share podcast episode dialog", async ({
    page,
  }) => {
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    const expectedPodcastEpisodeUrl =
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(getPodcastEpisodeShareButton(page)).toBeVisible()
    await getPodcastEpisodeShareButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()
    await expect(getPodcastEpisodeCopyLinkButton(page)).toBeVisible()
    await getPodcastEpisodeCopyLinkButton(page).click()
    expect(await getClipboardContent(page)).toBe(expectedPodcastEpisodeUrl)
    await assertToastMessage(page, "Link Copied")
  })

  test("should allow user to copy share podcast episode link at specific timestamp", async ({
    page,
  }) => {
    const expectedStartDurationInSeconds = "50"
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    const expectedPodcastEpisodeUrl =
      HOMEPAGE +
      `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}?t=${expectedStartDurationInSeconds}`
    await page.goto(
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    )
    await expect(getPodcastEpisodeShareButton(page)).toBeVisible()
    await getPodcastEpisodeShareButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()

    await expect(getPodcastEpisodeDialogTimestampInput(page)).toBeVisible()
    await getPodcastEpisodeDialogTimestampInput(page).fill(
      expectedStartDurationInSeconds
    )
    await getPodcastEpisodeCopyLinkButton(page).click()
    expect(await getClipboardContent(page)).toBe(expectedPodcastEpisodeUrl)
    await assertToastMessage(page, "Link Copied")
  })

  test("should start podcast episode playback with url parameter ?t=", async ({
    page,
    isMobile,
    headless,
  }) => {
    test.skip(
      headless,
      "Skip test in headless mode due to decode error on media playback on headless mode in CI environment"
    )
    const expectedStartDurationInSeconds = "50"
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    const podcastEpisodeUrl =
      HOMEPAGE +
      `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}?t=${expectedStartDurationInSeconds}`
    await page.goto(podcastEpisodeUrl)
    await expect(getPodcastEpisodePlayButton(page)).toBeVisible()
    await getPodcastEpisodePlayButton(page).click()
    await expect(getPodcastEpisodePlayButton(page)).toBeVisible()
    await assertPodcastPlayerCurrentTime(
      page,
      isMobile,
      Number(expectedStartDurationInSeconds)
    )
  })

  test("should ignore start podcast playback and start from zero seconds if url parameter (?t=) is greater than podcast episode duration", async ({
    page,
    isMobile,
    headless,
  }) => {
    test.skip(
      headless,
      "Skip test in headless mode due to decode error on media playback on headless mode in CI environment"
    )
    const invalidStartDurationInSeconds =
      podcastId_259760_episodeId_34000697601.data.durationInSeconds + 1
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    const podcastEpisodeUrl =
      HOMEPAGE +
      `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}?t=${invalidStartDurationInSeconds}`
    await page.goto(podcastEpisodeUrl)
    await expect(getPodcastEpisodePlayButton(page)).toBeVisible()
    await getPodcastEpisodePlayButton(page).click()
    await expect(getPodcastEpisodePlayButton(page)).toBeVisible()
    await assertPodcastPlayerCurrentTime(page, isMobile, 0)
  })

  test("should ignore negative start time url parameter (?t=) and start playback from zero seconds", async ({
    page,
    isMobile,
    headless,
  }) => {
    test.skip(
      headless,
      "Skip test in headless mode due to decode error on media playback on headless mode in CI environment"
    )
    const invalidStartDurationInSeconds = "-1"
    const podcastTitle = encodeURIComponent("Infinite Loops")
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await page.route(
      `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
      async (route) => {
        const json = podcastId_259760_episodeId_34000697601
        await route.fulfill({ json })
      }
    )
    const podcastEpisodeUrl =
      HOMEPAGE +
      `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}?t=${invalidStartDurationInSeconds}`
    await page.goto(podcastEpisodeUrl)
    await expect(getPodcastEpisodePlayButton(page)).toBeVisible()
    await getPodcastEpisodePlayButton(page).click()
    await expect(getPodcastEpisodePlayButton(page)).toBeVisible()
    await assertPodcastPlayerCurrentTime(page, isMobile, 0)
  })
})
