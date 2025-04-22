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

  test("should copy podcast episode detail page url when share button is clicked", async ({
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
    expect(await getClipboardContent(page)).toBe(expectedPodcastEpisodeUrl)
    await assertToastMessage(page, "Link Copied")
  })
})
