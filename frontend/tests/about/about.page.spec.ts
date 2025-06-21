import { test } from "../fixture/test"
import { expect, Page } from "@playwright/test"
import { SidebarMenuItemAction } from "../pageComponents/Sidebar"

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
    aboutPage,
  }) => {
    await mockCurrentTotalPodcastStatistics(aboutPage.getPage())
    const expectedCardTexts = [
      "Discover new interests across a large variety of categories",
      "Obtain expert insights and learn on the go",
      "Practice your active listening skills",
      "Experience different cultures and perspectives",
    ]
    await aboutPage.goto()
    await expect(aboutPage.getPage()).toHaveTitle("xtal - about")
    await expect(aboutPage.getIntroText()).toBeVisible()
    await expect(aboutPage.getListenReasonSectionHeader()).toBeVisible()
    for (const expectedText of expectedCardTexts) {
      await expect(
        aboutPage.getListenReasonSectionText(expectedText)
      ).toBeVisible()
    }
  })

  test("should display creator section", async ({ aboutPage }) => {
    await mockCurrentTotalPodcastStatistics(aboutPage.getPage())
    await aboutPage.goto()
    await expect(aboutPage.getPage()).toHaveTitle("xtal - about")
    await expect(aboutPage.getJeremyProfilePicture()).toBeVisible()
    await expect(
      aboutPage.getJeremyIntroText("👋 Hi, I'm Jeremy Loh (@Jeremy_Loh)")
    ).toBeVisible()
    await expect(
      aboutPage.getJeremyIntroText(
        "I'm a Software Engineer who loves Photography. When I'm not programming, you can find me behind a camera!"
      )
    ).toBeVisible()
  })

  test("should display current podcast total statistics", async ({
    aboutPage,
  }) => {
    const expectedTotalPodcasts = 4544812
    const expectedTotalPodcastEpisodes = 110958837
    const expectedEpisodesPublishedInLastThirtyDays = 352956
    await mockCurrentTotalPodcastStatistics(
      aboutPage.getPage(),
      expectedTotalPodcasts,
      expectedTotalPodcastEpisodes,
      expectedEpisodesPublishedInLastThirtyDays
    )
    await aboutPage.goto()
    await aboutPage.getPodcastStatsContainer().scrollIntoViewIfNeeded()
    await expect(
      aboutPage.getPodcastStats(
        `${expectedTotalPodcasts.toLocaleString()} Podcasts`
      )
    ).toBeVisible()
    await expect(
      aboutPage.getPodcastStats(
        `${expectedTotalPodcastEpisodes.toLocaleString()} Podcast Episodes`
      )
    ).toBeVisible()
    await expect(
      aboutPage.getPodcastStats(
        `${expectedEpisodesPublishedInLastThirtyDays.toLocaleString()} New Podcast Episodes in Last 30 Days`
      )
    ).toBeVisible()
    await expect(
      aboutPage.getPodcastStats("— https://podcastindex.org/")
    ).toBeVisible()
  })

  test("should display radio station approximate count", async ({
    aboutPage,
  }) => {
    await mockCurrentTotalPodcastStatistics(aboutPage.getPage())
    await aboutPage.goto()
    await aboutPage.getRadioStationStatsContainer().scrollIntoViewIfNeeded()
    // Approximate radio station count is hard-coded - https://fi1.api.radio-browser.info/#Server_stats
    // Server stats endpoint is available on HTTP endpoint, not on HTTPS
    await expect(
      aboutPage.getRadioStationStats(
        "54805 Radio Stations in 238 Countries — https://www.radio-browser.info/"
      )
    ).toBeVisible()
  })

  test("should display mobile profile picture of correct size on first page load after navigation from another page", async ({
    isMobile,
    homePage,
    aboutPage,
  }) => {
    test.skip(!isMobile, "Skip mobile test")
    await homePage.goto()
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarMenuItem(SidebarMenuItemAction.About).click()

    await expect(aboutPage.getJeremyProfilePicture()).toBeVisible()
    const profilePictureBox = await aboutPage
      .getJeremyProfilePicture()
      .boundingBox()
    expect(profilePictureBox).not.toBeNull()
    const viewport = aboutPage.getPage().viewportSize()
    expect(viewport).not.toBeNull()

    expect(profilePictureBox!.width).toBeLessThan(viewport!.width)
    expect(profilePictureBox!.height).toBe(profilePictureBox!.width)
  })
})
