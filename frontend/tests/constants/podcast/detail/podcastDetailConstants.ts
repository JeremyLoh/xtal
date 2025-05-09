import { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import duration from "dayjs/plugin/duration.js"
import { Podcast } from "../../../../src/api/podcast/model/podcast.ts"
import {
  getVirtualizedListParentElement,
  scrollUntilElementIsVisible,
} from "../../scroller/scrollerConstants.ts"

dayjs.extend(relativeTime)
dayjs.extend(duration)

function getPodcastInfoElement(page: Page, textMatch: string | RegExp) {
  return page.locator(".podcast-info-container").getByText(textMatch, {
    exact: true,
  })
}

export function getPodcastInfoShareButton(page: Page) {
  return page
    .locator(".podcast-info-container")
    .getByTestId("podcast-share-button")
}

export async function assertPodcastInfo(page: Page, expectedPodcast: Podcast) {
  await expect(
    page.locator(".podcast-info-container").getByRole("img", {
      name: expectedPodcast.title + " podcast image",
      exact: true,
    }),
    "Podcast Info Artwork should be present"
  ).toBeVisible()
  await expect(
    getPodcastInfoElement(page, expectedPodcast.title),
    "Podcast Info Title should be present"
  ).toBeVisible()
  await expect(
    getPodcastInfoElement(page, expectedPodcast.author),
    "Podcast Info Author should be present"
  ).toBeVisible()
  await expect(
    getPodcastInfoElement(page, expectedPodcast.language),
    "Podcast Info Language should be present"
  ).toBeVisible()
  if (expectedPodcast.latestPublishTime != undefined) {
    const lastActiveTimeString =
      "Last Active " + dayjs.unix(expectedPodcast.latestPublishTime).fromNow()
    await expect(
      getPodcastInfoElement(page, lastActiveTimeString),
      "Podcast Info Last Active Time should be present"
    ).toBeVisible()
  } else {
    // WARNING: perform text check for just "last active" word (might collide with other podcast info card text (e.g. title containing "last active" word))
    await expect(
      getPodcastInfoElement(page, new RegExp(/last active/i)),
      "Podcast Info Last Active Time should NOT be present"
    ).not.toBeVisible()
  }
  await expect(
    getPodcastInfoElement(
      page,
      expectedPodcast.episodeCount
        ? `${expectedPodcast.episodeCount} episodes`
        : "0 episodes"
    ),
    "Podcast Info Episode Count should be present"
  ).toBeVisible()
  for (const category of expectedPodcast.categories) {
    await expect(
      getPodcastInfoElement(page, category),
      `Podcast Info Category '${category}' should be present`
    ).toBeVisible()
  }
}

export function getExpectedEpisodeDuration(durationInSeconds: number) {
  const expectedHours = Math.floor(durationInSeconds / 3600)
  const expectedMins =
    expectedHours === 0
      ? Math.floor(durationInSeconds / 60)
      : Math.floor((durationInSeconds - expectedHours * 3600) / 60)
  const expectedDuration =
    expectedHours === 0
      ? `${expectedMins} min`
      : `${expectedHours} hr ${expectedMins} min`
  return expectedDuration
}

export function getEpisodeDurationSelectFilter(page: Page) {
  return page.locator(
    ".podcast-episode-list-filters select.podcast-episode-duration-filter"
  )
}

export async function getAllVisiblePodcastEpisodeTitles(
  page: Page
): Promise<Set<string>> {
  await expect(
    page
      .locator(".podcast-episode-list-item .podcast-episode-card-title")
      .first()
  ).toBeVisible()
  const virtualizedListParentElement = getVirtualizedListParentElement(page)
  await virtualizedListParentElement.scrollIntoViewIfNeeded()
  await expect(virtualizedListParentElement).toBeVisible()
  const box = await virtualizedListParentElement.boundingBox()
  if (!box) {
    throw new Error(
      "assertVisiblePodcastEpisodes(): could not find bounding box of virtualizedListParentElement"
    )
  }
  const visibleEpisodeTitles = new Set<string>()
  let previousScrollY = 0
  while (true) {
    const episodeTitleElements = await virtualizedListParentElement
      .locator(".podcast-episode-list-item .podcast-episode-card-title")
      .all()
    for (const item of episodeTitleElements) {
      const title = await item.innerText()
      visibleEpisodeTitles.add(title)
    }
    const currentScrollPosition = await virtualizedListParentElement.evaluate(
      (e: HTMLElement) => {
        const scrollY = e.scrollTop
        return e.clientHeight + scrollY
      }
    )
    const isScrollEnded = previousScrollY === currentScrollPosition
    if (isScrollEnded) {
      break
    } else {
      previousScrollY = currentScrollPosition
    }
    await virtualizedListParentElement.evaluate((e) => e.scrollBy({ top: 100 }))
    await page.waitForTimeout(200) // wait for possible animations and image to load (swap placeholder image with real image)
  }
  return visibleEpisodeTitles
}

export async function assertPodcastEpisodes(page: Page, expectedEpisodes) {
  const virtualizedListParentElement = getVirtualizedListParentElement(page)
  await expect(virtualizedListParentElement).toBeVisible()

  for (let i = 0; i < expectedEpisodes.count; i++) {
    const episode = expectedEpisodes.data.episodes[i]
    const expectedEpisodeDuration = getExpectedEpisodeDuration(
      episode.durationInSeconds
    )
    const expectedDate = dayjs
      .unix(episode.datePublished)
      .format("MMMM D, YYYY")

    const artwork = page.locator(".podcast-episode-card").getByRole("img", {
      name: episode.title + " podcast image",
      exact: true,
    })
    const podcastEpisodeCard = page.locator(".podcast-episode-list-item", {
      has: artwork,
    })
    // to handle virtualized list rendering (not all elements are rendered to DOM at once)
    await scrollUntilElementIsVisible(
      page,
      artwork,
      virtualizedListParentElement
    )
    await expect(
      artwork,
      `(Episode ${i + 1}) podcast episode card Artwork should be present`
    ).toBeVisible()

    await expect(
      podcastEpisodeCard.getByRole("link", {
        name: episode.title,
        exact: true,
      }),
      `(Episode ${i + 1}) podcast episode card Title should be present`
    ).toBeVisible()

    await expect(
      podcastEpisodeCard.getByText(expectedDate, { exact: true }),
      `(Episode ${i + 1}) podcast episode card Episode Date should be present`
    ).toBeVisible()

    if (episode.episodeNumber != null) {
      await expect(
        podcastEpisodeCard.getByText(`Episode ${episode.episodeNumber}`, {
          exact: true,
        }),
        `(Episode ${
          i + 1
        }) podcast episode card Episode Number should be present`
      ).toBeVisible()
    }

    if (episode.seasonNumber && episode.seasonNumber > 0) {
      await expect(
        podcastEpisodeCard.getByText(`Season ${episode.seasonNumber}`, {
          exact: true,
        }),
        `(Episode ${
          i + 1
        }) podcast episode card Season Number should be present`
      ).toBeVisible()
    } else {
      await expect(
        podcastEpisodeCard.getByText(`Season ${episode.seasonNumber}`, {
          exact: true,
        }),
        `(Episode ${
          i + 1
        }) podcast episode card Season Number should not be present`
      ).not.toBeVisible()
    }

    await expect(
      podcastEpisodeCard.getByText(
        `${episode.isExplicit ? "Explicit" : "Not Explicit"}`,
        { exact: true }
      ),
      `(Episode ${
        i + 1
      }) podcast episode card Explicit Indicator should be present`
    ).toBeVisible()

    await expect(
      podcastEpisodeCard.getByText(expectedEpisodeDuration, { exact: true }),
      `(Episode ${
        i + 1
      }) podcast episode card Duration in Minutes should be present`
    ).toBeVisible()
    // ensure description has no duplicates - remove all empty lines "" and newlines ("\n")
    const descriptionElement = podcastEpisodeCard.locator(
      ".podcast-episode-card-description"
    )
    await scrollUntilElementIsVisible(
      page,
      descriptionElement,
      virtualizedListParentElement
    )
    const descriptions = (await descriptionElement.allInnerTexts())
      .join("")
      .split("\n")
      .filter((line) => line.trim() !== "")
    expect(
      new Set(descriptions).size,
      `(Episode ${
        i + 1
      }) podcast episode card Description should not be duplicated due to React Strict Mode`
    ).toBe(descriptions.length)

    const playButtonElement = podcastEpisodeCard
      .locator(".podcast-episode-card-play-button")
      .first()
    await scrollUntilElementIsVisible(
      page,
      playButtonElement,
      virtualizedListParentElement
    )
    await expect(
      playButtonElement,
      `(Episode ${i + 1}) podcast episode card Play button should be present`
    ).toBeVisible()
  }
}

export async function assertPodcastEpisodeOnPodcastEpisodeDetailPage(
  page: Page,
  expectedEpisode
) {
  const episode = expectedEpisode.data
  const expectedTitle = episode.title
  const expectedEpisodeDuration = getExpectedEpisodeDuration(
    episode.durationInSeconds
  )
  const expectedDate = dayjs.unix(episode.datePublished).format("MMMM D, YYYY")
  const artwork = page.locator(".podcast-episode-card").getByRole("img", {
    name: expectedTitle + " podcast image",
    exact: true,
  })
  const expectedArtworkSize = "200"
  await expect(
    artwork,
    "Podcast episode card Artwork should be present"
  ).toBeVisible()
  expect(
    await artwork.getAttribute("width"),
    `Podcast episode card should have artwork image width of ${expectedArtworkSize}`
  ).toBe(expectedArtworkSize)

  await expect(
    page
      .locator(".podcast-episode-card .podcast-episode-card-title")
      .getByText(expectedTitle, { exact: true }),
    "Podcast episode card Title should be present"
  ).toBeVisible()

  await expect(
    page
      .locator(".podcast-episode-card")
      .getByText(expectedDate, { exact: true }),
    `Podcast episode card Episode Date should be present`
  ).toBeVisible()

  await expect(
    page
      .locator(".podcast-episode-card")
      .getByText(expectedEpisodeDuration, { exact: true }),
    `Podcast episode card Duration in Minutes should be present`
  ).toBeVisible()

  await expect(
    page
      .locator(".podcast-episode-card")
      .getByText(`${episode.isExplicit ? "Explicit" : "Not Explicit"}`, {
        exact: true,
      }),
    `Podcast episode card Explicit Indicator should be present`
  ).toBeVisible()

  await expect(
    page
      .locator(".podcast-episode-card")
      .getByRole("link", { name: episode.externalWebsiteUrl, exact: true })
  ).toBeVisible()

  // ensure description has no duplicates - remove all empty lines "" and newlines ("\n")
  const descriptions = (
    await page
      .locator(".podcast-episode-card .podcast-episode-card-description")
      .allInnerTexts()
  )
    .join("")
    .split("\n")
    .filter((line) => line.trim() !== "")
  expect(
    new Set(descriptions).size,
    `Podcast episode card Description should not be duplicated due to React Strict Mode`
  ).toBe(descriptions.length)

  await expect(
    page.locator(".podcast-episode-card .podcast-episode-card-play-button"),
    `Podcast episode card Play button should be present`
  ).toBeVisible()
}
