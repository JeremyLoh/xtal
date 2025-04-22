import { expect, Locator, Page } from "@playwright/test"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import { Podcast } from "../../../../src/api/podcast/model/podcast.ts"

dayjs.extend(duration)

function getPodcastInfoElement(page: Page, text: string) {
  return page.locator(".podcast-info-container").getByText(text, {
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

export function getVirtualizedListParentElement(page: Page) {
  // react-virtuoso <Virtuoso /> element container
  return page.getByTestId("virtuoso-scroller")
}

export async function scrollUntilElementIsVisible(
  page: Page,
  locator: Locator,
  parentContainer: Locator
) {
  while (!(await locator.isVisible())) {
    await parentContainer.evaluate((e) => e.scrollBy({ top: 50 }))
    await page.waitForTimeout(100) // wait for possible image to load (swap placeholder image with real image)
  }
  await locator.scrollIntoViewIfNeeded()
}

export async function assertPodcastEpisodes(page: Page, expectedEpisodes) {
  const virtualizedListParentElement = getVirtualizedListParentElement(page)
  await virtualizedListParentElement.scrollIntoViewIfNeeded()

  for (let i = 0; i < expectedEpisodes.count; i++) {
    const episode = expectedEpisodes.data.episodes[i]
    const expectedEpisodeDuration = getExpectedEpisodeDuration(
      episode.durationInSeconds
    )
    const expectedDate = dayjs
      .unix(episode.datePublished)
      .format("MMMM D, YYYY")
    const expectedArtworkSize = "144"

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
    expect(
      await artwork.getAttribute("width"),
      `(Episode ${
        i + 1
      }) podcast episode card should have artwork image width of ${expectedArtworkSize}`
    ).toBe(expectedArtworkSize)

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

    const playButtonElement = podcastEpisodeCard.locator(
      ".podcast-episode-card-play-button"
    )
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
