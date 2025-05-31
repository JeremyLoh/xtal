import { expect } from "@playwright/test"
import { HOMEPAGE } from "../constants/homepageConstants.ts"
import { test } from "../fixture/test.ts"
import {
  navigateUsingSidebarMenuItem,
  SidebarMenuItemAction,
} from "../constants/sidebarConstants.ts"

test.describe("profile navigation from homepage", () => {
  test("should allow user navigation to sign up page using sidebar action for anonymous user", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await navigateUsingSidebarMenuItem(
      page,
      SidebarMenuItemAction.ProfileSignUp
    )
    await expect(page.getByText("Sign Up", { exact: true })).toBeVisible()
    expect(page.url()).toMatch(/\/auth\?show=signup$/)
  })

  test("should allow user navigation to sign in page using sidebar action for anonymous user", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await navigateUsingSidebarMenuItem(
      page,
      SidebarMenuItemAction.ProfileSignIn
    )
    await expect(page.getByText("Sign In", { exact: true })).toBeVisible()
    expect(page.url()).toMatch(/\/auth\?show=signin$/)
  })
})
