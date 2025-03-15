import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  getNavbarPodcastLink,
  getNavbarRadioLink,
  getRadioCardMapPopup,
  HOMEPAGE,
} from "./constants/homepageConstants"
import {
  stationWithBlockedAccess,
  stationWithMultipleTags,
  stationWithNoLocationLatLng,
  unitedStatesStation,
} from "./mocks/station"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

async function assertMobileAudioPlayButtonIsMissing(page: Page) {
  const element = getRadioCardMapPopup(page).getByTestId(
    "audio-player-mobile-play-button"
  )
  await expect(element).not.toBeVisible()
}

async function assertDesktopAudioPlayButtonIsMissing(page: Page) {
  const element = getRadioCardMapPopup(page).getByTestId(
    "audio-player-desktop-play-button"
  )
  await expect(element).not.toBeVisible()
}

async function getMobileAudioPlayButton(page: Page) {
  const element = getRadioCardMapPopup(page).getByTestId(
    "audio-player-mobile-play-button"
  )
  await expect(element).toHaveAttribute("mediapaused")
  return element
}

async function getDesktopAudioPlayButton(page: Page) {
  const element = getRadioCardMapPopup(page).getByTestId(
    "audio-player-desktop-play-button"
  )
  await expect(element).toHaveAttribute("mediapaused")
  return element
}

async function getMobileAudioPauseButton(page: Page) {
  const element = getRadioCardMapPopup(page).getByTestId(
    "audio-player-mobile-play-button"
  )
  await expect(element).not.toHaveAttribute("mediapaused")
  return element
}

async function getDesktopAudioPauseButton(page: Page) {
  const element = getRadioCardMapPopup(page).getByTestId(
    "audio-player-desktop-play-button"
  )
  await expect(element).not.toHaveAttribute("mediapaused")
  return element
}

test("has title", async ({ page }) => {
  await page.goto(HOMEPAGE)
  await expect(page).toHaveTitle(/xtal/)
})

test.describe("header", () => {
  test("has header", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await expect(page.locator("header")).toBeVisible()
  })

  test("has navigation to radio and podcast in header on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(HOMEPAGE)
    await expect(getNavbarRadioLink(page)).toBeVisible()
    await expect(getNavbarPodcastLink(page)).toBeVisible()
  })

  test("should navigate between radio and podcast header nav links on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(HOMEPAGE)
    await expect(page).toHaveTitle(/^xtal$/)

    await getNavbarPodcastLink(page).click()
    await expect(page).toHaveTitle(/^xtal - podcasts$/)
    expect(page.url()).toMatch(/\/podcasts$/)

    await getNavbarRadioLink(page).click()
    await expect(page).toHaveTitle(/^xtal$/)
    expect(page.url()).not.toMatch(/\/podcasts$/)
  })
})

test("has footer", async ({ page }) => {
  await page.goto(HOMEPAGE)
  await expect(page.locator("footer")).toBeVisible()
  await expect(page.locator("footer").getByText("Jeremy_Loh")).toBeVisible()
  await expect(page.locator("#footer-github-link")).toHaveAttribute(
    "href",
    "https://github.com/JeremyLoh/"
  )
})

test.describe("404 Not Found page", () => {
  test("should display 404 Not Found page when invalid url is reached", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE + "/invalid-url")
    await expect(page.getByText("404 Not Found")).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
  })

  test("should navigate to homepage when 'Return Home' link is clicked on 404 Not Found page", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE + "/invalid-url")
    await expect(page.getByText("404 Not Found")).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
    await page.getByRole("link", { name: "Return Home", exact: true }).click()
    expect(page.url()).not.toBe("/invalid-url")
  })
})

