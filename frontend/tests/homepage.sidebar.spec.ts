import { test } from "./fixture/test"
import { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("Homepage Sidebar", () => {
  function getSidebarToggleButton(page: Page) {
    return page.getByTestId("sidebar-toggle-button")
  }

  function getSidebarElement(page: Page) {
    return page.getByTestId("sidebar")
  }

  function getSidebarCloseButton(page: Page) {
    return page.getByTestId("sidebar-close-button")
  }

  function getSidebarTitle(page: Page) {
    return page.getByTestId("sidebar-title")
  }

  test("should open sidebar on header action toggle sidebar button click", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await expect(getSidebarToggleButton(page)).toBeVisible()
    await expect(getSidebarElement(page)).not.toBeVisible()
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    await expect(getSidebarTitle(page)).toHaveText("Actions")
  })

  test("should close sidebar on header action toggle sidebar button click", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await expect(getSidebarToggleButton(page)).toBeVisible()
    await expect(getSidebarElement(page)).not.toBeVisible()
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).not.toBeVisible()
  })

  test("should close sidebar on sidebar close button click", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    await expect(getSidebarCloseButton(page)).toBeVisible()
    await getSidebarCloseButton(page).click()
    await expect(getSidebarElement(page)).not.toBeVisible()
  })

  test("should close sidebar on click outside sidebar", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    // click outside of sidebar element
    await page.locator("body").click({ position: { x: 1, y: 1 } })
    await expect(getSidebarElement(page)).not.toBeVisible()
  })

  test("should not close sidebar on click inside sidebar", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    await getSidebarTitle(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
  })
})
