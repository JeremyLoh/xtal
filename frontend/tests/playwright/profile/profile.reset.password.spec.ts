import { expect } from "@playwright/test"
import {
  assertUserIsAuthenticated,
  ensureBackendIsRunning,
  logoutAccount,
  paths,
  signIntoExistingAccount,
  test,
} from "../fixture/auth"
import { homePageUrl } from "../constants/paths"

test.describe("Profile Reset Password navigation", () => {
  test.beforeEach(async ({ headless }) => {
    test.skip(
      headless,
      "Skip headless test as backend dev server needs to be running as well for tests"
    )
    try {
      await ensureBackendIsRunning()
    } catch {
      const errorMessage = `backend dev server ("http://localhost:3000/status") should be running for frontend tests - Run 'npm run dev' in the backend/ directory`
      console.error(errorMessage)
      test.skip(
        true,
        "Backend dev server should be running for the following tests"
      )
    }
  })

  test("should navigate to reset password page on profile page reset password button click", async ({
    page,
    context,
    existingAccount,
  }) => {
    await signIntoExistingAccount(page, existingAccount)
    await expect(page).toHaveURL(paths.home)
    await assertUserIsAuthenticated(context)

    await page.goto(paths.profile)
    await expect(
      page.getByRole("button", { name: /reset password/i })
    ).toBeVisible()
    await page.getByRole("button", { name: /reset password/i }).click()
    await expect(page).toHaveURL(homePageUrl() + "/auth/reset-password")
    await expect(
      page.getByText("Reset your password", { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(/we will send you an email to reset your password/i, {
        exact: true,
      })
    ).toBeVisible()
    await expect(page.getByRole("button", { name: /email me/i })).toBeVisible()

    await logoutAccount(page)
  })
})