test.describe("random radio station", () => {
  test("display random station on map", async ({ page, isMobile }) => {
    test.slow()
    // mock radio browser api with any query params
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [stationWithNoLocationLatLng]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(getRadioCardMapPopup(page)).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: stationWithNoLocationLatLng.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("link", {
        name: stationWithNoLocationLatLng.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByText(
        stationWithNoLocationLatLng.country,
        {
          exact: true,
        }
      )
    ).toBeVisible()

    await page.waitForTimeout(1000) // wait for possible radio playback error message
    const isPlaybackErrorMessagePresent =
      (await getRadioCardMapPopup(page)
        .getByTestId("radio-card-playback-error")
        .count()) === 1
    if (isPlaybackErrorMessagePresent) {
      // skip assertion on play button as playback error happened for this test run
      await expect(
        getRadioCardMapPopup(page).getByTestId("radio-card-playback-error")
      ).toHaveText(
        /The media could not be loaded. Server failed or the playback format is not supported/
      )
    } else {
      if (isMobile) {
        await (await getMobileAudioPlayButton(page)).click()
        await (await getMobileAudioPauseButton(page)).click()
      } else {
        await (await getDesktopAudioPlayButton(page)).click()
        await (await getDesktopAudioPauseButton(page)).click()
      }
    }
  })

  test("get random station with blocked access HTTP 403 should display error message", async ({
    page,
    isMobile,
  }) => {
    // mock radio browser api with any query params
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [stationWithBlockedAccess]
      await route.fulfill({ json })
    })
    await page.route(stationWithBlockedAccess.url_resolved, async (route) => {
      await route.fulfill({ status: 403 })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(getRadioCardMapPopup(page)).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: stationWithBlockedAccess.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("link", {
        name: stationWithBlockedAccess.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByText(stationWithBlockedAccess.country, {
        exact: true,
      })
    ).toBeVisible()
    if (isMobile) {
      await assertMobileAudioPlayButtonIsMissing(page)
    } else {
      await assertDesktopAudioPlayButtonIsMissing(page)
    }
    await expect(
      getRadioCardMapPopup(page).getByTestId("radio-card-playback-error")
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByTestId("radio-card-playback-error")
    ).toHaveText(
      /The media could not be loaded. Server failed or the playback format is not supported/
    )
  })

  test("random station with multiple tags should have visible audio player component", async ({
    page,
    isMobile,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [stationWithMultipleTags]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    // assert radio card is shown inside map (map has css id of "map")
    await expect(getRadioCardMapPopup(page)).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: stationWithMultipleTags.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("link", {
        name: stationWithMultipleTags.homepage,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByText(stationWithMultipleTags.country, {
        exact: true,
      })
    ).toBeVisible()
    if (isMobile) {
      await expect(await getMobileAudioPlayButton(page)).toBeInViewport()
    } else {
      await expect(await getDesktopAudioPlayButton(page)).toBeInViewport()
    }
  })

  test("random station with bitrate information displays bitrate on card", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(
      getRadioCardMapPopup(page).getByText(
        `${unitedStatesStation.bitrate} kbps`,
        {
          exact: true,
        }
      )
    ).toBeVisible()
  })

  test.describe("station tag", () => {
    function getStationTagContainer(page: Page) {
      return getRadioCardMapPopup(page).locator(".station-card-tag-container")
    }

    test("station with tag longer than 50 characters are removed", async ({
      page,
    }) => {
      const tags = [
        "test tag",
        "a".repeat(51),
        "b".repeat(50),
        "c".repeat(49),
      ].join(",")
      await page.route("*/**/json/stations/search?*", async (route) => {
        const json = [{ ...unitedStatesStation, tags }]
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE)
      await clickRandomRadioStationButton(page)
      await expect(
        getStationTagContainer(page).getByText("test tag")
      ).toBeVisible()
      await expect(
        getStationTagContainer(page).getByText("a".repeat(51))
      ).not.toBeVisible()
      await expect(
        getStationTagContainer(page).getByText("b".repeat(50))
      ).toBeVisible()
      await expect(
        getStationTagContainer(page).getByText("c".repeat(49))
      ).toBeVisible()

      await page.waitForTimeout(3000)
    })

    test("station with tag of only whitespace are removed", async ({
      page,
    }) => {
      const tags = ["    ", " ", "test tag"].join(",")
      await page.route("*/**/json/stations/search?*", async (route) => {
        const json = [{ ...unitedStatesStation, tags }]
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE)
      await clickRandomRadioStationButton(page)
      await expect(
        getStationTagContainer(page).getByText("test tag")
      ).toBeVisible()
      await expect(
        getStationTagContainer(page).getByText(" ", { exact: true })
      ).not.toBeVisible()
      await expect(
        getStationTagContainer(page).getByText("    ", { exact: true })
      ).not.toBeVisible()
    })
  })
})
