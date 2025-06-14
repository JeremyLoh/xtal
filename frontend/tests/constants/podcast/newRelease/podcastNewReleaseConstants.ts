import { expect, Locator } from "@playwright/test"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import {
  getVirtualizedListParentElement,
  scrollToTop,
  scrollUntilElementIsVisible,
} from "../../scroller/scrollerConstants"
import { Podcast } from "../../../../src/api/podcast/model/podcast"
import PodcastHomePage from "../../../pageObjects/PodcastHomePage"

dayjs.extend(relativeTime)

async function assertPodcastImagePlaceholderIsVisible(elementLocator: Locator) {
  await expect(
    elementLocator.locator(".podcast-image-not-available")
  ).toBeVisible()
}

export async function assertNewReleasePodcasts(
  podcastHomePage: PodcastHomePage,
  expectedPodcasts: Partial<Podcast>[]
) {
  const virtualizedListParentElement = getVirtualizedListParentElement(
    podcastHomePage.getPage()
  )
  await expect(virtualizedListParentElement).toBeVisible()
  for (let i = 0; i < expectedPodcasts.length; i++) {
    const podcast = expectedPodcasts[i]
    if (podcast.title == null) {
      throw new Error(
        "assertNewReleasePodcasts(): Invalid data with podcast title null"
      )
    }
    const podcastCard = podcastHomePage.getNewReleasePodcastCard(
      `${podcast.id}`
    )
    const title = podcastCard.getByText(podcast.title)
    const artwork = podcastCard.getByRole("img", {
      name: podcast.title + " podcast image",
      exact: true,
    })
    // to handle virtualized list rendering (not all elements are rendered to DOM at once)
    // scroll by the title of podcast (podcast image might not be available and be a placeholder)
    await scrollUntilElementIsVisible(
      podcastHomePage.getPage(),
      title,
      virtualizedListParentElement
    )
    await expect(podcastCard).toBeVisible()
    await expect(
      title,
      `(Podcast ${i + 1}) card title should be present`
    ).toBeVisible()
    if (!(await artwork.isVisible())) {
      await assertPodcastImagePlaceholderIsVisible(podcastCard)
    }

    if (podcast.latestPublishTime && podcast.latestPublishTime > 0) {
      const expectedLatestPublishTime =
        "Last Active " + dayjs.unix(podcast.latestPublishTime).fromNow()
      await expect(
        podcastCard.getByText(expectedLatestPublishTime)
      ).toBeVisible()
    } else {
      await expect(podcastCard.getByText("Last Active ")).not.toBeVisible()
    }
  }

  await scrollToTop(virtualizedListParentElement)
}

export async function clickFirstNewReleasePodcastTitleLink(
  podcastHomePage: PodcastHomePage,
  podcastTitle: string
) {
  const virtualizedListParentElement = getVirtualizedListParentElement(
    podcastHomePage.getPage()
  )
  await expect(virtualizedListParentElement).toBeVisible()
  const title = podcastHomePage
    .getNewReleasePodcastCard("")
    .getByText(podcastTitle)
  await expect(title).toBeVisible()
  await title.click()
}
