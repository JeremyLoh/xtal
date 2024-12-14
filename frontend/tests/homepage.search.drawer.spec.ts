import test, { expect, Page } from "@playwright/test"
import {
  getCountrySearchButton,
  getDrawerComponent,
  getGenreSearchButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import { getSearchStationButton } from "./constants/stationFormConstants"

test.describe("search drawer for finding radio stations", () => {
  test.beforeEach(({ headless }) => {
    test.skip(headless, "UI element does not does not work in headless mode")
  })
  test.describe("drawer functionality", () => {
    function getDrawerContainer(page: Page) {
      return page.locator(".drawer-background-container")
    }
    function getDrawerDragButton(page: Page) {
      return page.locator(".drawer-drag-button")
    }
    function getDrawerCloseButton(page: Page) {
      return page.locator(".drawer-close-button")
    }

    test("display drawer after search button click", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await expect(getSearchStationButton(page)).toBeVisible()
      await getSearchStationButton(page).click()
      await expect(getSearchStationButton(page)).toHaveClass(/selected/)
      await expect(getDrawerComponent(page)).toBeVisible()
    })

    test("should remove selected class on genre button when search button is clicked", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await getGenreSearchButton(page).click()
      await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
      await getSearchStationButton(page).click()
      await expect(getGenreSearchButton(page)).not.toHaveClass(/selected/)
      await expect(getSearchStationButton(page)).toHaveClass(/selected/)
    })

    test("should reset selected class to genre button when search drawer is closed", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await getGenreSearchButton(page).click()
      await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
      await getSearchStationButton(page).click()
      await expect(getGenreSearchButton(page)).not.toHaveClass(/selected/)
      await expect(getSearchStationButton(page)).toHaveClass(/selected/)
      await getDrawerCloseButton(page).click()
      await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
    })

    test("should remove selected class on countries button when search button is clicked", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await getCountrySearchButton(page).click()
      await expect(getCountrySearchButton(page)).toHaveClass(/selected/)
      await getSearchStationButton(page).click()
      await expect(getCountrySearchButton(page)).not.toHaveClass(/selected/)
      await expect(getSearchStationButton(page)).toHaveClass(/selected/)
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
})
