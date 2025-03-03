import { expect, Page } from "@playwright/test"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import { Podcast } from "../../../../src/api/podcast/model/podcast.ts"

dayjs.extend(duration)

function getPodcastInfoElement(page: Page, text: string) {
  return page.locator(".podcast-info-container").getByText(text, {
    exact: true,
  })
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

export async function assertPodcastEpisodes(page: Page, expectedEpisodes) {
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
      page
        .locator(".podcast-episode-card .podcast-episode-card-title")
        .getByText(episode.title, { exact: true }),
      `(Episode ${i + 1}) podcast episode card Title should be present`
    ).toBeVisible()
    await expect(
      page
        .locator(".podcast-episode-card")
        .getByText(expectedDate, { exact: true }),
      `(Episode ${i + 1}) podcast episode card Episode Date should be present`
    ).toBeVisible()
    await expect(
      page
        .locator(".podcast-episode-card")
        .getByText(`Episode ${episode.episodeNumber}`, { exact: true }),
      `(Episode ${i + 1}) podcast episode card Episode Number should be present`
    ).toBeVisible()

    if (episode.seasonNumber && episode.seasonNumber > 0) {
      await expect(
        page
          .locator(".podcast-episode-card")
          .nth(i)
          .getByText(`Season ${episode.seasonNumber}`, { exact: true }),
        `(Episode ${
          i + 1
        }) podcast episode card Season Number should be present`
      ).toBeVisible()
    } else {
      await expect(
        page
          .locator(".podcast-episode-card")
          .nth(i)
          .getByText(`Season ${episode.seasonNumber}`, { exact: true }),
        `(Episode ${
          i + 1
        }) podcast episode card Season Number should not be present`
      ).not.toBeVisible()
    }

    await expect(
      page
        .locator(".podcast-episode-card")
        .nth(i)
        .getByText(expectedEpisodeDuration, { exact: true }),
      `(Episode ${
        i + 1
      }) podcast episode card Duration in Minutes should be present`
    ).toBeVisible()
    // ensure description has no duplicates - remove all empty lines "" and newlines ("\n")
    const descriptions = (
      await page
        .locator(".podcast-episode-card .podcast-episode-card-description")
        .nth(i)
        .allInnerTexts()
    )
      .join("")
      .split("\n")
      .filter((line) => line.trim() !== "")
    expect(
      new Set(descriptions).size,
      `(Episode ${
        i + 1
      }) podcast episode card Description should not be duplicated due to React Strict Mode`
    ).toBe(descriptions.length)
    await expect(
      page
        .locator(".podcast-episode-card .podcast-episode-card-play-button")
        .nth(i),
      `(Episode ${i + 1}) podcast episode card Play button should be present`
    ).toBeVisible()
  }
}

export async function assertPodcastEpisodeOnPodcastEpisodeDetailPage(
  page: Page,
  expectedEpisode
) {
  const expectedTitle = expectedEpisode.data.title
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
}
