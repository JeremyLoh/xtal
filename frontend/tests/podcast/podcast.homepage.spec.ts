import test, { expect } from "@playwright/test"
import { getNavbarRadioLink, HOMEPAGE } from "../constants/homepageConstants"

test.describe("Podcast Homepage /podcasts", () => {
  test("should display title", async ({ page }) => {
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page).toHaveTitle(/xtal - podcasts/)
  })

  test("should navigate back to homepage (/) header navbar radio link is clicked", async ({
    page,
  }) => {
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page).toHaveTitle(/xtal - podcasts/)
    expect(page.url()).toMatch(/\/podcasts$/)
    await getNavbarRadioLink(page).click()
    await expect(page).not.toHaveTitle(/xtal - podcasts/)
    expect(page.url()).not.toMatch(/\/podcasts$/)
  })
})
