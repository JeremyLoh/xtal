import { Locator, Page } from "@playwright/test"
import { podcastDetailPageUrl } from "../constants/paths"
import PodcastPlayer from "../pageComponents/PodcastPlayer"

class PodcastDetailPage {
  readonly page: Page
  readonly breadcrumbPodcastDetailPageLink: Locator
  readonly breadcrumbPodcastPageLink: Locator
  readonly podcastInfoContainer: Locator
  readonly nextEpisodeListPaginationButton: Locator
  readonly episodePaginationActivePageNumber: Locator
  readonly episodeDurationFilter: Locator
  readonly podcastEpisodeCards: Locator
  readonly podcastPlayer: PodcastPlayer

  constructor(page: Page) {
    this.page = page
    this.breadcrumbPodcastDetailPageLink = this.page.getByTestId(
      "podcast-detail-page-category-link"
    )
    this.breadcrumbPodcastPageLink = this.page.getByTestId(
      "podcast-detail-page-podcasts-link"
    )
    this.podcastInfoContainer = this.page.locator(".podcast-info-container")
    this.nextEpisodeListPaginationButton = this.page
      .locator(".podcast-episode-pagination")
      .getByTestId("pagination-next-button")
    this.episodePaginationActivePageNumber = this.page
      .locator(".podcast-episode-pagination")
      .locator(".active")
    this.episodeDurationFilter = this.page.locator(
      ".podcast-episode-list-filters select.podcast-episode-duration-filter"
    )
    this.podcastEpisodeCards = this.page.locator(".podcast-episode-card")
    this.podcastPlayer = new PodcastPlayer(this.page)
  }

  getPage() {
    return this.page
  }

  async goto({
    podcastId,
    podcastTitle,
  }: {
    podcastId: string
    podcastTitle: string
  }) {
    await this.page.goto(podcastDetailPageUrl({ podcastId, podcastTitle }))
  }

  getBreadcrumbPodcastDetailPageLink() {
    return this.breadcrumbPodcastDetailPageLink
  }

  getBreadcrumbPodcastPageLink() {
    return this.breadcrumbPodcastPageLink
  }

  getEpisodeDurationFilter() {
    return this.episodeDurationFilter
  }

  getNextEpisodeListPaginationButton() {
    return this.nextEpisodeListPaginationButton
  }

  getEpisodePaginationActivePageNumber(activePageNumber: string) {
    return this.episodePaginationActivePageNumber.getByText(activePageNumber)
  }

  getPodcastInfoContainer() {
    return this.podcastInfoContainer
  }

  getPodcastInfoCategoryPill(category: string) {
    return this.podcastInfoContainer.getByText(category, { exact: true })
  }

  getPodcastInfoShareButton() {
    return this.podcastInfoContainer.getByTestId("podcast-share-button")
  }

  getPodcastEpisodeCardTitle(title: string) {
    return this.podcastEpisodeCards.getByText(title, { exact: true })
  }

  getPodcastEpisodeCardArtwork(episodeTitle: string) {
    return this.podcastEpisodeCards.getByRole("img", {
      name: episodeTitle + " podcast image",
      exact: true,
    })
  }

  getPodcastEpisodeShareButton(index: number) {
    return this.podcastEpisodeCards
      .getByTestId("podcast-episode-share-button")
      .nth(index)
  }

  getPodcastEpisodeShareDialog() {
    return this.page.getByTestId("podcast-episode-share-dialog-content")
  }

  getPodcastEpisodeDialogCopyLinkButton() {
    return this.page.getByTestId("podcast-episode-copy-link-button")
  }

  getPodcastEpisodeDialogTimestampInput() {
    return this.page
      .getByTestId("podcast-episode-share-dialog-content")
      .locator(".podcast-episode-start-playback-time")
  }

  getPodcastEpisodePlayButton(index: number) {
    return this.podcastEpisodeCards
      .locator(".podcast-episode-card-play-button")
      .nth(index)
  }

  getPodcastPlayer() {
    return this.podcastPlayer.getAudioPlayer()
  }

  getPodcastPlayerAudio() {
    return this.podcastPlayer.getAudioPlayerSource()
  }

  getPodcastPlayerLink(linkName: string) {
    return this.podcastPlayer.getLink(linkName)
  }

  getPodcastPlayerArtwork(episodeTitle: string) {
    return this.podcastPlayer.getArtwork(episodeTitle)
  }

  getPodcastPlayerExpandPlayerButton() {
    return this.podcastPlayer.getExpandPlayerButton()
  }

  getPodcastPlayerMinimizePlayerButton() {
    return this.podcastPlayer.getMinimizePlayerButton()
  }
}

export default PodcastDetailPage
