import { Locator, Page } from "@playwright/test"
import {
  podcastDetailPageUrl,
  podcastDetailPageWithPageNumberUrl,
} from "../constants/paths"
import PodcastPlayer from "../pageComponents/PodcastPlayer"

class PodcastDetailPage {
  readonly page: Page
  readonly breadcrumbPodcastDetailPageLink: Locator
  readonly breadcrumbPodcastPageLink: Locator
  readonly refreshPodcastEpisodeButton: Locator
  readonly podcastInfoContainer: Locator

  readonly episodeListPaginationContainer: Locator
  readonly nextEpisodeListPaginationButton: Locator
  readonly previousEpisodeListPaginationButton: Locator
  readonly episodePaginationActivePageNumber: Locator
  readonly firstPageEpisodeListPaginationButton: Locator
  readonly lastPageEpisodeListPaginationButton: Locator

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
    this.refreshPodcastEpisodeButton = this.page
      .locator(".podcast-episode-container")
      .getByRole("button", {
        name: "refresh podcast episodes",
        exact: true,
      })
    this.podcastInfoContainer = this.page.locator(".podcast-info-container")

    this.episodeListPaginationContainer = this.page.locator(
      ".podcast-episode-pagination"
    )
    this.nextEpisodeListPaginationButton =
      this.episodeListPaginationContainer.getByTestId("pagination-next-button")
    this.previousEpisodeListPaginationButton =
      this.episodeListPaginationContainer.getByTestId(
        "pagination-previous-button"
      )
    this.episodePaginationActivePageNumber =
      this.episodeListPaginationContainer.locator(".active")
    this.firstPageEpisodeListPaginationButton = this.page.getByTestId(
      "pagination-first-page-button"
    )
    this.lastPageEpisodeListPaginationButton = this.page.getByTestId(
      "pagination-last-page-button"
    )

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

  async gotoPageNumber({
    podcastId,
    podcastTitle,
    pageNumber,
  }: {
    podcastId: string
    podcastTitle: string
    pageNumber: string
  }) {
    await this.page.goto(
      podcastDetailPageWithPageNumberUrl({
        podcastId,
        podcastTitle,
        pageNumber,
      })
    )
  }

  getRefreshPodcastEpisodeButton() {
    return this.refreshPodcastEpisodeButton
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

  getPreviousEpisodeListPaginationButton() {
    return this.previousEpisodeListPaginationButton
  }

  getFirstPageEpisodeListPaginationButton() {
    return this.firstPageEpisodeListPaginationButton
  }

  getLastPageEpisodeListPaginationButton() {
    return this.lastPageEpisodeListPaginationButton
  }

  getEpisodePaginationActivePageNumber(activePageNumber: string) {
    return this.episodePaginationActivePageNumber.getByText(activePageNumber)
  }

  getEpisodePaginationPageNumber(pageNumber: string) {
    return this.episodeListPaginationContainer.getByText(pageNumber)
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

  getPodcastEpisodeCardDuration(episodeTitle: string, duration: string) {
    const artwork = this.getPodcastEpisodeCardArtwork(episodeTitle)
    const podcastEpisodeCard = this.page.locator(".podcast-episode-list-item", {
      has: artwork,
    })
    return podcastEpisodeCard.getByText(duration, {
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

  getPodcastEpisodeDialogTimestampRangeInput() {
    return this.page
      .getByTestId("podcast-episode-share-dialog-content")
      .locator(".podcast-episode-start-playback-time")
  }

  getPodcastEpisodePlayButton(index: number) {
    return this.podcastEpisodeCards
      .locator(".podcast-episode-card-play-button")
      .nth(index)
  }

  getPodcastPlayerContainer() {
    return this.podcastPlayer.getContainer()
  }

  getPodcastPlayer() {
    return this.podcastPlayer.getAudioPlayer()
  }

  getPodcastPlayerAudio() {
    return this.podcastPlayer.getAudioPlayerSource()
  }

  async getPodcastPlayerAudioMetadata() {
    return await this.podcastPlayer.getAudioMetadata()
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

  getMobilePodcastPlayerElements() {
    return this.podcastPlayer.getMobilePodcastPlayerElements()
  }

  getDesktopPodcastPlayerElements() {
    return this.podcastPlayer.getDesktopPodcastPlayerElements()
  }
}

export default PodcastDetailPage
