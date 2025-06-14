import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { assertToastMessage } from "../../constants/toasterConstants"
import { waitForClipboardContent } from "../../constants/clipboardConstants"
import { homePageUrl } from "../../constants/paths"

test.describe("Share Feature of Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test("should copy podcast detail page url when podcast info section share button is clicked", async ({
    podcastDetailPage,
  }) => {
    test.slow()
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
    const expectedPodcastUrl =
      homePageUrl() +
      `/podcasts/${encodeURIComponent(podcastTitle)}/${podcastId}`
    await podcastDetailPage.goto({ podcastId, podcastTitle })
    await expect(podcastDetailPage.getPage()).toHaveTitle(
      /Batman University - xtal - podcasts/
    )
    const podcastShareButton = podcastDetailPage.getPodcastInfoShareButton()
    await expect(podcastShareButton).toBeVisible()
    await podcastShareButton.click()
    await assertToastMessage(podcastDetailPage.getPage(), "Link Copied")
    expect(
      async () =>
        await waitForClipboardContent(
          podcastDetailPage.getPage(),
          expectedPodcastUrl
        )
    ).not.toThrowError()
  })

  test.describe("podcast episode list", () => {
    test("should open share podcast episode dialog on episode share button click", async ({
      podcastDetailPage,
    }) => {
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
        podcastDetailPage.getPodcastEpisodeShareButton(0)
      ).toBeVisible()
      await podcastDetailPage.getPodcastEpisodeShareButton(0).click()
      await expect(
        podcastDetailPage.getPodcastEpisodeShareDialog()
      ).toBeVisible()
      await expect(
        podcastDetailPage.getPodcastEpisodeDialogCopyLinkButton()
      ).toBeVisible()
    })

    test("should allow user to copy first share podcast episode link at specific timestamp", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const expectedStartDurationInSeconds = "30"
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      const podcastEpisodeId = defaultTenPodcastEpisodes.data.episodes[0].id
      await podcastDetailPage
        .getPage()
        .route(
          `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
          async (route) => {
            const json = defaultTenPodcastEpisodes
            await route.fulfill({ json })
          }
        )
      const expectedPodcastEpisodeUrl =
        homePageUrl() +
        `/podcasts/${encodeURIComponent(
          podcastTitle
        )}/${podcastId}/${podcastEpisodeId}?t=${expectedStartDurationInSeconds}`
      await podcastDetailPage.goto({ podcastId, podcastTitle })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Batman University - xtal - podcasts/
      )
      await expect(
        podcastDetailPage.getPodcastEpisodeShareButton(0)
      ).toBeVisible()
      await podcastDetailPage.getPodcastEpisodeShareButton(0).click()

      const dialogTimestampInput =
        podcastDetailPage.getPodcastEpisodeDialogTimestampInput()
      await expect(dialogTimestampInput).toBeVisible()
      await dialogTimestampInput.fill(expectedStartDurationInSeconds)

      const dialogCopyLinkButton =
        podcastDetailPage.getPodcastEpisodeDialogCopyLinkButton()
      await expect(dialogCopyLinkButton).toBeVisible()
      await dialogCopyLinkButton.click()
      await assertToastMessage(podcastDetailPage.getPage(), "Link Copied")
      expect(
        async () =>
          await waitForClipboardContent(
            podcastDetailPage.getPage(),
            expectedPodcastEpisodeUrl
          )
      ).not.toThrowError()
    })
  })
})
