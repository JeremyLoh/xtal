import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import {
  assertToastMessage,
  assertToastMessageIsMissing,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { stationWithLocationLatLng, unitedStatesStation } from "./mocks/station"
import { getClipboardContent } from "./constants/shareStationConstants"
import HomePage from "./pageObjects/HomePage"

test.describe("share radio station feature", () => {
  async function getRadioStationShareUrl(
    homePage: HomePage,
    stationuuid: string
  ) {
    const shareUrl =
      (await homePage.getPage().evaluate(() => window.location.href)) +
      "radio-station/" +
      stationuuid
    return shareUrl
  }

  test("should show share icon on radio station card displayed on Map", async ({
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
    await expect(homePage.getRadioCardShareIcon()).toBeVisible()
  })

  test("should copy share radio station link to clipboard", async ({
    homePage,
  }) => {
    test.slow()
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await homePage.clickRandomRadioStationButton()
    await homePage.getRadioCardShareIcon().click()
    const expectedUrl = await getRadioStationShareUrl(
      homePage,
      unitedStatesStation.stationuuid
    )
    expect(await getClipboardContent(homePage.getPage())).toBe(expectedUrl)
    await assertToastMessage(homePage.getPage(), "Link Copied")
  })

  test("should show toast success message when share radio station link is copied successfully", async ({
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
    await homePage.getRadioCardShareIcon().click()
    await homePage.getPage().waitForTimeout(400)
    await assertToastMessage(homePage.getPage(), "Link Copied")
  })

  test("should load radio station when share radio station link is used", async ({
    homePage,
  }) => {
    test.slow()
    await homePage
      .getPage()
      .route("*/**/json/stations/byuuid?*", async (route) => {
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
    await homePage.goto()
    const shareUrl = await getRadioStationShareUrl(
      homePage,
      unitedStatesStation.stationuuid
    )
    await homePage.getPage().goto(shareUrl, { waitUntil: "domcontentloaded" })
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
  })

  test("should not copy nested route '/radio-station/' when copying a new radio station share link", async ({
    homePage,
    headless,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    test.slow()
    // 1) Then user navigates to route /radio-station and loads a radio station
    // 2) Tries to search for a new random radio station
    // 3) Click on the share link for the new radio station
    // 4) The share link for the new radio station should not be invalid (nested)
    // e.g. station A uuid = d1a54d2e-623e-4970-ab11-35f7b56c5ec3
    // station B uuid = f37830fa-76d3-4b85-addb-f3548e6d08ea
    // navigate to http://localhost:5173/radio-station/d1a54d2e-623e-4970-ab11-35f7b56c5ec3
    // share link should not be http://localhost:5173/radio-station/d1a54d2e-623e-4970-ab11-35f7b56c5ec3radio-station/f37830fa-76d3-4b85-addb-f3548e6d08ea
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        // random station search mock data
        const json = [stationWithLocationLatLng]
        await route.fulfill({ json })
      })
    await homePage
      .getPage()
      .route(
        `*/**/json/stations/byuuid?uuids=${unitedStatesStation.stationuuid}*`,
        async (route) => {
          // specific station search by stationuuid mock data
          const requestUrl = route.request().url()
          if (
            requestUrl.includes(
              `json/stations/byuuid?uuids=${unitedStatesStation.stationuuid}`
            )
          ) {
            const json = [unitedStatesStation]
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )

    await homePage.gotoRadioStationShareUrl(unitedStatesStation.stationuuid)
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await homePage.clickRandomRadioStationButton()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithLocationLatLng.name,
        exact: true,
      })
    ).toBeVisible()
    await homePage.getRadioCardShareIcon().click()

    await assertToastMessage(homePage.getPage(), "Link Copied")
    await assertToastMessageIsMissing(homePage.getPage(), "Link Copied")
    await assertToastMessageIsMissing(
      homePage.getPage(),
      "Could not play radio station"
    )
    const clipboardContent = await getClipboardContent(homePage.getPage())
    const expectedUrl =
      new URL(HOMEPAGE).origin +
      `/radio-station/${stationWithLocationLatLng.stationuuid}`
    expect(clipboardContent).toBe(expectedUrl)
  })

  test.describe("should not redirect to 404 page for valid stationuuid UUID Versions 1 to 5 in Radio Station Share URL", () => {
    test("stationuuid UUID Version 1 should not redirect to 404 page", async ({
      homePage,
    }) => {
      test.slow()
      const stationuuid = "960a2547-e2e4-11e9-a8ba-52543be04c81"
      await homePage
        .getPage()
        .route(
          `*/**/json/stations/byuuid?uuids=${stationuuid}`,
          async (route) => {
            const json = [{ ...unitedStatesStation, stationuuid }]
            await route.fulfill({ json })
          }
        )
      await homePage.gotoRadioStationShareUrl(stationuuid)
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
      await expect(homePage.getRadioCard()).toBeVisible()
      await expect(
        homePage.getRadioCard().getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 2 should not redirect to 404 page", async ({
      homePage,
    }) => {
      test.slow()
      const stationuuid = "960a2547-e2e4-21e9-a8ba-52543be04c81"
      await homePage
        .getPage()
        .route(
          `*/**/json/stations/byuuid?uuids=${stationuuid}`,
          async (route) => {
            const json = [{ ...unitedStatesStation, stationuuid }]
            await route.fulfill({ json })
          }
        )
      await homePage.gotoRadioStationShareUrl(stationuuid)
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
      await expect(homePage.getRadioCard()).toBeVisible()
      await expect(
        homePage.getRadioCard().getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 3 should not redirect to 404 page", async ({
      homePage,
    }) => {
      test.slow()
      const stationuuid = "960a2547-e2e4-31e9-a8ba-52543be04c81"
      await homePage
        .getPage()
        .route(
          `*/**/json/stations/byuuid?uuids=${stationuuid}`,
          async (route) => {
            const json = [{ ...unitedStatesStation, stationuuid }]
            await route.fulfill({ json })
          }
        )
      await homePage.gotoRadioStationShareUrl(stationuuid)
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
      await expect(homePage.getRadioCard()).toBeVisible()
      await expect(
        homePage.getRadioCard().getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 4 should not redirect to 404 page", async ({
      homePage,
    }) => {
      test.slow()
      const stationuuid = "db93a00f-9191-46ab-9e87-ec9b373b3eee"
      await homePage
        .getPage()
        .route(
          `*/**/json/stations/byuuid?uuids=${stationuuid}`,
          async (route) => {
            const json = [{ ...unitedStatesStation, stationuuid }]
            await route.fulfill({ json })
          }
        )
      await homePage.gotoRadioStationShareUrl(stationuuid)
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
      await expect(homePage.getRadioCard()).toBeVisible()
      await expect(
        homePage.getRadioCard().getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })

    test("stationuuid UUID Version 5 should not redirect to 404 page", async ({
      homePage,
    }) => {
      test.slow()
      const stationuuid = "b79cb3ba-745e-5d9a-8903-4a02327a7e09"
      await homePage
        .getPage()
        .route(
          `*/**/json/stations/byuuid?uuids=${stationuuid}`,
          async (route) => {
            const json = [{ ...unitedStatesStation, stationuuid }]
            await route.fulfill({ json })
          }
        )
      await homePage.gotoRadioStationShareUrl(stationuuid)
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
      await expect(homePage.getRadioCard()).toBeVisible()
      await expect(
        homePage.getRadioCard().getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
    })
  })

  test("should redirect to 404 page when invalid UUID V4 radio station share url stationuuid is present in the url", async ({
    homePage,
  }) => {
    // radio browser api currently uses UUID V4 for the "stationuuid" field
    await homePage.gotoRadioStationShareUrl("invalidStationuuid")
    await expect(homePage.getPage().getByText("404 Not Found")).toBeVisible()
    await expect(
      homePage.getPage().getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
    expect(
      homePage.getPage().url(),
      "should match url ending with '/404'"
    ).toMatch(/\/404$/)
  })

  test("should redirect to 404 page when empty stationuuid is given", async ({
    homePage,
  }) => {
    await homePage.gotoRadioStationShareUrl("")
    await expect(homePage.getPage().getByText("404 Not Found")).toBeVisible()
    await expect(
      homePage.getPage().getByRole("link", { name: "Return Home", exact: true })
    ).toBeVisible()
    expect(
      homePage.getPage().url(),
      "should match url ending with '/radio-station/'"
    ).toMatch(/\/radio-station\/$/)
  })
})
