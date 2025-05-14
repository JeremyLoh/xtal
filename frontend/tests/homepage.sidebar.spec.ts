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

  test("should open sidebar on header action toggle sidebar button click", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await expect(getSidebarToggleButton(page)).toBeVisible()
    await expect(getSidebarElement(page)).not.toBeVisible()
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
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
})
