import test, { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "./constants"

test.describe("search drawer for finding radio stations", () => {
  test.beforeEach(({ headless }) => {
    test.skip(headless, "UI element does not does not work in headless mode")
  })

  function getSearchFilterButton(page: Page) {
    return page.getByRole("button", { name: "search filters" })
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

  test("display drawer after search button click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await expect(getSearchFilterButton(page)).toBeVisible()
    await getSearchFilterButton(page).click()
    await expect(getSearchFilterButton(page)).toHaveClass(/selected/)
    await expect(getDrawerComponent(page)).toBeVisible()
  })

  test.describe("radio station search form", () => {
    function getForm(page: Page) {
      return getDrawerComponent(page).locator(
        ".drawer-content .station-search-form"
      )
    }

    test("display drawer with radio station search form", async ({ page }) => {
      await page.goto(HOMEPAGE)
      await getSearchFilterButton(page).click()
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
      await getSearchFilterButton(page).click()
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
      await getSearchFilterButton(page).click()
      await expect(getDrawerComponent(page)).toBeVisible()
      await getForm(page).getByLabel("Search By Name").fill("a".repeat(count))
      await getForm(page).locator("button[type='submit']").click()
      await expect(
        getDrawerComponent(page).getByText(
          "Station Name cannot be longer than 255 characters"
        )
      ).toBeVisible()
    })
  })

  test("close drawer when close icon is clicked", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await getSearchFilterButton(page).click()
    await expect(getDrawerComponent(page)).toBeVisible()
    await getDrawerCloseButton(page).click()
    await expect(getDrawerComponent(page)).not.toBeVisible()
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

  test("does not close drawer on small drag down of less than 100px", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await getSearchFilterButton(page).click()
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
    await getSearchFilterButton(page).click()
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
