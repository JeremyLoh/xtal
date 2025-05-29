import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { fiveNewReleasePodcasts } from "../../mocks/podcast.new.release"
import {
  assertNewReleasePodcasts,
  clickFirstNewReleasePodcastTitleLink,
} from "../../constants/podcast/newRelease/podcastNewReleaseConstants"

test.describe("New Release Podcasts Section on Podcast Homepage /podcasts", () => {
  test("should display five new release podcasts section", async ({ page }) => {
    const exclude = "description"
    await page.route(
      `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
      async (route) => {
        const json = fiveNewReleasePodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page.getByText("New Releases")).toBeVisible()
    await expect(
      page.getByText("Latest podcasts with new episodes")
    ).toBeVisible()
    await assertNewReleasePodcasts(page, fiveNewReleasePodcasts.data)
  })

  test("should navigate to podcast detail page when podcast title link is clicked", async ({
    page,
  }) => {
    const firstPodcast = fiveNewReleasePodcasts.data[0]
    if (firstPodcast.title == null) {
      throw new Error("Invalid first podcast data with title of null")
    }
    const podcastTitle = encodeURIComponent(firstPodcast.title)
    const podcastId = firstPodcast.id
    const expectedPodcastDetailUrl =
      HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`
    const exclude = "description"
    await page.route(
      `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
      async (route) => {
        const json = fiveNewReleasePodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await clickFirstNewReleasePodcastTitleLink(page, firstPodcast.title)
    await expect(page).toHaveURL(expectedPodcastDetailUrl)
  })
})
