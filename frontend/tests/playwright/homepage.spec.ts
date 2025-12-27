import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import {
  stationWithBlockedAccess,
  stationWithHlsAudioM3u8,
  stationWithMultipleTags,
  stationWithNoLocationLatLng,
  unitedStatesStation,
} from "./mocks/station"

test("has title", async ({ homePage }) => {
  await homePage.goto()
  await expect(homePage.getPage()).toHaveTitle(/xtal/)
})

test.describe("header", () => {
  test("has header", async ({ homePage }) => {
    await homePage.goto()
    await expect(homePage.getHeader()).toBeVisible()
  })

  test("should not have header navigation to radio and podcast homepage on mobile", async ({
    homePage,
    isMobile,
  }) => {
    test.skip(!isMobile, "skip mobile test")
    await homePage.goto()
    await expect(homePage.getHeader()).toBeVisible()
    await expect(homePage.getNavbarRadioLink()).not.toBeVisible()
    await expect(homePage.getNavbarPodcastLink()).not.toBeVisible()
  })

  test("should have header navigation to radio and podcast homepage on desktop", async ({
    homePage,
    isMobile,
  }) => {
    test.skip(isMobile, "skip desktop test")
    await homePage.getPage().setViewportSize({ width: 1920, height: 1080 })
    await homePage.goto()
    await expect(homePage.getNavbarRadioLink()).toBeVisible()
    await expect(homePage.getNavbarPodcastLink()).toBeVisible()
  })

  test("should navigate between radio and podcast header nav links on desktop", async ({
    homePage,
    isMobile,
  }) => {
    test.skip(isMobile, "skip desktop test")
    await homePage.getPage().setViewportSize({ width: 1920, height: 1080 })
    await homePage.goto()
    await expect(homePage.getPage()).toHaveTitle(/^xtal$/)

    await homePage.getNavbarPodcastLink().click()
    await expect(homePage.getPage()).toHaveTitle(/^xtal - podcasts$/)
    expect(homePage.getPage().url()).toMatch(/\/podcasts$/)

    await homePage.getNavbarRadioLink().click()
    await expect(homePage.getPage()).toHaveTitle(/^xtal$/)
    expect(homePage.getPage().url()).not.toMatch(/\/podcasts$/)
  })
})

test("has footer", async ({ homePage }) => {
  await homePage.goto()
  await expect(homePage.getFooter()).toBeVisible()
  await expect(homePage.getFooter().getByText("Jeremy_Loh")).toBeVisible()
  await expect(
    homePage.getFooter().locator("#footer-github-link")
  ).toHaveAttribute("href", "https://github.com/JeremyLoh/")
})

