import {
  assertUserIsAuthenticated,
  ensureBackendIsRunning,
  logoutAccount,
  paths,
  signIntoExistingAccount,
  test,
} from "../../fixture/auth"
import { expect } from "@playwright/test"
import { podcastId_259760_episodeId_34000697601 } from "../../mocks/podcast.episode"
import { assertPodcastEpisodeOnPodcastEpisodeDetailPage } from "../../constants/podcast/detail/podcastDetailConstants"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"
import {
  podcastEpisodeDetailPageUrl,
  profileHistoryPageUrl,
} from "../../constants/paths"

test.describe("Profile Podcast History Page /profile/history", () => {
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

  test.describe("listen history section", () => {
    test("should display zero listen history message for new user", async ({
      page,
      context,
      existingAccount,
    }) => {
      await signIntoExistingAccount(page, existingAccount)
      await expect(page).toHaveURL(paths.home)
      await assertUserIsAuthenticated(context)

      await page.goto(profileHistoryPageUrl())
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
      await expect(
        page.getByRole("button", { name: /profile history/i })
      ).toBeVisible()
      await page.getByRole("button", { name: /profile history/i }).click()
      await expect(page).toHaveURL(profileHistoryPageUrl())

      await logoutAccount(page)
    })

    test("should display one recently played podcast episode on profile history page", async ({
      page,
      context,
      existingAccount,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const podcastEpisodeId = "34000697601"
      const episode = podcastId_259760_episodeId_34000697601.data
      await page.route(
        `*/**/api/podcast/episode?id=${podcastEpisodeId}`,
        async (route) => {
          const json = podcastId_259760_episodeId_34000697601
          await route.fulfill({ json })
        }
      )
      await signIntoExistingAccount(page, existingAccount)
      await expect(page).toHaveURL(paths.home)
      await assertUserIsAuthenticated(context)
      await page.goto(profileHistoryPageUrl())
      // play one podcast episode
      await page.goto(
        podcastEpisodeDetailPageUrl({
          podcastId,
          podcastTitle,
          podcastEpisodeId,
        })
      )
      await assertPodcastEpisodeOnPodcastEpisodeDetailPage(
        page,
        podcastId_259760_episodeId_34000697601
      )
      await expect(
        page.getByRole("button", { name: "Play", exact: true })
      ).toBeVisible()
      await page.getByRole("button", { name: "Play", exact: true }).click()
      await page.waitForTimeout(2000) // wait for player to load and play episode

      // check that it appears in the recent profile history
      await page.goto(profileHistoryPageUrl())
      await expect(
        page.getByText("Not available. Start listening to some podcasts!")
      ).not.toBeVisible()
      await expect(page.getByText(episode.title)).toBeVisible()

      // delete the podcast episode entry as part of test cleanup
      await expect(
        page.getByTestId(
          `profile-history-delete-button-podcast-episode-${episode.id}`
        )
      ).toBeVisible()
      await page
        .getByTestId(
          `profile-history-delete-button-podcast-episode-${episode.id}`
        )
        .click()
      await assertLoadingSpinnerIsMissing(page)
      await expect(page.getByText(episode.title)).not.toBeVisible()

      await logoutAccount(page)
    })
  })
})
