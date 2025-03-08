import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import {
  assertToastMessage,
  assertToastMessageIsMissing,
  clickRandomRadioStationButton,
  getRadioCardMapPopup,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { stationWithLocationLatLng, unitedStatesStation } from "./mocks/station"
import { getClipboardContent } from "./constants/shareStationConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("share radio station feature", () => {
  function getRadioCardShareIcon(page: Page) {
    return getRadioCardMapPopup(page).locator(".station-card-share-icon")
  }
  async function getRadioStationShareUrl(page: Page, stationuuid: string) {
    const shareUrl =
      (await page.evaluate(() => window.location.href)) +
      "radio-station/" +
      stationuuid
    return shareUrl
  }

  test("should show share icon on radio station card displayed on Map", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(getRadioCardShareIcon(page)).toBeVisible()
  })

  test("should copy share radio station link to clipboard", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardShareIcon(page).click()
    const expectedUrl = await getRadioStationShareUrl(
      page,
      unitedStatesStation.stationuuid
    )
    await assertToastMessage(page, "Link Copied")
    expect(await getClipboardContent(page)).toBe(expectedUrl)
  })

  test("should show toast success message when share radio station link is copied successfully", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardShareIcon(page).click()
    await assertToastMessage(page, "Link Copied")
  })

  test("should load radio station when share radio station link is used", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const requestUrl = route.request().url()
      if (
        requestUrl.includes(
          `json/stations/byuuid?uuids=${unitedStatesStation.stationuuid}`
        )
      ) {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      }
    })
    await page.goto(HOMEPAGE)
    const shareUrl = await getRadioStationShareUrl(
      page,
      unitedStatesStation.stationuuid
    )
    await page.goto(shareUrl)
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
  })

  test("should not copy nested route '/radio-station/' when copying a new radio station share link", async ({
    page,
  }) => {
    // 1) Then user navigates to route /radio-station and loads a radio station
    // 2) Tries to search for a new random radio station
    // 3) Click on the share link for the new radio station
    // 4) The share link for the new radio station should not be invalid (nested)
    // e.g. station A uuid = d1a54d2e-623e-4970-ab11-35f7b56c5ec3
    // station B uuid = f37830fa-76d3-4b85-addb-f3548e6d08ea
    // navigate to http://localhost:5173/radio-station/d1a54d2e-623e-4970-ab11-35f7b56c5ec3
    // share link should not be http://localhost:5173/radio-station/d1a54d2e-623e-4970-ab11-35f7b56c5ec3radio-station/f37830fa-76d3-4b85-addb-f3548e6d08ea
    await page.route("*/**/json/stations/search?*", async (route) => {
      const requestUrl = route.request().url()
      if (
        requestUrl.includes(
          `json/stations/byuuid?uuids=${unitedStatesStation.stationuuid}`
        )
      ) {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      } else {
        const json = [stationWithLocationLatLng]
        await route.fulfill({ json })
      }
    })
    await page.goto(
      HOMEPAGE + `/radio-station/${unitedStatesStation.stationuuid}`
    )
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await clickRandomRadioStationButton(page)
    await getRadioCardShareIcon(page).click()

    await assertToastMessage(page, "Link Copied")
    await assertToastMessageIsMissing(page, "Link Copied")
    await assertToastMessageIsMissing(page, "Found a new station!")
    await assertToastMessageIsMissing(page, "Could not play radio station")
    const expectedUrl =
      new URL(await page.evaluate(() => window.location.href)).origin +
      `/radio-station/${stationWithLocationLatLng.stationuuid}`
    expect(await getClipboardContent(page)).toBe(expectedUrl)
  })

  test.describe("should not redirect to 404 page for valid stationuuid UUID Versions 1 to 5 in Radio Station Share URL", () => {
    test("stationuuid UUID Version 1 should not redirect to 404 page", async ({
      page,
    }) => {
      const stationuuid = "960a2547-e2e4-11e9-a8ba-52543be04c81"
      await page.route(
        `*/**/json/stations/byuuid?uuids=${stationuuid}`,
        async (route) => {
          const json = [{ ...unitedStatesStation, stationuuid }]
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/radio-station/" + stationuuid)
      await expect(page.getByText("404 Not Found")).not.toBeVisible()
      await expect(
        getRadioCardMapPopup(page).getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 2 should not redirect to 404 page", async ({
      page,
    }) => {
      const stationuuid = "960a2547-e2e4-21e9-a8ba-52543be04c81"
      await page.route(
        `*/**/json/stations/byuuid?uuids=${stationuuid}`,
        async (route) => {
          const json = [{ ...unitedStatesStation, stationuuid }]
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/radio-station/" + stationuuid)
      await expect(page.getByText("404 Not Found")).not.toBeVisible()
      await expect(
        getRadioCardMapPopup(page).getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 3 should not redirect to 404 page", async ({
      page,
    }) => {
      const stationuuid = "960a2547-e2e4-31e9-a8ba-52543be04c81"
      await page.route(
        `*/**/json/stations/byuuid?uuids=${stationuuid}`,
        async (route) => {
          const json = [{ ...unitedStatesStation, stationuuid }]
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/radio-station/" + stationuuid)
      await expect(page.getByText("404 Not Found")).not.toBeVisible()
      await expect(
        getRadioCardMapPopup(page).getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 4 should not redirect to 404 page", async ({
      page,
    }) => {
      const stationuuid = "db93a00f-9191-46ab-9e87-ec9b373b3eee"
      await page.route(
        `*/**/json/stations/byuuid?uuids=${stationuuid}`,
        async (route) => {
          const json = [{ ...unitedStatesStation, stationuuid }]
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/radio-station/" + stationuuid)
      await expect(page.getByText("404 Not Found")).not.toBeVisible()
      await expect(
        getRadioCardMapPopup(page).getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 5 should not redirect to 404 page", async ({
      page,
    }) => {
      const stationuuid = "b79cb3ba-745e-5d9a-8903-4a02327a7e09"
      await page.route(
        `*/**/json/stations/byuuid?uuids=${stationuuid}`,
        async (route) => {
          const json = [{ ...unitedStatesStation, stationuuid }]
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/radio-station/" + stationuuid)
      await expect(page.getByText("404 Not Found")).not.toBeVisible()
      await expect(
        getRadioCardMapPopup(page).getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })
  })

  test("should redirect to 404 page when invalid UUID V4 radio station share url stationuuid is present in the url", async ({
    page,
  }) => {
    // radio browser api currently uses UUID V4 for the "stationuuid" field
    await page.goto(HOMEPAGE + "/radio-station/invalidStationuuid")
    await expect(page.getByText("404 Not Found")).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
    expect(page.url(), "should match url ending with '/404'").toMatch(/\/404$/)
  })

  test("should redirect to 404 page when empty stationuuid is given", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE + "/radio-station/")
    await expect(page.getByText("404 Not Found")).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
    expect(
      page.url(),
      "should match url ending with '/radio-station/'"
    ).toMatch(/\/radio-station\/$/)
  })
})
