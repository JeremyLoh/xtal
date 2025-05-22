import test, { expect, Page } from "@playwright/test"
import { podcastId_259760_episodeId_34000697601 } from "../../mocks/podcast.episode"
import { assertToastMessage, HOMEPAGE } from "../../constants/homepageConstants"
import { getClipboardContent } from "../../constants/shareStationConstants"

test.describe("Share Feature of Podcast Episode Detail Page for viewing single podcast episode /podcasts/PODCAST-TITLE/PODCAST-ID/PODCAST-EPISODE-ID", () => {
  function getPodcastEpisodeDetailShareButton(page: Page) {
    return page
      .locator(".podcast-episode-card")
      .getByTestId("podcast-episode-share-button")
  }

  function getPodcastEpisodeShareDialog(page: Page) {
    return page.getByTestId("podcast-episode-share-dialog-content")
  }

  function getPodcastEpisodeCopyLinkButton(page: Page) {
    return page.getByTestId("podcast-episode-copy-link-button")
  }

  function getPodcastEpisodeCloseDialogButton(page: Page) {
    return page.locator(".podcast-episode-share-dialog .dialog-close-button")
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
    await expect(getPodcastEpisodeDetailShareButton(page)).toBeVisible()
    await getPodcastEpisodeDetailShareButton(page).click()
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
    await expect(getPodcastEpisodeDetailShareButton(page)).toBeVisible()
    await getPodcastEpisodeDetailShareButton(page).click()
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
    await expect(getPodcastEpisodeDetailShareButton(page)).toBeVisible()
    await getPodcastEpisodeDetailShareButton(page).click()
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
    await expect(getPodcastEpisodeDetailShareButton(page)).toBeVisible()
    await getPodcastEpisodeDetailShareButton(page).click()
    await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()
    await expect(getPodcastEpisodeCopyLinkButton(page)).toBeVisible()
    await getPodcastEpisodeCopyLinkButton(page).click()
    expect(await getClipboardContent(page)).toBe(expectedPodcastEpisodeUrl)
    await assertToastMessage(page, "Link Copied")
  })
})
