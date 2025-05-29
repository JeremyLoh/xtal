import { expect, Locator, Page } from "@playwright/test"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../scroller/scrollerConstants"
import { Podcast } from "../../../../src/api/podcast/model/podcast"

dayjs.extend(relativeTime)

async function assertPodcastImagePlaceholderIsVisible(elementLocator: Locator) {
  await expect(
    elementLocator.locator(".podcast-image-not-available")
  ).toBeVisible()
}

export async function assertNewReleasePodcasts(
  page: Page,
  expectedPodcasts: Partial<Podcast>[]
) {
  const virtualizedListParentElement = getVirtualizedListParentElement(page)
  await expect(virtualizedListParentElement).toBeVisible()
  for (let i = 0; i < expectedPodcasts.length; i++) {
    const podcast = expectedPodcasts[i]
    const podcastCard = page.getByTestId(
      `new-release-podcast-card-${podcast.id}`
    )
    if (podcast.title == null) {
      throw new Error(
        "assertNewReleasePodcasts(): Invalid data with podcast title null"
      )
    }
    const title = page
      .locator(".new-release-podcast-card")
      .getByText(podcast.title)
    const artwork = page.locator(".new-release-podcast-card").getByRole("img", {
      name: podcast.title + " podcast image",
      exact: true,
    })
    // to handle virtualized list rendering (not all elements are rendered to DOM at once)
    // scroll by the title of podcast (podcast image might not be available and be a placeholder)
    await scrollUntilElementIsVisible(page, title, virtualizedListParentElement)
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
}

export async function clickFirstNewReleasePodcastTitleLink(
  page: Page,
  podcastTitle: string
) {
  const virtualizedListParentElement = getVirtualizedListParentElement(page)
  await expect(virtualizedListParentElement).toBeVisible()
  const title = page
    .locator(".new-release-podcast-card")
    .getByText(podcastTitle)
  await expect(title).toBeVisible()
  await title.click()
}

export function getRefreshNewReleasePodcastsButton(page: Page) {
  return page.locator(".new-release-podcast-container").getByRole("button", {
    name: "refresh new release podcasts",
    exact: true,
  })
}
