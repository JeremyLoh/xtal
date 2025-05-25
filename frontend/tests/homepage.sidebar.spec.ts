import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { HOMEPAGE } from "./constants/homepageConstants"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"
import {
  getSidebarCloseButton,
  getSidebarElement,
  getSidebarMenuItem,
  getSidebarTitle,
  getSidebarToggleButton,
  SidebarMenuItemAction,
} from "./constants/sidebarConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("Homepage Sidebar", () => {
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

  test("should close sidebar on podcast action click", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    await getSidebarMenuItem(page, SidebarMenuItemAction.Podcasts).click()
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

  test("should display sidebar navigation action links", async ({ page }) => {
    await page.goto(HOMEPAGE)
    await assertLoadingSpinnerIsMissing(page)
    await getSidebarToggleButton(page).click()
    await expect(getSidebarElement(page)).toBeVisible()
    await expect(
      getSidebarMenuItem(page, SidebarMenuItemAction.Radio)
    ).toBeVisible()
    await expect(
      getSidebarMenuItem(page, SidebarMenuItemAction.Podcasts)
    ).toBeVisible()
    await expect(
      getSidebarMenuItem(page, SidebarMenuItemAction.RadioFavouriteStations)
    ).toBeVisible()
    await expect(
      getSidebarMenuItem(page, SidebarMenuItemAction.ProfileSignIn)
    ).toBeVisible()
    await expect(
      getSidebarMenuItem(page, SidebarMenuItemAction.ProfileSignUp)
    ).toBeVisible()
    await expect(
      getSidebarMenuItem(page, SidebarMenuItemAction.About)
    ).toBeVisible()
  })

  test.describe("Profile sidebar actions", () => {
    test("should display sidebar sign in action link for anonymous user", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await assertLoadingSpinnerIsMissing(page)
      await getSidebarToggleButton(page).click()
      await expect(getSidebarElement(page)).toBeVisible()
      await expect(
        getSidebarMenuItem(page, SidebarMenuItemAction.ProfileSignIn)
      ).toBeVisible()
      await getSidebarMenuItem(
        page,
        SidebarMenuItemAction.ProfileSignIn
      ).click()
      await expect(page).toHaveURL(HOMEPAGE + "/auth?show=signin")
    })

    test("should display sidebar sign up action link for anonymous user", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await assertLoadingSpinnerIsMissing(page)
      await getSidebarToggleButton(page).click()
      await expect(getSidebarElement(page)).toBeVisible()
      await expect(
        getSidebarMenuItem(page, SidebarMenuItemAction.ProfileSignUp)
      ).toBeVisible()
      await getSidebarMenuItem(
        page,
        SidebarMenuItemAction.ProfileSignUp
      ).click()
      await expect(page).toHaveURL(HOMEPAGE + "/auth?show=signup")
    })
  })

  test.describe("navigate to page on click", () => {
    test("should navigate to podcast homepage on click of podcast sidebar action link", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await assertLoadingSpinnerIsMissing(page)
      await getSidebarToggleButton(page).click()
      await expect(getSidebarElement(page)).toBeVisible()
      await expect(
        getSidebarMenuItem(page, SidebarMenuItemAction.Podcasts)
      ).toBeVisible()
      await getSidebarMenuItem(page, SidebarMenuItemAction.Podcasts).click()
      await expect(page).toHaveURL(HOMEPAGE + "/podcasts")
    })

    test("should navigate to radio homepage on click of radio sidebar action link", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE + "/podcasts")
      await assertLoadingSpinnerIsMissing(page)
      await getSidebarToggleButton(page).click()
      await expect(getSidebarElement(page)).toBeVisible()
      await expect(
        getSidebarMenuItem(page, SidebarMenuItemAction.Radio)
      ).toBeVisible()
      await getSidebarMenuItem(page, SidebarMenuItemAction.Radio).click()
      await expect(page).toHaveURL(HOMEPAGE)
    })

    test("should navigate to about page on click of about sidebar action link", async ({
      page,
    }) => {
      await page.goto(HOMEPAGE)
      await assertLoadingSpinnerIsMissing(page)
      await getSidebarToggleButton(page).click()
      await expect(getSidebarElement(page)).toBeVisible()
      await expect(
        getSidebarMenuItem(page, SidebarMenuItemAction.About)
      ).toBeVisible()
      await getSidebarMenuItem(page, SidebarMenuItemAction.About).click()
      await expect(page).toHaveURL(HOMEPAGE + "/about")
      await page.waitForLoadState("networkidle")
      await expect(page.getByText("404 Not Found")).not.toBeVisible()
    })
  })
})
