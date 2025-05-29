import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { fiveNewReleasePodcasts } from "../../mocks/podcast.new.release"
import {
  assertNewReleasePodcasts,
  clickFirstNewReleasePodcastTitleLink,
  getRefreshNewReleasePodcastsButton,
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

  test("should display no new releases found message and refresh button when zero recent podcasts are fetched", async ({
    page,
  }) => {
    const exclude = "description"
    await page.route(
      `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
      async (route) => {
        const json = []
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page.getByText("New Releases")).toBeVisible()
    await expect(
      page.getByText("Zero recent podcasts found. Please try again later")
    ).toBeVisible()
    await expect(getRefreshNewReleasePodcastsButton(page)).toBeVisible()
  })

  test("should refresh new release podcasts when refresh new release podcast button is clicked", async ({
    page,
  }) => {
    let shouldFetchData = false
    const exclude = "description"
    await page.route(
      `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
      async (route) => {
        const json = shouldFetchData ? fiveNewReleasePodcasts : []
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page.getByText("New Releases")).toBeVisible()
    await expect(
      page.getByText("Zero recent podcasts found. Please try again later")
    ).toBeVisible()
    await expect(getRefreshNewReleasePodcastsButton(page)).toBeVisible()

    await page.waitForTimeout(1000) // fix flaky headless test - explicit wait required before changing shouldFetchData variable
    shouldFetchData = true
    await getRefreshNewReleasePodcastsButton(page).click()
    await assertNewReleasePodcasts(page, fiveNewReleasePodcasts.data)
  })
})
