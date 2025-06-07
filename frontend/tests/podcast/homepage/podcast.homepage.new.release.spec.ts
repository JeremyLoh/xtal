import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import { fiveNewReleasePodcasts } from "../../mocks/podcast.new.release"
import {
  assertNewReleasePodcasts,
  clickFirstNewReleasePodcastTitleLink,
} from "../../constants/podcast/newRelease/podcastNewReleaseConstants"
import { podcastDetailPageUrl } from "../../constants/paths"

test.describe("New Release Podcasts Section on Podcast Homepage /podcasts", () => {
  test("should display five new release podcasts section", async ({
    podcastHomePage,
  }) => {
    const exclude = "description"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
        async (route) => {
          const json = fiveNewReleasePodcasts
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await expect(podcastHomePage.getNewReleaseSubtitle()).toBeVisible()
    await assertNewReleasePodcasts(podcastHomePage, fiveNewReleasePodcasts.data)
  })

  test("should navigate to podcast detail page when podcast title link is clicked", async ({
    podcastHomePage,
  }) => {
    const firstPodcast = fiveNewReleasePodcasts.data[0]
    if (firstPodcast.title == null) {
      throw new Error("Invalid first podcast data with title of null")
    }
    const podcastTitle = firstPodcast.title
    const podcastId = firstPodcast.id
    const expectedPodcastDetailUrl = podcastDetailPageUrl({
      podcastId: `${podcastId}`,
      podcastTitle,
    })
    const exclude = "description"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
        async (route) => {
          const json = fiveNewReleasePodcasts
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await clickFirstNewReleasePodcastTitleLink(
      podcastHomePage,
      firstPodcast.title
    )
    await expect(podcastHomePage.getPage()).toHaveURL(expectedPodcastDetailUrl)
  })

  test("should display no new releases found message and refresh button when zero recent podcasts are fetched", async ({
    podcastHomePage,
  }) => {
    const exclude = "description"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
        async (route) => {
          const json = []
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await expect(
      podcastHomePage.getErrorMessage(
        "Zero recent podcasts found. Please try again later"
      )
    ).toBeVisible()
    await expect(podcastHomePage.getNewReleaseRefreshButton()).toBeVisible()
  })

  test("should refresh new release podcasts when refresh new release podcast button is clicked", async ({
    podcastHomePage,
  }) => {
    let shouldFetchData = false
    const exclude = "description"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=5&exclude=${exclude}`,
        async (route) => {
          const json = shouldFetchData ? fiveNewReleasePodcasts : []
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await expect(
      podcastHomePage.getErrorMessage(
        "Zero recent podcasts found. Please try again later"
      )
    ).toBeVisible()
    await expect(podcastHomePage.getNewReleaseRefreshButton()).toBeVisible()

    await podcastHomePage.getPage().waitForTimeout(1000) // fix flaky headless test - explicit wait required before changing shouldFetchData variable
    shouldFetchData = true
    await podcastHomePage.getNewReleaseRefreshButton().click()
    await assertNewReleasePodcasts(podcastHomePage, fiveNewReleasePodcasts.data)
  })
})
