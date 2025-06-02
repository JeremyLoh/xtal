import { Locator, Page } from "@playwright/test"

class PodcastPlayer {
  readonly page: Page
  readonly audioPlayer: Locator

  constructor(page: Page) {
    this.page = page
    this.audioPlayer = this.page.locator(".audio-player")
  }

  getAudioPlayer() {
    return this.audioPlayer
  }

  getAudioPlayerSource() {
    return this.audioPlayer.locator("audio")
  }

  getLink(linkName: string) {
    return this.audioPlayer.getByRole("link", { name: linkName, exact: true })
  }

  getArtwork(episodeTitle: string) {
    return this.audioPlayer.getByRole("img", {
      name: episodeTitle + " podcast image",
      exact: true,
    })
  }

  getExpandPlayerButton() {
    return this.audioPlayer.locator(
      ".podcast-play-episode-expand-player-button"
    )
  }

  getMinimizePlayerButton() {
    return this.audioPlayer.locator(
      ".podcast-play-episode-minimize-player-button"
    )
  }
}

export default PodcastPlayer