test.describe("404 Not Found page", () => {
  test("should display 404 Not Found page when invalid url is reached", async ({
    homePage,
  }) => {
    await homePage.gotoUrl("/invalid-url")

    await expect(homePage.getPage().getByText("404 Not Found")).toBeVisible()
    await expect(
      homePage.getPage().getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
  })

  test("should navigate to homepage when 'Return Home' link is clicked on 404 Not Found page", async ({
    homePage,
  }) => {
    await homePage.gotoUrl("/invalid-url")

    await expect(homePage.getPage().getByText("404 Not Found")).toBeVisible()
    await expect(
      homePage.getPage().getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()

    await homePage
      .getPage()
      .getByRole("link", { name: "Return Home", exact: true })
      .click()

    expect(homePage.getPage().url()).not.toBe("/invalid-url")
  })
})

test.describe("random radio station", () => {
  test("display random station on map", async ({
    homePage,
    isMobile,
    headless,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    test.slow()

    // mock radio browser api with any query params
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [stationWithNoLocationLatLng]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()

    // assert radio card is shown inside map (map has css id of "map")
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithNoLocationLatLng.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("link", {
        name: stationWithNoLocationLatLng.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByText(stationWithNoLocationLatLng.country, {
        exact: true,
      })
    ).toBeVisible()

    await homePage.getPage().waitForTimeout(3000) // wait for possible radio playback error message

    const isPlaybackErrorMessagePresent =
      (await homePage
        .getRadioCard()
        .getByTestId("radio-card-playback-error")
        .count()) === 1
    if (isPlaybackErrorMessagePresent) {
      // skip assertion on play button as playback error happened for this test run
      await expect(
        homePage.getRadioCard().getByTestId("radio-card-playback-error")
      ).toHaveText(
        /The media could not be loaded. Server failed or the playback format is not supported/
      )
      return
    }

    if (isMobile) {
      const mobilePlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-mobile-play-button")
      await expect(mobilePlayButton).toHaveAttribute("mediapaused")
      await mobilePlayButton.click()

      const mobilePauseButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-mobile-play-button")
      await expect(mobilePauseButton).not.toHaveAttribute("mediapaused")
      await mobilePauseButton.click()
    } else {
      const desktopPlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-desktop-play-button")
      await expect(desktopPlayButton).toHaveAttribute("mediapaused")
      await desktopPlayButton.click()

      const desktopPauseButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-desktop-play-button")
      await expect(desktopPauseButton).not.toHaveAttribute("mediapaused")
      await desktopPauseButton.click()
    }
  })

  test("should display audio metadata on play", async ({
    homePage,
    headless,
    isMobile,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    test.slow()

    // mock radio browser api with any query params
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [stationWithNoLocationLatLng]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()

    // assert radio card is shown inside map (map has css id of "map")
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithNoLocationLatLng.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("link", {
        name: stationWithNoLocationLatLng.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByText(stationWithNoLocationLatLng.country, {
        exact: true,
      })
    ).toBeVisible()

    await homePage.getPage().waitForTimeout(3000) // wait for possible radio playback error message
    const isPlaybackErrorMessagePresent =
      (await homePage
        .getRadioCard()
        .getByTestId("radio-card-playback-error")
        .count()) === 1
    if (isPlaybackErrorMessagePresent) {
      // skip assertion on play button as playback error happened for this test run
      await expect(
        homePage.getRadioCard().getByTestId("radio-card-playback-error")
      ).toHaveText(
        /The media could not be loaded. Server failed or the playback format is not supported/
      )
      test.fail(true, "Station could not be loaded for audio metadata test")
    }

    if (isMobile) {
      const mobilePlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-mobile-play-button")
      await expect(mobilePlayButton).toHaveAttribute("mediapaused")
      await mobilePlayButton.click()

      const mobilePauseButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-mobile-play-button")
      await expect(mobilePauseButton).not.toHaveAttribute("mediapaused")
      await mobilePauseButton.click()
    } else {
      const desktopPlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-desktop-play-button")
      await expect(desktopPlayButton).toHaveAttribute("mediapaused")
      await desktopPlayButton.click()

      const desktopPauseButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-desktop-play-button")
      await expect(desktopPauseButton).not.toHaveAttribute("mediapaused")
      await desktopPauseButton.click()
    }
    const audioMetadata = await homePage.getRadioCardPlayerAudioMetadata()
    expect(audioMetadata).toMatchObject({
      title: stationWithNoLocationLatLng.name,
      artist: "Xtal Radio",
      album: "Live Radio Stream",
      // artwork is not tested currently, will be removed for artwork with non https urls
    })
  })

  test("should not display error message for radio station with HLS .m3u8 audio source", async ({
    homePage,
  }) => {
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [stationWithHlsAudioM3u8]
        await route.fulfill({ json })
      })
    await homePage
      .getPage()
      .route(stationWithHlsAudioM3u8.url_resolved, async (route) => {
        await route.fulfill({ status: 200 })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithHlsAudioM3u8.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByTestId("radio-card-playback-error")
    ).not.toBeVisible()
  })

  test("get random station with blocked access HTTP 403 should display error message", async ({
    homePage,
    isMobile,
  }) => {
    // mock radio browser api with any query params
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [stationWithBlockedAccess]
        await route.fulfill({ json })
      })
    await homePage
      .getPage()
      .route(stationWithBlockedAccess.url_resolved, async (route) => {
        await route.fulfill({ status: 403 })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithBlockedAccess.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("link", {
        name: stationWithBlockedAccess.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByText(stationWithBlockedAccess.country, {
        exact: true,
      })
    ).toBeVisible()
    if (isMobile) {
      const mobilePlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-mobile-play-button")
      await expect(mobilePlayButton).not.toBeVisible()
    } else {
      const desktopPlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-desktop-play-button")
      await expect(desktopPlayButton).not.toBeVisible()
    }
    await expect(
      homePage.getRadioCard().getByTestId("radio-card-playback-error")
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByTestId("radio-card-playback-error")
    ).toHaveText(
      /The media could not be loaded. Server failed or the playback format is not supported/
    )
  })

  test("random station with multiple tags should have visible audio player component", async ({
    homePage,
    isMobile,
  }) => {
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [stationWithMultipleTags]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithMultipleTags.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("link", {
        name: stationWithMultipleTags.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByText(stationWithMultipleTags.country, {
        exact: true,
      })
    ).toBeVisible()
    if (isMobile) {
      const mobilePlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-mobile-play-button")
      await expect(mobilePlayButton).toHaveAttribute("mediapaused")
      await expect(mobilePlayButton).toBeInViewport()
    } else {
      const desktopPlayButton = homePage
        .getRadioCardPlayer()
        .getByTestId("audio-player-desktop-play-button")
      await expect(desktopPlayButton).toHaveAttribute("mediapaused")
      await expect(desktopPlayButton).toBeInViewport()
    }
  })

  test("random station with bitrate information displays bitrate on card", async ({
    homePage,
  }) => {
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()
    await expect(
      homePage.getRadioCard().getByText(`${unitedStatesStation.bitrate} kbps`, {
        exact: true,
      })
    ).toBeVisible()
  })

  test.describe("station tag", () => {
    test("station with tag longer than 50 characters are removed", async ({
      homePage,
    }) => {
      test.slow()
      const tags = [
        "test tag",
        "a".repeat(51),
        "b".repeat(50),
        "c".repeat(49),
      ].join(",")
      await homePage
        .getPage()
        .route("*/**/json/stations/search?*", async (route) => {
          const json = [{ ...unitedStatesStation, tags }]
          await route.fulfill({ json })
        })
      await homePage.goto()
      await homePage.clickRandomRadioStationButton()
      await expect(
        homePage.getRadioCardTags().getByText("test tag")
      ).toBeVisible()
      await expect(
        homePage.getRadioCardTags().getByText("a".repeat(51))
      ).not.toBeVisible()
      await expect(
        homePage.getRadioCardTags().getByText("b".repeat(50))
      ).toBeVisible()
      await expect(
        homePage.getRadioCardTags().getByText("c".repeat(49))
      ).toBeVisible()

      await homePage.getPage().waitForTimeout(3000)
    })

    test("station with tag of only whitespace are removed", async ({
      homePage,
    }) => {
      const tags = ["    ", " ", "test tag"].join(",")
      await homePage
        .getPage()
        .route("*/**/json/stations/search?*", async (route) => {
          const json = [{ ...unitedStatesStation, tags }]
          await route.fulfill({ json })
        })
      await homePage.goto()
      await homePage.clickRandomRadioStationButton()
      await expect(
        homePage.getRadioCardTags().getByText("test tag")
      ).toBeVisible()
      await expect(
        homePage.getRadioCardTags().getByText(" ", { exact: true })
      ).not.toBeVisible()
      await expect(
        homePage.getRadioCardTags().getByText("    ", { exact: true })
      ).not.toBeVisible()
    })
  })
})
