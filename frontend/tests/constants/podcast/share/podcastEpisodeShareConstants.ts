import { Page } from "@playwright/test"

export function getPodcastEpisodeShareButton(page: Page) {
  return page
    .locator(".podcast-episode-card")
    .getByTestId("podcast-episode-share-button")
}

export function getFirstPodcastEpisodeShareButton(page: Page) {
  return page
    .locator(".podcast-episode-card")
    .getByTestId("podcast-episode-share-button")
    .nth(0)
}

export function getPodcastEpisodeShareDialog(page: Page) {
  return page.getByTestId("podcast-episode-share-dialog-content")
}

export function getPodcastEpisodeCopyLinkButton(page: Page) {
  return page.getByTestId("podcast-episode-copy-link-button")
}

export function getPodcastEpisodeCloseDialogButton(page: Page) {
  return page.locator(".podcast-episode-share-dialog .dialog-close-button")
}

export function getPodcastEpisodeDialogTimestampInput(page: Page) {
  return page
    .getByTestId("podcast-episode-share-dialog-content")
    .locator(".podcast-episode-start-playback-time")
}

export function getPodcastEpisodePlayButton(page: Page) {
  return page
    .locator(".podcast-episode-card")
    .getByRole("button", { name: "Play", exact: true })
}
