import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"

test.describe("search station drawer for finding radio stations", () => {
  test.beforeEach(({ headless }) => {
    test.skip(headless, "UI element does not does not work in headless mode")
  })

  test("display drawer after search station button click", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await expect(homePage.getSearchStationButton()).toBeVisible()
    await homePage.getSearchStationButton().click()
    await expect(homePage.getSearchStationButton()).toHaveClass(/selected/)
    await expect(homePage.getDrawer()).toBeVisible()
  })

  test("should remove selected class on genre button when search station button is clicked", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getGenreSearchButton().click()
    await expect(homePage.getGenreSearchButton()).toHaveClass(/selected/)
    await homePage.getSearchStationButton().click()
    await expect(homePage.getGenreSearchButton()).not.toHaveClass(/selected/)
    await expect(homePage.getSearchStationButton()).toHaveClass(/selected/)
  })

  test("should reset selected class to genre button when search station drawer is closed", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getGenreSearchButton().click()
    await expect(homePage.getGenreSearchButton()).toHaveClass(/selected/)
    await homePage.getSearchStationButton().click()
    await expect(homePage.getGenreSearchButton()).not.toHaveClass(/selected/)
    await expect(homePage.getSearchStationButton()).toHaveClass(/selected/)
    await homePage.closeDrawer()
    await expect(homePage.getGenreSearchButton()).toHaveClass(/selected/)
    await expect(
      homePage.getGenreSliderContainer().getByText("All")
    ).toBeVisible()
  })

  test("should remove selected class on countries button when search station button is clicked", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getCountrySearchButton().click()
    await expect(homePage.getCountrySearchButton()).toHaveClass(/selected/)
    await homePage.getSearchStationButton().click()
    await homePage.closeDrawer()
    await expect(homePage.getCountrySearchButton()).not.toHaveClass(/selected/)
    await expect(homePage.getSearchStationButton()).toHaveClass(/selected/)
    await expect(
      homePage.getGenreSliderContainer().getByText("All")
    ).toBeVisible()
    await expect(
      homePage.getGenreSliderContainer().getByText("Alternative")
    ).toBeVisible()
  })

  test("close search station drawer when close icon is clicked", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage.closeDrawer()
    await expect(homePage.getDrawer()).not.toBeVisible()
  })

  test("close search station drawer on outside drawer click", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage.getDrawer().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage
      .getDrawerBackgroundContainer()
      .click({ position: { x: 0, y: 0 } })
    await expect(homePage.getDrawer()).not.toBeVisible()
  })

  test("does not close search station drawer on small drag down of less than 100px", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()

    await homePage.getDrawerDragButton().hover()
    const dragButtonBounds = (await homePage
      .getDrawerDragButton()
      .boundingBox())!
    await homePage.getPage().mouse.down()
    await homePage
      .getPage()
      .mouse.move(0, dragButtonBounds.y + dragButtonBounds.height / 2 + 51)
    await homePage.getPage().mouse.up()
    await expect(homePage.getDrawer()).toBeVisible()
  })

  test("close search station drawer on drag down of more than 100px", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSearchStationButton().click()
    await expect(homePage.getDrawer()).toBeVisible()
    await homePage.getDrawerDragButton().hover()
    const dragButtonBounds = (await homePage
      .getDrawerDragButton()
      .boundingBox())!
    await homePage.getPage().mouse.down()
    await homePage
      .getPage()
      .mouse.move(0, dragButtonBounds.y + dragButtonBounds.height / 2 + 270)
    await homePage.getPage().mouse.up()
    await expect(homePage.getDrawer()).not.toBeVisible()
  })
})
