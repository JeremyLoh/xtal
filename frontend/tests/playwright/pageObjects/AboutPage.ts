import { Locator, Page } from "@playwright/test"
import { aboutPageUrl } from "../constants/paths"

class AboutPage {
  readonly page: Page
  readonly jeremyProfilePicture: Locator
  readonly podcastStatsContainer: Locator
  readonly radioStationStatsContainer: Locator

  constructor(page: Page) {
    this.page = page
    this.jeremyProfilePicture = this.page.getByTestId("jeremy-profile-picture")
    this.podcastStatsContainer = this.page.locator(
      ".about-page-podcast-stats-container"
    )
    this.radioStationStatsContainer = this.page.locator(
      ".about-page-radio-station-stats-container"
    )
  }

  goto() {
    return this.page.goto(aboutPageUrl())
  }

  getPage() {
    return this.page
  }

  getJeremyProfilePicture() {
    return this.jeremyProfilePicture
  }

  getJeremyIntroText(text: string) {
    return this.page.getByText(text)
  }

  getIntroText() {
    const intro =
      "Immerse yourself in the world by exploring podcasts and radio stations from around the world using xtal!"
    return this.page.getByText(intro)
  }

  getListenReasonSectionHeader() {
    return this.page.getByText("Why listen to podcasts/radio?")
  }

  getListenReasonSectionText(text: string) {
    return this.page
      .locator(".about-section-card")
      .getByText(text, { exact: true })
  }

  getPodcastStatsContainer() {
    return this.podcastStatsContainer
  }

  getPodcastStats(text: string) {
    return this.podcastStatsContainer.getByText(text)
  }

  getRadioStationStatsContainer() {
    return this.radioStationStatsContainer
  }

  getRadioStationStats(text: string) {
    return this.radioStationStatsContainer.getByText(text)
  }
}

export default AboutPage
