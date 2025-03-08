import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import {
  assertToastMessageIsMissing,
  clickRandomRadioStationButton,
  getRadioCardMapPopup,
  getRadioStationMapPopupCloseButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import {
  cantoneseStation,
  stationWithMultipleTags,
  unitedStatesStation,
} from "./mocks/station"
import {
  closeFavouriteStationsDrawer,
  getFavouriteStationsButton,
  getFavouriteStationsDrawer,
  getRadioCardFavouriteIcon,
} from "./constants/favouriteStationConstants"
import { getClipboardContent } from "./constants/shareStationConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("radio station favourite feature", () => {
  async function assertEmptyFavouriteList(page: Page) {
    await expect(
      getFavouriteStationsDrawer(page).locator(".empty-favourites")
    ).toContainText("No Favourites Yet")
    await expect(
      getFavouriteStationsDrawer(page).locator(".empty-favourites")
    ).toContainText("Start by adding a new station")
  }

  test("hover on favourited station's favourite icon on radio station card changes color", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteIcon(page).click()
    // move mouse away from the favourite icon to check the default fill color
    await page.mouse.move(0, 0)
    await expect(
      getRadioCardFavouriteIcon(page),
      "should have non-hover radio card favourite icon yellow fill color"
    ).toHaveCSS("fill", "rgb(250, 204, 21)")
    await getRadioCardFavouriteIcon(page).hover()
    await expect(
      getRadioCardFavouriteIcon(page),
      "should have hover radio card favourite icon red fill color"
    ).toHaveCSS("fill", "rgb(220, 38, 38)")
  })

  test("hover on non-favourite station's favourite icon does not change color", async ({
    page,
  }) => {
    const NO_FILL_COLOR = "rgb(24, 12, 21)"
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    // move mouse away from the favourite icon to check the default fill color
    await page.mouse.move(0, 0)
    await expect(
      getRadioCardFavouriteIcon(page),
      "should have non-hover radio card favourite icon no fill color"
    ).toHaveCSS("fill", NO_FILL_COLOR)
    await getRadioCardFavouriteIcon(page).hover()
    await expect(
      getRadioCardFavouriteIcon(page),
      "should have hover radio card favourite icon no fill color"
    ).toHaveCSS("fill", NO_FILL_COLOR)
  })

  test("favourite icon on radio station card toggles on click", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await expect(getRadioCardFavouriteIcon(page)).toBeVisible()
    await expect(getRadioCardFavouriteIcon(page)).not.toHaveClass(/selected/)
    await getRadioCardFavouriteIcon(page).click()
    await expect(getRadioCardFavouriteIcon(page)).toHaveClass(/selected/)
  })

  test("display empty favourite stations drawer when favourite station button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".drawer-title")
    ).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(page)
  })

  test("display one favourite station in drawer", async ({ page }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".drawer-title")
    ).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(page)
    await closeFavouriteStationsDrawer(page)

    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteIcon(page).click()
    await getFavouriteStationsButton(page).click()

    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toContainText(unitedStatesStation.name)
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-icon"
      )
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-tag-container"
      )
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-country"
      )
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-favourite-icon.selected"
      )
    ).toBeVisible()

    // check hover color for remove favourite station button (do not hover in button center, where icon is)
    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station .remove-favourite-station-button")
      .hover({ position: { x: 5, y: 2 } })
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-favourite-icon.selected"
      ),
      "should have hover remove favourite icon red fill color"
    ).toHaveCSS("fill", "rgb(220, 38, 38)")
  })

  test("click radio station share button should copy correct radio station share url", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteIcon(page).click()
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station .station-card-share-icon")
      .click()
    const expectedUrl =
      (await page.evaluate(() => window.location.href)) +
      "radio-station/" +
      unitedStatesStation.stationuuid
    expect(await getClipboardContent(page)).toBe(expectedUrl)
  })

  test("remove one favourited station in drawer when favourite icon in drawer is clicked", async ({
    page,
  }) => {
    test.slow()
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await expect(getFavouriteStationsButton(page)).toBeVisible()
    await getFavouriteStationsButton(page).click()
    await expect(getFavouriteStationsDrawer(page)).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".drawer-title")
    ).toHaveText("Favourite Stations")
    await assertEmptyFavouriteList(page)
    await closeFavouriteStationsDrawer(page)

    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteIcon(page).click()
    await getFavouriteStationsButton(page).click()
    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".favourite-station")
    ).toContainText(unitedStatesStation.name)
    await expect(
      getFavouriteStationsDrawer(page).locator(
        ".favourite-station .station-card-favourite-icon.selected"
      )
    ).toBeVisible()

    // wait for toasts to disappear (blocks the favourite icon on mobile view)
    await assertToastMessageIsMissing(page, "Found a new station!")
    await assertToastMessageIsMissing(page, "Could not play radio station")

    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station .station-card-favourite-icon.selected")
      .click()
    await assertEmptyFavouriteList(page)

    // assert that closing and opening the drawer shows an empty favourite station list
    await closeFavouriteStationsDrawer(page)
    await expect(getRadioCardFavouriteIcon(page)).not.toHaveClass(/selected/)
    await getFavouriteStationsButton(page).click()
    await assertEmptyFavouriteList(page)
  })

  test("allow selection of a favourite station and display it on the map", async ({
    page,
  }) => {
    test.slow()
    let requestCount = 1
    await page.route("*/**/json/stations/search?*", async (route) => {
      if (requestCount === 1) {
        requestCount++
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      } else {
        const json = [stationWithMultipleTags]
        await route.fulfill({ json })
      }
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteIcon(page).click()
    // load another radio station on the map that is different from the first station
    await clickRandomRadioStationButton(page)
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: stationWithMultipleTags.name,
        exact: true,
      })
    ).toBeVisible()

    // load first station from favourite stations drawer
    await getFavouriteStationsButton(page).click()

    // wait for toasts to disappear (blocks the favourite icon on mobile view)
    await assertToastMessageIsMissing(page, "Found a new station!")
    await assertToastMessageIsMissing(page, "Could not play radio station")

    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(getFavouriteStationsDrawer(page)).not.toBeVisible()
    await expect(getRadioCardMapPopup(page)).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("link", {
        name: unitedStatesStation.homepage,
        exact: true,
      })
    ).toBeVisible()
  })

  test("removing favourite station Map popup using 'x' button and loading same favourite station using favourite station drawer shows same station on Map", async ({
    page,
  }) => {
    test.slow()
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(page.locator("#map")).toBeVisible()
    await getRadioCardFavouriteIcon(page).click()
    await getRadioStationMapPopupCloseButton(page).scrollIntoViewIfNeeded()
    await getRadioStationMapPopupCloseButton(page).click()
    await expect(
      getRadioCardMapPopup(page),
      "should remove radio station card from Map"
    ).not.toBeVisible()
    await getFavouriteStationsButton(page).click()

    // wait for toasts to disappear (blocks the favourite icon on mobile view)
    await assertToastMessageIsMissing(page, "Found a new station!")
    await assertToastMessageIsMissing(page, "Could not play radio station")

    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(
      getRadioCardMapPopup(page),
      "should display same favourite station on the Map"
    ).toBeVisible()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
  })

  test("placeholder icon shows up for station with empty favicon", async ({
    page,
  }) => {
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [{ ...unitedStatesStation, favicon: "" }]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await getRadioCardFavouriteIcon(page).click()
    await expect(
      getRadioCardMapPopup(page).locator(".station-card-icon")
    ).toBeVisible()
    // open the favourite station drawer, and assert placeholder icon is shown
    await getFavouriteStationsButton(page).click()
    await expect(
      getFavouriteStationsDrawer(page).locator(".station-card-icon")
    ).toBeVisible()
    await expect(
      getFavouriteStationsDrawer(page).locator(".station-card-icon title")
    ).toHaveText("Icon Not Available")
  })

  test.describe("favourite station filters", () => {
    async function assertFavouriteStationName(page: Page, stationName: string) {
      await expect(
        getFavouriteStationsDrawer(page)
          .locator(".favourite-station")
          .getByText(stationName, { exact: true })
      ).toBeVisible()
    }

    async function assertMissingFavouriteStationName(
      page: Page,
      stationName: string
    ) {
      await expect(
        getFavouriteStationsDrawer(page)
          .locator(".favourite-station")
          .getByText(stationName, { exact: true })
      ).not.toBeVisible()
    }

    test("should filter favourite station by name", async ({ page }) => {
      test.slow()
      const nameFilter = unitedStatesStation.name.toLowerCase()
      let requestCount = 1
      await page.route("*/**/json/stations/search?*", async (route) => {
        if (requestCount === 1) {
          requestCount++
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        } else {
          const json = [stationWithMultipleTags]
          await route.fulfill({ json })
        }
      })
      await page.goto(HOMEPAGE)
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()
      requestCount = 2
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()

      await getFavouriteStationsButton(page).click()

      await assertFavouriteStationName(page, unitedStatesStation.name)
      await assertFavouriteStationName(page, stationWithMultipleTags.name)

      await expect(
        page.locator(".favourite-station-filter-container")
      ).toBeVisible()
      await page.getByLabel("Name").fill(nameFilter)

      await assertMissingFavouriteStationName(
        page,
        stationWithMultipleTags.name
      )
      // assert filtered station is present after other station is removed
      await assertFavouriteStationName(page, unitedStatesStation.name)
    })

    test("should filter favourite station by country", async ({ page }) => {
      test.slow()
      const countryFilter = unitedStatesStation.countrycode
      let requestCount = 1
      await page.route("*/**/json/stations/search?*", async (route) => {
        if (requestCount === 1) {
          requestCount++
          const json = [unitedStatesStation]
          await route.fulfill({ json })
        } else {
          const json = [cantoneseStation]
          await route.fulfill({ json })
        }
      })
      await page.goto(HOMEPAGE)
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()
      requestCount = 2
      await clickRandomRadioStationButton(page)
      await getRadioCardFavouriteIcon(page).click()

      await getFavouriteStationsButton(page).click()
      await assertFavouriteStationName(page, unitedStatesStation.name)
      await assertFavouriteStationName(page, cantoneseStation.name)

      await expect(
        page.locator(".favourite-station-filter-container")
      ).toBeVisible()
      await page.getByLabel("Country").selectOption(countryFilter)
      await assertMissingFavouriteStationName(page, cantoneseStation.name)
      await assertFavouriteStationName(page, unitedStatesStation.name)

      // remove country filter and all stations should be displayed again
      await page.getByLabel("Country").selectOption("")
      await assertFavouriteStationName(page, unitedStatesStation.name)
      await assertFavouriteStationName(page, cantoneseStation.name)
    })
  })
})
