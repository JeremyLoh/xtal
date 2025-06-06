import { expect, Page } from "@playwright/test"
import {
  assertUserIsAuthenticated,
  ensureBackendIsRunning,
  paths,
  signIntoExistingAccount,
  test,
} from "../fixture/auth"
import { defaultTenPodcastEpisodes } from "../mocks/podcast.episode"
import { homePageUrl, podcastDetailPageUrl } from "../constants/paths"

test.describe("Profile Follow Podcast", () => {
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

  function getFollowPodcastButton(page: Page) {
    return page.locator(".podcast-info-card-follow-button")
  }

  test("should allow logged in user to follow and unfollow a podcast on podcast detail page", async ({
    page,
    context,
    existingAccount,
  }) => {
    test.slow()
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        const json = defaultTenPodcastEpisodes
        await route.fulfill({ json })
      }
    )
    await signIntoExistingAccount(page, existingAccount)
    await expect(page).toHaveURL(paths.home)
    await assertUserIsAuthenticated(context)

    await page.goto(podcastDetailPageUrl({ podcastId, podcastTitle }))
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    await expect(getFollowPodcastButton(page)).toBeVisible()
    const followButtonText = await getFollowPodcastButton(page).innerText()
    if (followButtonText === "Followed") {
      // reset the follow state
      await getFollowPodcastButton(page).click()
    }
    await expect(getFollowPodcastButton(page)).toHaveText("Follow")
    await getFollowPodcastButton(page).click()
    await expect(getFollowPodcastButton(page)).toHaveText("Followed")

    await page.reload()
    await expect(getFollowPodcastButton(page)).toHaveText("Followed")

    await getFollowPodcastButton(page).click()
    await expect(getFollowPodcastButton(page)).toHaveText("Follow")

    await page.reload()
    await expect(getFollowPodcastButton(page)).toHaveText("Follow")
  })

  test("should allow logged in user to see followed podcasts on profile page", async ({
    page,
    context,
    existingAccount,
  }) => {
    test.slow()
    const podcastTitle = "Batman University"
    const podcastId = "75075"
    const limit = 10
    await page.route(
      `*/**/api/podcast/episodes?id=${podcastId}&limit=${limit}`,
      async (route) => {
        const json = defaultTenPodcastEpisodes
        await route.fulfill({ json })
      }
    )
    await signIntoExistingAccount(page, existingAccount)
    await expect(page).toHaveURL(paths.home)
    await assertUserIsAuthenticated(context)

    await page.goto(podcastDetailPageUrl({ podcastId, podcastTitle }))
    await expect(page).toHaveTitle(/Batman University - xtal - podcasts/)
    await expect(getFollowPodcastButton(page)).toBeVisible()
    const followButtonText = await getFollowPodcastButton(page).innerText()
    if (followButtonText === "Followed") {
      // reset the follow state
      await getFollowPodcastButton(page).click()
    }
    await expect(getFollowPodcastButton(page)).toHaveText("Follow")
    await getFollowPodcastButton(page).click()
    await expect(getFollowPodcastButton(page)).toHaveText("Followed")

    await page.goto(paths.profile)
    await expect(page).toHaveURL(paths.profile)
    await expect(
      page.getByRole("button", { name: /followed podcasts/i })
    ).toBeVisible()
    await page.getByRole("button", { name: /followed podcasts/i }).click()
    await expect(page).toHaveURL(homePageUrl() + "/profile/following")

    // ensure /profile/following page displays the followed podcast
    await expect(
      page.getByRole("heading", { name: "Profile Following", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Followed Podcasts", exact: true })
    ).toBeVisible()
    await expect(page.getByText(podcastTitle)).toBeVisible()

    // remove podcast follow as part of cleanup
    await page.goto(podcastDetailPageUrl({ podcastId, podcastTitle }))
    await expect(getFollowPodcastButton(page)).toHaveText("Followed")
    await getFollowPodcastButton(page).click()
    await expect(getFollowPodcastButton(page)).toHaveText("Follow")
  })
})
