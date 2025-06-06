import { test } from "../../fixture/test"
import { expect, Page } from "@playwright/test"
import { podcastId_259760_episodeId_34000697601 } from "../../mocks/podcast.episode"
import { assertToastMessage } from "../../constants/toasterConstants"
import { getClipboardContent } from "../../constants/shareStationConstants"
import { homePageUrl } from "../../constants/paths"

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
    podcastEpisodeDetailPage,
  }) => {
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    await expect(podcastEpisodeDetailPage.getEpisodeShareButton()).toBeVisible()
    await podcastEpisodeDetailPage.getEpisodeShareButton().click()
    await expect(podcastEpisodeDetailPage.getEpisodeShareDialog()).toBeVisible()
  })

  test("should close share episode dialog on click outside dialog", async ({
    podcastEpisodeDetailPage,
  }) => {
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    const shareButton = podcastEpisodeDetailPage.getEpisodeShareButton()
    await expect(shareButton).toBeVisible()
    await shareButton.click()

    const shareDialog = podcastEpisodeDetailPage.getEpisodeShareDialog()
    await expect(shareDialog).toBeVisible()
    // click outside modal
    await podcastEpisodeDetailPage
      .getPage()
      .locator("body")
      .click({ position: { x: 1, y: 1 } })
    await expect(shareDialog).not.toBeVisible()
  })

  test("should close share episode dialog on dialog close button click", async ({
    podcastEpisodeDetailPage,
  }) => {
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    const shareButton = podcastEpisodeDetailPage.getEpisodeShareButton()
    await expect(shareButton).toBeVisible()
    await shareButton.click()

    const shareDialog = podcastEpisodeDetailPage.getEpisodeShareDialog()
    const closeDialogButton =
      podcastEpisodeDetailPage.getEpisodeCloseDialogButton()
    await expect(shareDialog).toBeVisible()
    await expect(closeDialogButton).toBeVisible()
    await closeDialogButton.click()
    await expect(shareDialog).not.toBeVisible()
  })

  test("should copy podcast episode detail page url using copy button on share podcast episode dialog", async ({
    podcastEpisodeDetailPage,
  }) => {
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    const expectedPodcastEpisodeUrl =
      homePageUrl() +
      `/podcasts/${encodeURIComponent(
        podcastTitle
      )}/${podcastId}/${podcastEpisodeId}`
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    const shareButton = podcastEpisodeDetailPage.getEpisodeShareButton()
    const shareDialog = podcastEpisodeDetailPage.getEpisodeShareDialog()
    const copyButton = podcastEpisodeDetailPage.getEpisodeCopyLinkButton()
    await expect(shareButton).toBeVisible()
    await shareButton.click()
    await expect(shareDialog).toBeVisible()
    await expect(copyButton).toBeVisible()
    await copyButton.click()
    expect(await getClipboardContent(podcastEpisodeDetailPage.getPage())).toBe(
      expectedPodcastEpisodeUrl
    )
    await assertToastMessage(podcastEpisodeDetailPage.getPage(), "Link Copied")
  })

  test("should allow user to copy share podcast episode link at specific timestamp", async ({
    podcastEpisodeDetailPage,
  }) => {
    const expectedStartDurationInSeconds = "50"
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    const expectedPodcastEpisodeUrl =
      homePageUrl() +
      `/podcasts/${encodeURIComponent(
        podcastTitle
      )}/${podcastId}/${podcastEpisodeId}?t=${expectedStartDurationInSeconds}`
    await podcastEpisodeDetailPage.goto({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
    })
    const shareButton = podcastEpisodeDetailPage.getEpisodeShareButton()
    const shareDialog = podcastEpisodeDetailPage.getEpisodeShareDialog()
    await expect(shareButton).toBeVisible()
    await shareButton.click()
    await expect(shareDialog).toBeVisible()

    const dialogTimestampInput =
      podcastEpisodeDetailPage.getEpisodeDialogTimestampInput()
    const copyLinkButton = podcastEpisodeDetailPage.getEpisodeCopyLinkButton()
    await expect(dialogTimestampInput).toBeVisible()
    await dialogTimestampInput.fill(expectedStartDurationInSeconds)
    await copyLinkButton.click()
    expect(await getClipboardContent(podcastEpisodeDetailPage.getPage())).toBe(
      expectedPodcastEpisodeUrl
    )
    await assertToastMessage(podcastEpisodeDetailPage.getPage(), "Link Copied")
  })

  test("should start podcast episode playback with url parameter ?t=", async ({
    podcastEpisodeDetailPage,
    isMobile,
    headless,
  }) => {
    test.skip(
      headless,
      "Skip test in headless mode due to decode error on media playback on headless mode in CI environment"
    )
    const expectedStartDurationInSeconds = "50"
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.gotoEpisodeTimestamp({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
      timestampInSeconds: expectedStartDurationInSeconds,
    })
    const playButton = podcastEpisodeDetailPage.getEpisodePlayButton()
    await expect(playButton).toBeVisible()
    await playButton.click()
    await expect(playButton).toBeVisible()
    await assertPodcastPlayerCurrentTime(
      podcastEpisodeDetailPage.getPage(),
      isMobile,
      Number(expectedStartDurationInSeconds)
    )
  })

  test("should ignore start podcast playback and start from zero seconds if url parameter (?t=) is greater than podcast episode duration", async ({
    podcastEpisodeDetailPage,
    isMobile,
    headless,
  }) => {
    test.skip(
      headless,
      "Skip test in headless mode due to decode error on media playback on headless mode in CI environment"
    )
    const invalidStartDurationInSeconds =
      podcastId_259760_episodeId_34000697601.data.durationInSeconds + 1
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.gotoEpisodeTimestamp({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
      timestampInSeconds: `${invalidStartDurationInSeconds}`,
    })
    const playButton = podcastEpisodeDetailPage.getEpisodePlayButton()
    await expect(playButton).toBeVisible()
    await playButton.click()
    await expect(playButton).toBeVisible()
    await assertPodcastPlayerCurrentTime(
      podcastEpisodeDetailPage.getPage(),
      isMobile,
      0
    )
  })

  test("should ignore negative start time url parameter (?t=) and start playback from zero seconds", async ({
    podcastEpisodeDetailPage,
    isMobile,
    headless,
  }) => {
    test.skip(
      headless,
      "Skip test in headless mode due to decode error on media playback on headless mode in CI environment"
    )
    const invalidStartDurationInSeconds = "-1"
    const podcastTitle = "Infinite Loops"
    const podcastId = "259760"
    const podcastEpisodeId = "34000697601"
    await podcastEpisodeDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
    await podcastEpisodeDetailPage.gotoEpisodeTimestamp({
      podcastId,
      podcastTitle,
      podcastEpisodeId,
      timestampInSeconds: `${invalidStartDurationInSeconds}`,
    })
    const playButton = podcastEpisodeDetailPage.getEpisodePlayButton()
    await expect(playButton).toBeVisible()
    await playButton.click()
    await expect(playButton).toBeVisible()
    await assertPodcastPlayerCurrentTime(
      podcastEpisodeDetailPage.getPage(),
      isMobile,
      0
    )
  })
})
