import { getAuthTokens, paths, test } from "../../fixture/auth"
import { BrowserContext, expect, Page } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"

test.describe("Profile Podcast History Page /profile/history", () => {
  async function signIntoExistingAccount(
    page: Page,
    existingAccount: { email: string; password: string }
  ) {
    await page.goto(paths.login)
    await page.getByPlaceholder("Email address").fill(existingAccount.email)
    await page.getByPlaceholder("Password").fill(existingAccount.password)
    await page.getByRole("button", { name: /sign in/i }).click()
  }

  async function logoutAccount(page: Page) {
    await page.goto(paths.profile)
    await page.getByRole("button", { name: /logout/i }).click()
  }

  async function assertUserIsAuthenticated(context: BrowserContext) {
    const tokens = await getAuthTokens(context, false)
    expect(tokens.accessToken).toEqual(expect.anything())
    expect(tokens.refreshToken).toEqual(expect.anything())
  }

  test.beforeEach(({ headless }) => {
    test.skip(
      headless,
      "Skip headless test as backend dev server needs to be running as well for tests"
    )
  })

  test.describe("listen history section", () => {
    test("should display zero listen history message for new user", async ({
      page,
      context,
      existingAccount,
    }) => {
      await signIntoExistingAccount(page, existingAccount)
      await expect(page).toHaveURL(paths.home)
      await assertUserIsAuthenticated(context)

      await page.goto(HOMEPAGE + "/profile/history")
      await expect(page.getByText("Podcast Listen History")).toBeVisible()
      await expect(page).toHaveTitle("xtal - profile - history")
      expect(page.url()).toMatch(/\/profile\/history$/)
      await expect(
        page.getByText("Not available. Start listening to some podcasts!")
      ).toBeVisible()

      await logoutAccount(page)
    })

    test("should navigate from profile page to profile history page on history button click", async ({
      page,
      context,
      existingAccount,
    }) => {
      await signIntoExistingAccount(page, existingAccount)
      await expect(page).toHaveURL(paths.home)
      await assertUserIsAuthenticated(context)

      await page.goto(paths.profile)
      await expect(page.getByRole("button", { name: /history/i })).toBeVisible()
      await page.getByRole("button", { name: /history/i }).click()
      await expect(page).toHaveURL(HOMEPAGE + "/profile/history")

      await logoutAccount(page)
    })
  })
})
