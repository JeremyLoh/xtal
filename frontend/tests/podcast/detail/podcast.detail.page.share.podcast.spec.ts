import test, { expect } from "@playwright/test"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { assertToastMessage, HOMEPAGE } from "../../constants/homepageConstants"
import { getPodcastInfoShareButton } from "../../constants/podcast/detail/podcastDetailConstants"
import { getClipboardContent } from "../../constants/shareStationConstants"
import {
  getFirstPodcastEpisodeShareButton,
  getPodcastEpisodeCopyLinkButton,
  getPodcastEpisodeDialogTimestampInput,
  getPodcastEpisodeShareDialog,
} from "../../constants/podcast/share/podcastEpisodeShareConstants"

test.describe("Share Feature of Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test("should copy podcast detail page url when podcast info section share button is clicked", async ({
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
    const expectedPodcastUrl =
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`
    await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    const podcastShareButton = getPodcastInfoShareButton(page)
    await expect(podcastShareButton).toBeVisible()
    await podcastShareButton.click()
    expect(await getClipboardContent(page)).toBe(expectedPodcastUrl)
    await assertToastMessage(page, "Link Copied")
  })

  test.describe("podcast episode list", () => {
    test("should open share podcast episode dialog on episode share button click", async ({
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
      await expect(getFirstPodcastEpisodeShareButton(page)).toBeVisible()
      await getFirstPodcastEpisodeShareButton(page).click()
      await expect(getPodcastEpisodeShareDialog(page)).toBeVisible()
      await expect(getPodcastEpisodeCopyLinkButton(page)).toBeVisible()
    })

    test("should allow user to copy first share podcast episode link at specific timestamp", async ({
      page,
    }) => {
      const expectedStartDurationInSeconds = "30"
      const podcastTitle = encodeURIComponent("Batman University")
      const podcastId = "75075"
      const limit = 10
      const podcastEpisodeId = defaultTenPodcastEpisodes.data.episodes[0].id
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
        async (route) => {
          const json = defaultTenPodcastEpisodes
          await route.fulfill({ json })
        }
      )
      const expectedPodcastEpisodeUrl =
        HOMEPAGE +
        `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}?t=${expectedStartDurationInSeconds}`
      await page.goto(HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`)
      await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
      await expect(getFirstPodcastEpisodeShareButton(page)).toBeVisible()
      await getFirstPodcastEpisodeShareButton(page).click()
      await expect(getPodcastEpisodeDialogTimestampInput(page)).toBeVisible()
      await getPodcastEpisodeDialogTimestampInput(page).fill(
        expectedStartDurationInSeconds
      )
      await expect(getPodcastEpisodeCopyLinkButton(page)).toBeVisible()
      await getPodcastEpisodeCopyLinkButton(page).click()
      expect(await getClipboardContent(page)).toBe(expectedPodcastEpisodeUrl)
      await assertToastMessage(page, "Link Copied")
    })
  })
})
