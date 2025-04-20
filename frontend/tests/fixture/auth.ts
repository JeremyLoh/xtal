// https://github.com/ITenthusiasm/svelte-kit-supertokens
// https://github.com/ITenthusiasm/svelte-kit-supertokens/blob/main/e2e/auth.test.ts
import ky from "ky"
import { test as base, expect } from "@playwright/test"
import type { Page, BrowserContext, Cookie } from "@playwright/test"
import type { Tokens } from "../mocks/supertokens/cookieHelpers"
import { HOMEPAGE } from "../constants/homepageConstants"

const paths = Object.freeze({
  home: HOMEPAGE + "/",
  profile: HOMEPAGE + "/profile",
  login: HOMEPAGE + "/auth?show=signin",
  signup: HOMEPAGE + "/auth?show=signup",
  refresh: HOMEPAGE + "/auth/session/refresh",
})

type AuthTokens = {
  [K in Extract<keyof Tokens, "accessToken" | "refreshToken">]: Cookie
}

type Account = {
  email: string
  password: string
}

type TestScopedFixtures = {
  // Playwright's built-in `page` fixture, with a user already authenticated in the application
  pageWithUser: Page
}

type WorkerScopedFixtures = {
  // `email` and `password` details of an already-existing account
  existingAccount: Account
}

async function ensureBackendIsRunning() {
  // auth frontend tests need backend dev server to be running - use /status endpoint to verify backend is running
  const backendStatusEndpoint = "http://localhost:3000/status"
  const errorMessage = `backend dev server ("http://localhost:3000/status") should be running for frontend tests - Run 'npm run dev' in the backend/ directory`
  try {
    await ky.get(backendStatusEndpoint, { retry: 0 })
  } catch (error) {
    // allow for rate limit status (HTTP 429)
    if (error.response && error.response.status === 429) {
      return
    }
    throw new Error(errorMessage)
  }
}

const extendTest = base.extend<TestScopedFixtures, WorkerScopedFixtures>({
  existingAccount: [
    async ({ browser }, use) => {
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
      // set the origin, if it is missing, backend will respond HTTP 401
      const page = await browser.newPage({
        extraHTTPHeaders: {
          origin: "http://localhost:5173",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
        },
      })
      // User Info (existing account)
      // @ts-expect-error @types/process is installed as dev dependency
      const email = process.env.QA_TEST_ACCOUNT_EMAIL
      // @ts-expect-error @types/process is installed as dev dependency
      const password = process.env.QA_TEST_ACCOUNT_PASSWORD
      // login to existing user
      await page.goto(paths.login)
      await page.getByRole("textbox", { name: /email/i }).fill(email)
      await page.getByRole("textbox", { name: /password/i }).fill(password)
      await page.getByRole("button", { name: "SIGN IN", exact: true }).click()
      await page.close()
      // provide worker fixture data
      await use({ email, password })
    },
    { scope: "worker" },
  ],
  async pageWithUser({ browser, context, existingAccount }, use) {
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
    // set the origin, if it is missing, backend will respond HTTP 401
    const page = await browser.newPage({
      extraHTTPHeaders: {
        origin: "http://localhost:5173",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
      },
    })
    await page.goto(paths.login)
    await page
      .getByRole("textbox", { name: /email/i })
      .fill(existingAccount.email)
    await page
      .getByRole("textbox", { name: /password/i })
      .fill(existingAccount.password)
    await page.getByRole("button", { name: "SIGN IN", exact: true }).click()
    await page.waitForURL(paths.home)
    // Expose page after login
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
    // Logout
    await page.goto(paths.profile)
    const logoutButton = page.getByRole("button", { name: /logout/i })
    if (await logoutButton.isVisible()) {
      await logoutButton.click()
      await page.waitForURL(paths.home)
    }
    await expectUserToBeUnauthenticated(context)
  },
})

/**
 * Retrieves the Auth Tokens belonging to the current user in the application (if any exist).
 * @param context The {@link BrowserContext} of the {@link Page} being tested. (Needed to access browser cookies.)
 * @param required When `true` (default), indicates that all Auth Tokens are expected to exist. If any are missing,
 * the function will `throw`.
 */
async function getAuthTokens(
  context: BrowserContext,
  required: false
): Promise<Partial<AuthTokens>>

async function getAuthTokens(
  context: BrowserContext,
  required?: true
): Promise<AuthTokens>

async function getAuthTokens(
  context: BrowserContext,
  required?: boolean
): Promise<AuthTokens | Partial<AuthTokens>> {
  const cookies = await context.cookies()
  const tokens = {
    accessToken: cookies.find((c) => c.name === "sAccessToken"),
    refreshToken: cookies.find((c) => c.name === "sRefreshToken"),
  }
  if (required) {
    expect(tokens.accessToken).toEqual(expect.anything())
    expect(tokens.refreshToken).toEqual(expect.anything())
  }
  return tokens
}

async function expectUserToBeUnauthenticated(
  context: BrowserContext
): Promise<void> {
  const tokens = await getAuthTokens(context, false)
  expect(tokens.accessToken).toBe(undefined)
  expect(tokens.refreshToken).toBe(undefined)
}

async function signIntoExistingAccount(page: Page, existingAccount: Account) {
  await page.goto(paths.login)
  await page.getByPlaceholder("Email address").fill(existingAccount.email)
  await page.getByPlaceholder("Password").fill(existingAccount.password)
  await page.getByRole("button", { name: "SIGN IN", exact: true }).click()
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

export const test = extendTest
export {
  paths,
  signIntoExistingAccount,
  logoutAccount,
  assertUserIsAuthenticated,
  ensureBackendIsRunning,
}
