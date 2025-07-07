import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { assertToastMessage } from "../../constants/toasterConstants"
import { waitForClipboardContent } from "../../constants/clipboardConstants"
import { homePageUrl } from "../../constants/paths"
import PodcastDetailPage from "../../pageObjects/PodcastDetailPage"

dayjs.extend(duration)

test.describe("Share Feature of Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  async function mockPodcastEpisodes({
    podcastDetailPage,
    podcastId,
    limit,
    episodes,
  }: {
    podcastDetailPage: PodcastDetailPage
    podcastId: string
    limit: number
    episodes: object
  }) {
    await podcastDetailPage
      .getPage()
      .route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          await route.fulfill({ json: episodes })
        }
      )
  }

  test("should copy podcast detail page url when podcast info section share button is clicked", async ({
    podcastDetailPage,
  }) => {
    test.slow()
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await mockPodcastEpisodes({
      podcastDetailPage,
      podcastId,
      limit,
      episodes: defaultTenPodcastEpisodes,
    })
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
    await waitForClipboardContent(
      podcastDetailPage.getPage(),
      expectedPodcastUrl
    )
  })

  test.describe("podcast episode list", () => {
    test("should open share podcast episode dialog on episode share button click", async ({
      podcastDetailPage,
    }) => {
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await mockPodcastEpisodes({
        podcastDetailPage,
        podcastId,
        limit,
        episodes: defaultTenPodcastEpisodes,
      })
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

    test("should not close share podcast episode dialog on copy button click", async ({
      podcastDetailPage,
    }) => {
      const podcastTitle = "Batman University"
      const podcastId = "75075"
      const limit = 10
      await mockPodcastEpisodes({
        podcastDetailPage,
        podcastId,
        limit,
        episodes: defaultTenPodcastEpisodes,
      })
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
      await podcastDetailPage.getPodcastEpisodeDialogCopyLinkButton().click()
      await expect(
        podcastDetailPage.getPodcastEpisodeShareDialog()
      ).toBeVisible()
    })

    test.describe("edit share podcast episode timestamp using input field", () => {
      test("should prevent user from providing a time that is greater than podcast episode duration", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        const expectedStartDurationInSeconds =
          defaultTenPodcastEpisodes.data.episodes[0].durationInSeconds + 1
        const expectedStartDurationTextDisplay = dayjs
          .duration(expectedStartDurationInSeconds, "seconds")
          .format("HH:mm:ss")
        const podcastTitle = "Batman University"
        const podcastId = "75075"
        const limit = 10
        await mockPodcastEpisodes({
          podcastDetailPage,
          podcastId,
          limit,
          episodes: defaultTenPodcastEpisodes,
        })
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
        await expect(dialogTimestampInput).toHaveValue("00:00:00")
        await dialogTimestampInput.clear()
        await dialogTimestampInput.fill(expectedStartDurationTextDisplay)
        await assertToastMessage(
          podcastDetailPage.getPage(),
          "Time exceeds episode duration"
        )
        await expect(dialogTimestampInput).toHaveValue(
          expectedStartDurationTextDisplay
        )
      })

      test("should allow user to edit share podcast episode timestamp using input field", async ({
        podcastDetailPage,
      }) => {
        // for timestamp display, allow the user to edit the share time in format HH:mm:ss
        test.slow()
        const expectedStartDurationInSeconds = "35"
        const expectedStartDurationTextDisplay = "00:00:35"
        const podcastTitle = "Batman University"
        const podcastId = "75075"
        const limit = 10
        const podcastEpisodeId = defaultTenPodcastEpisodes.data.episodes[0].id
        await mockPodcastEpisodes({
          podcastDetailPage,
          podcastId,
          limit,
          episodes: defaultTenPodcastEpisodes,
        })
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
        await expect(dialogTimestampInput).toHaveValue("00:00:00")
        await dialogTimestampInput.clear()
        await dialogTimestampInput.fill("00:00:35")
        await expect(dialogTimestampInput).toHaveValue(
          expectedStartDurationTextDisplay
        )

        const dialogCopyLinkButton =
          podcastDetailPage.getPodcastEpisodeDialogCopyLinkButton()
        await expect(dialogCopyLinkButton).toBeVisible()
        await dialogCopyLinkButton.click()
        await assertToastMessage(podcastDetailPage.getPage(), "Link Copied")
        await waitForClipboardContent(
          podcastDetailPage.getPage(),
          expectedPodcastEpisodeUrl
        )
      })
    })

    test.describe("edit share podcast episode timestamp using range slider field", () => {
      test("should allow user to copy first share podcast episode link at specific timestamp", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        const expectedStartDurationInSeconds = "30"
        const podcastTitle = "Batman University"
        const podcastId = "75075"
        const limit = 10
        const podcastEpisodeId = defaultTenPodcastEpisodes.data.episodes[0].id
        await mockPodcastEpisodes({
          podcastDetailPage,
          podcastId,
          limit,
          episodes: defaultTenPodcastEpisodes,
        })
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

        const dialogTimestampRangeInput =
          podcastDetailPage.getPodcastEpisodeDialogTimestampRangeInput()
        await expect(dialogTimestampRangeInput).toBeVisible()
        await dialogTimestampRangeInput.fill(expectedStartDurationInSeconds)

        const dialogCopyLinkButton =
          podcastDetailPage.getPodcastEpisodeDialogCopyLinkButton()
        await expect(dialogCopyLinkButton).toBeVisible()
        await dialogCopyLinkButton.click()
        await assertToastMessage(podcastDetailPage.getPage(), "Link Copied")
        await waitForClipboardContent(
          podcastDetailPage.getPage(),
          expectedPodcastEpisodeUrl
        )
      })
    })
  })
})
