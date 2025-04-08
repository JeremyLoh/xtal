import { expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../constants/homepageConstants.ts"
import { test } from "../fixture/test.ts"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("profile navigation from homepage", () => {
  function getHeaderProfileRedirectButton(page: Page) {
    return page.getByTestId("profile-redirect-toggle-button")
  }

  test("should redirect user to login sign up page when session is not available", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE)
    await expect(getHeaderProfileRedirectButton(page)).toBeVisible()
    await getHeaderProfileRedirectButton(page).click()
    await expect(page.getByText("Sign Up", { exact: true })).toBeVisible()
    expect(page.url()).toMatch(/\/auth\?show=signup$/)
  })
})
