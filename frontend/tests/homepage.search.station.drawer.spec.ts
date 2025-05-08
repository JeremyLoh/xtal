import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import {
  getCountrySearchButton,
  getGenreSearchButton,
  HOMEPAGE,
} from "./constants/homepageConstants"
import {
  closeSearchStationDrawer,
  getSearchStationButton,
  getSearchStationDrawer,
} from "./constants/searchStationConstants"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("search station drawer for finding radio stations", () => {
  test.beforeEach(({ headless }) => {
    test.skip(headless, "UI element does not does not work in headless mode")
  })
  function getDrawerContainer(page: Page) {
    return page.locator(".drawer-background-container")
  }
  function getDrawerDragButton(page: Page) {
    return page.locator(".drawer-drag-button")
  }

  test("display drawer after search station button click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await expect(getSearchStationButton(page)).toBeVisible()
    await getSearchStationButton(page).click()
    await expect(getSearchStationButton(page)).toHaveClass(/selected/)
    await expect(getSearchStationDrawer(page)).toBeVisible()
  })

  test("should remove selected class on genre button when search station button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getGenreSearchButton(page).click()
    await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
    await getSearchStationButton(page).click()
    await expect(getGenreSearchButton(page)).not.toHaveClass(/selected/)
    await expect(getSearchStationButton(page)).toHaveClass(/selected/)
  })

  test("should reset selected class to genre button when search station drawer is closed", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getGenreSearchButton(page).click()
    await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
    await getSearchStationButton(page).click()
    await expect(getGenreSearchButton(page)).not.toHaveClass(/selected/)
    await expect(getSearchStationButton(page)).toHaveClass(/selected/)
    await closeSearchStationDrawer(page)
    await expect(getGenreSearchButton(page)).toHaveClass(/selected/)
    await expect(page.locator(".slider").getByText("All")).toBeVisible()
  })

  test("should remove selected class on countries button when search station button is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getCountrySearchButton(page).click()
    await expect(getCountrySearchButton(page)).toHaveClass(/selected/)
    await getSearchStationButton(page).click()
    await closeSearchStationDrawer(page)
    await expect(getCountrySearchButton(page)).not.toHaveClass(/selected/)
    await expect(getSearchStationButton(page)).toHaveClass(/selected/)
    await expect(
      page.locator(".slider").getByText("United States")
    ).not.toBeVisible()
    await expect(page.locator(".slider").getByText("All")).toBeVisible()
    await expect(page.locator(".slider").getByText("Alternative")).toBeVisible()
  })

  test("close search station drawer when close icon is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await closeSearchStationDrawer(page)
    await expect(getSearchStationDrawer(page)).not.toBeVisible()
  })

  test("close search station drawer on outside drawer click", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getSearchStationDrawer(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getDrawerContainer(page).click({ position: { x: 0, y: 0 } })
    await expect(getSearchStationDrawer(page)).not.toBeVisible()
  })

  test("does not close search station drawer on small drag down of less than 100px", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getDrawerDragButton(page).hover()
    const dragButtonBounds = (await getDrawerDragButton(page).boundingBox())!
    await page.mouse.down()
    await page.mouse.move(
      0,
      dragButtonBounds.y + dragButtonBounds.height / 2 + 51
    )
    await page.mouse.up()
    await expect(getSearchStationDrawer(page)).toBeVisible()
  })

  test("close search station drawer on drag down of more than 100px", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSearchStationButton(page).click()
    await expect(getSearchStationDrawer(page)).toBeVisible()
    await getDrawerDragButton(page).hover()
    const dragButtonBounds = (await getDrawerDragButton(page).boundingBox())!
    await page.mouse.down()
    await page.mouse.move(
      0,
      dragButtonBounds.y + dragButtonBounds.height / 2 + 270
    )
    await page.mouse.up()
    await expect(getSearchStationDrawer(page)).not.toBeVisible()
  })
})
