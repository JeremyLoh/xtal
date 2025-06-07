import { Locator, Page } from "@playwright/test"
import {
  podcastEpisodeDetailPageUrl,
  podcastEpisodeDetailPageWithTimestampUrl,
} from "../constants/paths"
import PodcastPlayer, { DisplayType } from "../pageComponents/PodcastPlayer"

class PodcastEpisodeDetailPage {
  readonly page: Page
  readonly podcastPlayer: PodcastPlayer
  readonly breadcrumbPodcastHomepageLink: Locator
  readonly breadcrumbPodcastDetailLink: Locator
  readonly podcastEpisodeDetailContainer: Locator
  readonly podcastEpisodePlayButton: Locator
  readonly podcastEpisodeShareButton: Locator
  readonly podcastEpisodeShareDialog: Locator
  readonly podcastEpisodeCloseDialogButton: Locator
  readonly podcastEpisodeCopyLinkButton: Locator
  readonly podcastEpisodeDialogTimestampInput: Locator

  constructor(page: Page) {
    this.page = page
    this.podcastPlayer = new PodcastPlayer(this.page)
    this.breadcrumbPodcastHomepageLink = this.page.getByTestId(
      "podcast-episode-detail-podcasts-link"
    )
    this.breadcrumbPodcastDetailLink = this.page.getByTestId(
      "podcast-episode-detail-page-link"
    )
    this.podcastEpisodeDetailContainer = this.page.locator(
      ".podcast-episode-detail-container"
    )
    this.podcastEpisodePlayButton = this.page
      .locator(".podcast-episode-card")
      .getByRole("button", { name: "Play", exact: true })
    this.podcastEpisodeShareButton = this.page
      .locator(".podcast-episode-card")
      .getByTestId("podcast-episode-share-button")
    this.podcastEpisodeShareDialog = this.page.getByTestId(
      "podcast-episode-share-dialog-content"
    )
    this.podcastEpisodeCloseDialogButton = this.page.locator(
      ".podcast-episode-share-dialog .dialog-close-button"
    )
    this.podcastEpisodeCopyLinkButton = this.page.getByTestId(
      "podcast-episode-copy-link-button"
    )
    this.podcastEpisodeDialogTimestampInput = this.page
      .getByTestId("podcast-episode-share-dialog-content")
      .locator(".podcast-episode-start-playback-time")
  }

  getPage() {
    return this.page
  }

  goto({
    podcastId,
    podcastTitle,
    podcastEpisodeId,
  }: {
    podcastId: string
    podcastTitle: string
    podcastEpisodeId: string
  }) {
    return this.page.goto(
      podcastEpisodeDetailPageUrl({ podcastId, podcastTitle, podcastEpisodeId })
    )
  }

  gotoEpisodeTimestamp({
    podcastId,
    podcastTitle,
    podcastEpisodeId,
    timestampInSeconds,
  }: {
    podcastId: string
    podcastTitle: string
    podcastEpisodeId: string
    timestampInSeconds: string
  }) {
    return this.page.goto(
      podcastEpisodeDetailPageWithTimestampUrl({
        podcastId,
        podcastTitle,
        podcastEpisodeId,
        timestampInSeconds,
      })
    )
  }

  getErrorMessage(errorMessage: string) {
    return this.podcastEpisodeDetailContainer.getByText(errorMessage)
  }

  getBreadcrumbPodcastHomepageLink() {
    return this.breadcrumbPodcastHomepageLink
  }

  getBreadcrumbPodcastDetailLink() {
    return this.breadcrumbPodcastDetailLink
  }

  getPodcastPlayerMediaController() {
    return this.podcastPlayer.getMediaController()
  }

  async getPodcastPlayerCurrentTime(displayType: DisplayType) {
    return await this.podcastPlayer.getCurrentTimeDisplay(displayType)
  }

  getMobilePodcastPlayerElements() {
    return this.podcastPlayer.getMobilePodcastPlayerElements()
  }

  getDesktopPodcastPlayerElements() {
    return this.podcastPlayer.getDesktopPodcastPlayerElements()
  }

  getEpisodeDetailContainer() {
    return this.podcastEpisodeDetailContainer
  }

  getEpisodePlayButton() {
    return this.podcastEpisodePlayButton
  }

  getEpisodeShareButton() {
    return this.podcastEpisodeShareButton
  }

  getEpisodeShareDialog() {
    return this.podcastEpisodeShareDialog
  }

  getEpisodeCloseDialogButton() {
    return this.podcastEpisodeCloseDialogButton
  }

  getEpisodeCopyLinkButton() {
    return this.podcastEpisodeCopyLinkButton
  }

  getEpisodeDialogTimestampInput() {
    return this.podcastEpisodeDialogTimestampInput
  }
}

export default PodcastEpisodeDetailPage
