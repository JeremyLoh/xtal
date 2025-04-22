import test, { expect } from "@playwright/test"
import { defaultTenPodcastEpisodes } from "../../mocks/podcast.episode"
import { assertToastMessage, HOMEPAGE } from "../../constants/homepageConstants"
import { getPodcastInfoShareButton } from "../../constants/podcast/detail/podcastDetailConstants"
import { getClipboardContent } from "../../constants/shareStationConstants"

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
})
