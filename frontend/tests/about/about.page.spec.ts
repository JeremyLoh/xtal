import { expect, Page } from "@playwright/test"
import { test } from "../fixture/test"
import { HOMEPAGE } from "../constants/homepageConstants"

test.describe("About Page", () => {
  async function mockCurrentTotalPodcastStatistics(
    page: Page,
    totalPodcasts: number = 4544812,
    totalPodcastEpisodes: number = 110958837,
    episodesPublishedInLastThirtyDays: number = 352956
  ) {
    await page.route(`*/**/api/podcast/stats/current`, async (route) => {
      const json = {
        totalPodcasts: totalPodcasts,
        totalPodcastEpisodes: totalPodcastEpisodes,
        episodesPublishedInLastThirtyDays: episodesPublishedInLastThirtyDays,
      }
      await route.fulfill({ json })
    })
  }

  test("should display 'Why listen to podcasts / radio' section", async ({
    page,
  }) => {
    await mockCurrentTotalPodcastStatistics(page)
    const expectedCardTexts = [
      "Discover new interests across a large variety of categories",
      "Obtain expert insights and learn on the go",
      "Practice your active listening skills",
      "Experience different cultures and perspectives",
    ]
    await page.goto(HOMEPAGE + "/about")
    await expect(page).toHaveTitle("xtal - about")
    await expect(
      page.getByText(
        "Immerse yourself in the world by exploring podcasts and radio stations from around the world using xtal!"
      )
    ).toBeVisible()
    await expect(page.getByText("Why listen to podcasts/radio?")).toBeVisible()
    for (const expectedText of expectedCardTexts) {
      await expect(
        page
          .locator(".about-section-card")
          .getByText(expectedText, { exact: true })
      ).toBeVisible()
    }
  })

  test("should display creator section", async ({ page }) => {
    await mockCurrentTotalPodcastStatistics(page)
    await page.goto(HOMEPAGE + "/about")
    await expect(page).toHaveTitle("xtal - about")
    await expect(page.getByTestId("jeremy-profile-picture")).toBeVisible()
    await expect(
      page.getByText("👋 Hi, I'm Jeremy Loh (@Jeremy_Loh)")
    ).toBeVisible()
    await expect(
      page.getByText(
        "I'm a Software Engineer who loves Photography. When I'm not programming, you can find me behind a camera!"
      )
    ).toBeVisible()
  })

  test("should display current podcast total statistics", async ({ page }) => {
    const expectedTotalPodcasts = 4544812
    const expectedTotalPodcastEpisodes = 110958837
    const expectedEpisodesPublishedInLastThirtyDays = 352956
    await mockCurrentTotalPodcastStatistics(
      page,
      expectedTotalPodcasts,
      expectedTotalPodcastEpisodes,
      expectedEpisodesPublishedInLastThirtyDays
    )
    await page.goto(HOMEPAGE + "/about")
    await page
      .locator(".about-page-podcast-stats-container")
      .scrollIntoViewIfNeeded()
    await expect(
      page.getByText(`${expectedTotalPodcasts.toLocaleString()} Podcasts`)
    ).toBeVisible()
    await expect(
      page.getByText(
        `${expectedTotalPodcastEpisodes.toLocaleString()} Podcast Episodes`
      )
    ).toBeVisible()
    await expect(
      page.getByText(
        `${expectedEpisodesPublishedInLastThirtyDays.toLocaleString()} New Podcast Episodes in Last 30 Days`
      )
    ).toBeVisible()
  })
})
