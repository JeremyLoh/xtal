import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { assertToastMessageIsMissing } from "./constants/toasterConstants"
import {
  cantoneseStation,
  stationWithMultipleTags,
  unitedStatesStation,
} from "./mocks/station"
import { getClipboardContent } from "./constants/clipboardConstants"
import HomePage from "./pageObjects/HomePage"

test.describe("radio station favourite feature", () => {
  async function clearBrowserStorage(homePage: HomePage) {
    // must be done after page goto() call (after page opened)
    // clear browser localStorage used for saving favourite stations
    await homePage.getPage().evaluate(() => window.localStorage.clear())
    await homePage.getPage().evaluate(() => window.sessionStorage.clear())
  }

  async function assertEmptyFavouriteList(homePage: HomePage) {
    await expect(
      homePage.getDrawer().locator(".empty-favourites")
    ).toContainText("No Favourites Yet")
    await expect(
      homePage.getDrawer().locator(".empty-favourites")
    ).toContainText("Start by adding a new station")
  }

  test("hover on favourited station's favourite icon on radio station card changes color", async ({
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
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    // move mouse away from the favourite icon to check the default fill color
    await homePage.getPage().mouse.move(0, 0)
    await expect(
      homePage.getRadioCardFavouriteIcon(),
      "should have non-hover radio card favourite icon yellow fill color"
    ).toHaveCSS("fill", "rgb(250, 204, 21)")
    await homePage.getRadioCardFavouriteIcon().hover()
    await expect(
      homePage.getRadioCardFavouriteIcon(),
      "should have hover radio card favourite icon red fill color"
    ).toHaveCSS("fill", "rgb(220, 38, 38)")
  })

  test("hover on non-favourite station's favourite icon does not change color", async ({
    homePage,
  }) => {
    const NO_FILL_COLOR = "rgb(24, 12, 21)"
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    // move mouse away from the favourite icon to check the default fill color
    await homePage.getPage().mouse.move(0, 0)
    await expect(
      homePage.getRadioCardFavouriteIcon(),
      "should have non-hover radio card favourite icon no fill color"
    ).toHaveCSS("fill", NO_FILL_COLOR)
    await homePage.getRadioCardFavouriteIcon().hover()
    await expect(
      homePage.getRadioCardFavouriteIcon(),
      "should have hover radio card favourite icon no fill color"
    ).toHaveCSS("fill", NO_FILL_COLOR)
  })

  test("favourite icon on radio station card toggles on click", async ({
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
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    homePage.getRadioCardFavouriteIcon()
    await expect(homePage.getRadioCardFavouriteIcon()).toBeVisible()
    await expect(homePage.getRadioCardFavouriteIcon()).not.toHaveClass(
      /selected/
    )
    await homePage.clickRadioCardFavouriteIcon()
    await expect(homePage.getRadioCardFavouriteIcon()).toHaveClass(/selected/)
  })

  test("display empty favourite stations drawer when favourite station button is clicked", async ({
    homePage,
  }) => {
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.openFavouriteStationsDrawer()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(homePage.getDrawerTitle()).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(homePage)
  })

  test("display one favourite station in drawer", async ({ homePage }) => {
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.openFavouriteStationsDrawer()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(homePage.getDrawerTitle()).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(homePage)
    await homePage.closeDrawer()

    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await homePage.openFavouriteStationsDrawer()

    await expect(
      homePage.getDrawer().locator(".favourite-station")
    ).toBeVisible()
    await expect(
      homePage.getDrawer().locator(".favourite-station")
    ).toContainText(unitedStatesStation.name)
    await expect(
      homePage.getDrawer().locator(".favourite-station .station-card-icon")
    ).toBeVisible()
    await expect(
      homePage
        .getDrawer()
        .locator(".favourite-station .station-card-tag-container")
    ).toBeVisible()
    await expect(
      homePage.getDrawer().locator(".favourite-station .station-card-country")
    ).toBeVisible()
    await expect(
      homePage
        .getDrawer()
        .locator(".favourite-station .station-card-favourite-icon.selected")
    ).toBeVisible()

    // check hover color for remove favourite station button (do not hover in button center, where icon is)
    await homePage
      .getDrawer()
      .locator(".favourite-station .remove-favourite-station-button")
      .hover({ position: { x: 5, y: 2 } })
    await expect(
      homePage
        .getDrawer()
        .locator(".favourite-station .station-card-favourite-icon.selected"),
      "should have hover remove favourite icon red fill color"
    ).toHaveCSS("fill", "rgb(220, 38, 38)")
  })

  test("click radio station share button should copy correct radio station share url", async ({
    homePage,
  }) => {
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await homePage.openFavouriteStationsDrawer()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage
      .getDrawer()
      .locator(".favourite-station .station-card-share-icon")
      .click()
    const expectedUrl =
      (await homePage.getPage().evaluate(() => window.location.href)) +
      "radio-station/" +
      unitedStatesStation.stationuuid
    expect(await getClipboardContent(homePage.getPage())).toBe(expectedUrl)
  })

  test("remove one favourited station in drawer when favourite icon in drawer is clicked", async ({
    homePage,
    headless,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    test.slow()
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.openFavouriteStationsDrawer()
    await expect(homePage.getDrawer()).toBeVisible()
    await expect(homePage.getDrawer().locator(".drawer-title")).toHaveText(
      "Favourite Stations"
    )
    await assertEmptyFavouriteList(homePage)
    await homePage.closeDrawer()

    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await homePage.openFavouriteStationsDrawer()
    await expect(
      homePage.getDrawer().locator(".favourite-station")
    ).toBeVisible()
    await expect(
      homePage.getDrawer().locator(".favourite-station")
    ).toContainText(unitedStatesStation.name)
    await expect(
      homePage
        .getDrawer()
        .locator(".favourite-station .station-card-favourite-icon.selected")
    ).toBeVisible()

    // wait for toasts to disappear (blocks the favourite icon on mobile view)
    await assertToastMessageIsMissing(
      homePage.getPage(),
      "Could not play radio station"
    )

    await homePage
      .getDrawer()
      .locator(".favourite-station .station-card-favourite-icon.selected")
      .click()
    await assertEmptyFavouriteList(homePage)

    // assert that closing and opening the drawer shows an empty favourite station list
    await homePage.closeDrawer()
    await expect(homePage.getRadioCardFavouriteIcon()).not.toHaveClass(
      /selected/
    )
    await homePage.openFavouriteStationsDrawer()
    await assertEmptyFavouriteList(homePage)
  })

  test("allow selection of a favourite station and display it on the map", async ({
    homePage,
  }) => {
    test.slow()
    let requestCount = 1
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        if (requestCount === 1) {
          requestCount++
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        } else {
          const json = [stationWithMultipleTags]
          await route.fulfill({ json })
        }
      })
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    // load another radio station on the map that is different from the first station
    await homePage.clickRandomRadioStationButton()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: stationWithMultipleTags.name,
        exact: true,
      })
    ).toBeVisible()
    // load first station from favourite stations drawer
    await homePage.openFavouriteStationsDrawer()
    // wait for toasts to disappear (blocks the favourite icon on mobile view)
    await assertToastMessageIsMissing(
      homePage.getPage(),
      "Could not play radio station"
    )
    await homePage
      .getDrawer()
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(homePage.getDrawer()).not.toBeVisible()
    await expect(homePage.getRadioCard()).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("link", {
        name: unitedStatesStation.homepage,
        exact: true,
      })
    ).toBeVisible()
  })

  test("removing favourite station Map popup using 'x' button and loading same favourite station using favourite station drawer shows same station on Map", async ({
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
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()

    await homePage.clickRadioCardCloseButton()
    await expect(
      homePage.getRadioCard(),
      "should remove radio station card from Map"
    ).not.toBeVisible()
    await homePage.openFavouriteStationsDrawer()

    // wait for toasts to disappear (blocks the favourite icon on mobile view)
    await homePage.getPage().waitForTimeout(500)
    await assertToastMessageIsMissing(
      homePage.getPage(),
      "Could not play radio station"
    )

    await homePage
      .getDrawer()
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(
      homePage.getRadioCard(),
      "should display same favourite station on the Map"
    ).toBeVisible()
    await expect(
      homePage.getRadioCard().getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
  })

  test("placeholder icon shows up for station with empty favicon", async ({
    homePage,
  }) => {
    await homePage
      .getPage()
      .route("*/**/json/stations/search?*", async (route) => {
        const json = [{ ...unitedStatesStation, favicon: "" }]
        await route.fulfill({ json })
      })
    await homePage.goto()
    await clearBrowserStorage(homePage)
    await homePage.clickRandomRadioStationButton()
    await homePage.clickRadioCardFavouriteIcon()
    await expect(
      homePage.getRadioCard().locator(".station-card-icon")
    ).toBeVisible()
    // open the favourite station drawer, and assert placeholder icon is shown
    await homePage.openFavouriteStationsDrawer()
    await expect(
      homePage.getDrawer().locator(".station-card-icon")
    ).toBeVisible()
    await expect(
      homePage.getDrawer().locator(".station-card-icon title")
    ).toHaveText("Icon Not Available")
  })

  test.describe("favourite station filters", () => {
    async function assertFavouriteStationName(
      homePage: HomePage,
      stationName: string
    ) {
      await expect(
        homePage
          .getDrawer()
          .locator(".favourite-station")
          .getByText(stationName, { exact: true })
      ).toBeVisible()
    }

    async function assertMissingFavouriteStationName(
      homePage: HomePage,
      stationName: string
    ) {
      await expect(
        homePage
          .getDrawer()
          .locator(".favourite-station")
          .getByText(stationName, { exact: true })
      ).not.toBeVisible()
    }

    test("should filter favourite station by name", async ({ homePage }) => {
      test.slow()
      const nameFilter = unitedStatesStation.name.toLowerCase()
      let requestCount = 1
      await homePage
        .getPage()
        .route("*/**/json/stations/search?*", async (route) => {
          if (requestCount === 1) {
            requestCount++
            const json = [unitedStatesStation]
            await route.fulfill({ json })
          } else {
            const json = [stationWithMultipleTags]
            await route.fulfill({ json })
          }
        })
      await homePage.goto()
      await clearBrowserStorage(homePage)
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()
      requestCount = 2
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()

      await homePage.openFavouriteStationsDrawer()

      await assertFavouriteStationName(homePage, unitedStatesStation.name)
      await assertFavouriteStationName(homePage, stationWithMultipleTags.name)

      await expect(
        homePage.getPage().locator(".favourite-station-filter-container")
      ).toBeVisible()
      await homePage.getPage().getByLabel("Name").fill(nameFilter)

      await assertMissingFavouriteStationName(
        homePage,
        stationWithMultipleTags.name
      )
      // assert filtered station is present after other station is removed
      await assertFavouriteStationName(homePage, unitedStatesStation.name)
    })

    test("should filter favourite station by country", async ({ homePage }) => {
      test.slow()
      const countryFilter = unitedStatesStation.countrycode
      let requestCount = 1
      await homePage
        .getPage()
        .route("*/**/json/stations/search?*", async (route) => {
          if (requestCount === 1) {
            requestCount++
            const json = [unitedStatesStation]
            await route.fulfill({ json })
          } else {
            const json = [cantoneseStation]
            await route.fulfill({ json })
          }
        })
      await homePage.goto()
      await clearBrowserStorage(homePage)
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()
      requestCount = 2
      await homePage.clickRandomRadioStationButton()
      await homePage.clickRadioCardFavouriteIcon()

      await homePage.openFavouriteStationsDrawer()
      await assertFavouriteStationName(homePage, unitedStatesStation.name)
      await assertFavouriteStationName(homePage, cantoneseStation.name)

      await expect(
        homePage.getPage().locator(".favourite-station-filter-container")
      ).toBeVisible()
      await homePage.getPage().getByLabel("Country").selectOption(countryFilter)
      await assertMissingFavouriteStationName(homePage, cantoneseStation.name)
      await assertFavouriteStationName(homePage, unitedStatesStation.name)

      // remove country filter and all stations should be displayed again
      await homePage.getPage().getByLabel("Country").selectOption("")
      await assertFavouriteStationName(homePage, unitedStatesStation.name)
      await assertFavouriteStationName(homePage, cantoneseStation.name)
    })
  })
})
