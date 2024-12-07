import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants"
import { unitedStatesStation } from "./mocks/station"

test.describe("search drawer for finding radio stations", () => {
  test.beforeEach(({ headless }) => {
    test.skip(headless, "UI element does not does not work in headless mode")
  })

  function getSearchStationButton(page: Page) {
    return page.getByRole("button", { name: "search stations" })
  }
  function getDrawerContainer(page: Page) {
    return page.locator(".drawer-background-container")
  }
  function getDrawerComponent(page: Page) {
    return page.locator(".drawer")
  }
  function getDrawerDragButton(page: Page) {
    return page.locator(".drawer-drag-button")
  }
  function getDrawerCloseButton(page: Page) {
    return page.locator(".drawer-close-button")
  }
  function getRadioCardPopup(page: Page) {
    return page.locator("#map .radio-card")
  }

  test("display drawer after search button click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await expect(getSearchStationButton(page)).toBeVisible()
    await getSearchStationButton(page).click()
    await expect(getSearchStationButton(page)).toHaveClass(/selected/)
    await expect(getDrawerComponent(page)).toBeVisible()
  })

  test.describe("radio station search form", () => {
    function getForm(page: Page) {
      return getDrawerComponent(page).locator(
        ".drawer-content .station-search-form"
      )
    }
    function getSingleStationResultCard(page: Page) {
      return getDrawerComponent(page).locator(".station-search-result-card")
    }

    test("display drawer with radio station search form", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await expect(
        getDrawerComponent(page).locator(".drawer-title")
      ).toHaveText("Station Search")
      await expect(getForm(page)).toBeVisible()
    })

    test("empty name should not be allowed for radio station search form", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getForm(page).getByLabel("Search By Name").fill("")
      await getForm(page).locator("button[type='submit']").click()
      await expect(
        getDrawerComponent(page).getByText("Station Name is required")
      ).toBeVisible()
    })

    test("name more than 255 characters should not be allowed for radio station search form", async ({
      page,
    }) => {
      const count = 256
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getForm(page).getByLabel("Search By Name").fill("a".repeat(count))
      await getForm(page).locator("button[type='submit']").click()
      await expect(
        getDrawerComponent(page).getByText(
          "Station Name cannot be longer than 255 characters"
        )
      ).toBeVisible()
    })

    test("search radio station for name shows one entry in drawer", async ({
      page,
    }) => {
      const stationName = "vinyl hd"
      await page.route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getForm(page).getByLabel("Search By Name").fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
      await expect(getSingleStationResultCard(page)).toBeVisible()
      const expectedTextInStationResultCard = [
        unitedStatesStation.name,
        unitedStatesStation.bitrate.toString(),
        ...unitedStatesStation.tags.split(",").slice(0, 8), // first 8 station tags are shown
        unitedStatesStation.country,
      ]
      for (const expectedText of expectedTextInStationResultCard) {
        await expect(
          getSingleStationResultCard(page).getByText(expectedText)
        ).toBeVisible()
      }
      await expect(
        getSingleStationResultCard(page).getByRole("button", {
          name: "load station",
        })
      ).toBeVisible()
    })

    test("click on drawer load station button for radio station result card loads station on map", async ({
      page,
    }) => {
      const stationName = "vinyl hd"
      await page.route("*/**/json/stations/search?*", async (route) => {
        const json = [unitedStatesStation]
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE)
      await getSearchStationButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getForm(page).getByLabel("Search By Name").fill(stationName)
      await getForm(page).locator("button[type='submit']").click()
      await expect(getSingleStationResultCard(page)).toBeVisible()
      await getSingleStationResultCard(page)
        .getByRole("button", {
          name: "load station",
        })
        .click()
      await expect(getDrawerComponent(page)).not.toBeVisible()
      await expect(getRadioCardPopup(page)).toBeVisible()
      await expect(
        page.locator("#map .radio-card").getByRole("heading", {
          name: unitedStatesStation.name,
          exact: true,
        })
      ).toBeVisible()
      await expect(
        page.locator("#map .radio-card").getByRole("link", {
          name: unitedStatesStation.homepage,
          exact: true,
        })
      ).toBeVisible()
    })
  })

  test("close drawer when close icon is clicked", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerCloseButton(page).click()
    await expect(getDrawerComponent(page)).not.toBeVisible()
  })

  test("close drawer on outside drawer click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerComponent(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerContainer(page).click({ position: { x: 0, y: 0 } })
    await expect(getDrawerComponent(page)).not.toBeVisible()
  })

  test("does not close drawer on small drag down of less than 100px", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerDragButton(page).hover()
    const dragButtonBounds = (await getDrawerDragButton(page).boundingBox())!
    await page.mouse.down()
    await page.mouse.move(
      0,
      dragButtonBounds.y + dragButtonBounds.height / 2 + 51
    )
    await page.mouse.up()
    await expect(getDrawerComponent(page)).toBeVisible()
  })

  test("close drawer on drag down of more than 100px", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await getSearchStationButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerDragButton(page).hover()
    const dragButtonBounds = (await getDrawerDragButton(page).boundingBox())!
    await page.mouse.down()
    await page.mouse.move(
      0,
      dragButtonBounds.y + dragButtonBounds.height / 2 + 270
    )
    await page.mouse.up()
    await expect(getDrawerComponent(page)).not.toBeVisible()
  })
})
