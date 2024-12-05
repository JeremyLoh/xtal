import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants"

test.describe("search drawer for finding radio stations", () => {
  function getSearchFilterButton(page: Page) {
    return page.getByRole("button", { name: "search filters" })
  }
  function getDrawerContainer(page: Page) {
    return page.locator(".drawer-background-container")
  }
  function getDrawerComponent(page: Page) {
    return page.locator(".drawer")
  }

  test("display drawer after search button click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await expect(getSearchFilterButton(page)).toBeVisible()
    await getSearchFilterButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
  })

  test("close drawer on outside drawer click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await getSearchFilterButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerComponent(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerContainer(page).click({ position: { x: 0, y: 0 } })
    await expect(getDrawerComponent(page)).not.toBeVisible()
  })
})
