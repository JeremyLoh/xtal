import { Locator, Page } from "@playwright/test"

type DisplayType = "mobile" | "desktop"

class PodcastPlayer {
  readonly page: Page
  readonly container: Locator
  readonly mediaController: Locator
  readonly audioPlayer: Locator
  readonly getPlayButton: (displayType: DisplayType) => Locator
  readonly getSeekBackwardButton: (displayType: DisplayType) => Locator
  readonly getSeekForwardButton: (displayType: DisplayType) => Locator
  readonly getPlaybackRateButton: (displayType: DisplayType) => Locator
  readonly getTimeDisplayButton: (displayType: DisplayType) => Locator
  readonly getTimeRangeButton: (displayType: DisplayType) => Locator
  readonly getMuteButton: (displayType: DisplayType) => Locator
  readonly getVolumeRangeButton: (displayType: DisplayType) => Locator

  constructor(page: Page) {
    this.page = page
    this.container = this.page.locator(".podcast-player")
    this.mediaController = this.page.locator("media-controller")
    this.audioPlayer = this.page.locator(".audio-player")
    this.getPlayButton = (displayType: DisplayType) => {
      return this.page.getByTestId(`audio-player-${displayType}-play-button`)
    }
    this.getSeekBackwardButton = (displayType: DisplayType) => {
      return this.page.getByTestId(
        `audio-player-${displayType}-seek-backward-button`
      )
    }
    this.getSeekForwardButton = (displayType: DisplayType) => {
      return this.page.getByTestId(
        `audio-player-${displayType}-seek-forward-button`
      )
    }
    this.getPlaybackRateButton = (displayType: DisplayType) => {
      return this.page.getByTestId(
        `audio-player-${displayType}-playback-rate-button`
      )
    }
    this.getTimeDisplayButton = (displayType: DisplayType) => {
      return this.page.getByTestId(
        `audio-player-${displayType}-time-display-button`
      )
    }
    this.getTimeRangeButton = (displayType: DisplayType) => {
      return this.page.getByTestId(
        `audio-player-${displayType}-time-range-button`
      )
    }
    this.getMuteButton = (displayType: DisplayType) => {
      return this.page.getByTestId(`audio-player-${displayType}-mute-button`)
    }
    this.getVolumeRangeButton = (displayType: DisplayType) => {
      return this.page.getByTestId(
        `audio-player-${displayType}-volume-range-button`
      )
    }
  }

  getContainer() {
    return this.container
  }

  getMediaController() {
    return this.mediaController
  }

  getAudioPlayer() {
    return this.audioPlayer
  }

  getAudioPlayerSource() {
    return this.audioPlayer.locator("audio")
  }

  async getAudioMetadata() {
    return await this.audioPlayer.evaluate(() => {
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

  getPlayerPlayButton(displayType: DisplayType) {
    return this.getPlayButton(displayType)
  }

  getPlayerSeekBackwardButton(displayType: DisplayType) {
    return this.getSeekBackwardButton(displayType)
  }

  getPlayerSeekForwardButton(displayType: DisplayType) {
    return this.getSeekForwardButton(displayType)
  }

  getPlayerPlaybackRateButton(displayType: DisplayType) {
    return this.getPlaybackRateButton(displayType)
  }

  getPlayerTimeDisplayButton(displayType: DisplayType) {
    return this.getTimeDisplayButton(displayType)
  }

  getPlayerTimeRangeButton(displayType: DisplayType) {
    return this.getTimeRangeButton(displayType)
  }

  getPlayerMuteButton(displayType: DisplayType) {
    return this.getMuteButton(displayType)
  }

  getPlayerVolumeRangeButton(displayType: DisplayType) {
    return this.getVolumeRangeButton(displayType)
  }

  getMobilePodcastPlayerElements() {
    const displayType: DisplayType = "mobile"
    return {
      playButton: this.getPlayButton(displayType),
      seekBackwardButton: this.getSeekBackwardButton(displayType),
      playbackRateButton: this.getPlaybackRateButton(displayType),
      timeDisplayButton: this.getTimeDisplayButton(displayType),
      muteButton: this.getMuteButton(displayType),
    }
  }

  getDesktopPodcastPlayerElements() {
    const displayType: DisplayType = "desktop"
    return {
      playButton: this.getPlayButton(displayType),
      seekBackwardButton: this.getSeekBackwardButton(displayType),
      seekForwardButton: this.getSeekForwardButton(displayType),
      playbackRateButton: this.getPlaybackRateButton(displayType),
      timeDisplayButton: this.getTimeDisplayButton(displayType),
      timeRangeButton: this.getPlayerTimeRangeButton(displayType),
      muteButton: this.getMuteButton(displayType),
      volumeRangeButton: this.getPlayerVolumeRangeButton(displayType),
    }
  }

  async getCurrentTimeDisplay(displayType: DisplayType) {
    const time = Number(
      await this.getTimeDisplayButton(displayType).getAttribute(
        "mediacurrenttime"
      )
    )
    return time
  }
}

export default PodcastPlayer
export type { DisplayType }
