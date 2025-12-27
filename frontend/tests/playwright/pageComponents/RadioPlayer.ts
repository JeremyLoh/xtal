import { Locator, Page } from "@playwright/test"

class RadioPlayer {
  readonly page: Page
  readonly container: Locator

  constructor(page: Page) {
    this.page = page
    this.container = this.page.getByTestId("radio-player-container")
  }

  getPlayer() {
    return this.container
  }

  async getAudioMetadata() {
    return await this.container.evaluate(() => {
      if ("mediaSession" in navigator) {
        const data = navigator.mediaSession.metadata
        return {
          title: data?.title,
          artist: data?.artist,
          album: data?.album,
          artwork: data?.artwork,
        }
      }
      return null
    })
  }
}

export default RadioPlayer
