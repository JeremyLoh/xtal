import { test } from "../fixture/test.ts"
import { expect } from "@playwright/test"
import { SidebarMenuItemAction } from "../pageComponents/Sidebar.ts"
import HomePage from "../pageObjects/HomePage.ts"

test.describe("profile navigation from homepage", () => {
  async function navigateUsingSidebar(
    homePage: HomePage,
    action: SidebarMenuItemAction
  ) {
    await expect(homePage.getSidebarToggleButton()).toBeVisible()
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await expect(homePage.getSidebarMenuItem(action)).toBeVisible()
    await homePage.getSidebarMenuItem(action).click()
  }

  test("should allow user navigation to sign up page using sidebar action for anonymous user", async ({
    homePage,
  }) => {
    await homePage.goto()
    await navigateUsingSidebar(homePage, SidebarMenuItemAction.ProfileSignUp)
    await expect(
      homePage.getPage().getByText("Sign Up", { exact: true })
    ).toBeVisible()
    expect(homePage.getPage().url()).toMatch(/\/auth\?show=signup$/)
  })

  test("should allow user navigation to sign in page using sidebar action for anonymous user", async ({
    homePage,
  }) => {
    await homePage.goto()
    await navigateUsingSidebar(homePage, SidebarMenuItemAction.ProfileSignIn)
    await expect(
      homePage.getPage().getByText("Sign In", { exact: true })
    ).toBeVisible()
    expect(homePage.getPage().url()).toMatch(/\/auth\?show=signin$/)
  })
})
