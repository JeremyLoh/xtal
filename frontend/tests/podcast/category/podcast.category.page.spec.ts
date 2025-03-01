import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { tenArtTrendingPodcasts } from "../../mocks/podcast.trending"

test.describe("Podcast Category Page /podcasts/<category_name>", () => {
  test("should display trending podcasts in category", async ({ page }) => {
    const category = "Arts"
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    expect(page.locator(".podcast-trending-container")).toBeVisible()
    for (let i = 0; i < tenArtTrendingPodcasts.count; i++) {
      const expectedPodcast = tenArtTrendingPodcasts.data[i]
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-artwork")
          .nth(i),
        `(Podcast ${i + 1}) should have artwork present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-title")
          .nth(i)
          .getByText(expectedPodcast.title, { exact: true }),
        `(Podcast ${i + 1}) should have title present`
      ).toBeVisible()
      await expect(
        page
          .locator(".podcast-trending-card-container .podcast-card-author")
          .nth(i)
          .getByText(expectedPodcast.author, { exact: true }),
        `(Podcast ${i + 1}) should have author present`
      ).toBeVisible()
    }
  })

  test("should navigate to podcast homepage (/podcasts) when back button is clicked", async ({
    page,
  }) => {
    const category = "Arts"
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    expect(page.locator(".podcast-trending-container")).toBeVisible()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
    await page.locator(".podcast-category-back-button").click()
    await expect(page).toHaveTitle("xtal - podcasts")
    expect(page.url()).toMatch(/\/podcasts$/)
  })

  test("should navigate to podcast category page when back button on podcast detail page is clicked", async ({
    page,
  }) => {
    const category = "Arts"
    const i = 0
    const expectedPodcastTitle = tenArtTrendingPodcasts.data[i].title
    await page.route(
      `*/**/api/podcast/trending?limit=10&since=*&category=${category}`,
      async (route) => {
        const json = tenArtTrendingPodcasts
        await route.fulfill({ json })
      }
    )
    await page.goto(HOMEPAGE + `/podcasts/${category}`)
    expect(page.locator(".podcast-trending-container")).toBeVisible()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
    await page
      .locator(".podcast-trending-card-container .podcast-card-title")
      .nth(i)
      .getByText(expectedPodcastTitle, { exact: true })
      .click()
    // click of podcast detail back button should redirect user to podcast category page
    await expect(page.locator(".podcast-detail-back-button")).toBeVisible()
    await expect(page).not.toHaveTitle(
      `xtal - ${category.toLowerCase()} podcasts`
    )
    await page.locator(".podcast-detail-back-button").click()
    await expect(page).toHaveTitle(`xtal - ${category.toLowerCase()} podcasts`)
  })
})
