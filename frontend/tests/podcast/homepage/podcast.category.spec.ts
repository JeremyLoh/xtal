import test, { expect, Page } from "@playwright/test"
import { allPodcastCategories } from "../../mocks/podcast.category"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"

test.describe("Podcast Homepage /podcasts", () => {
  test.describe("Podcast Categories Section", () => {
    function getRefreshPodcastCategoryButton(page: Page) {
      return page.locator(".podcast-category-container").getByRole("button", {
        name: "refresh podcast categories",
        exact: true,
      })
    }

    async function assertPodcastCategoriesInSlider(
      page: Page,
      podcastCategories: typeof allPodcastCategories
    ) {
      for (const category of podcastCategories.data) {
        await expect(
          page
            .locator(".podcast-category-slider")
            .getByText(category.name, { exact: true }),
          `Podcast category "${category.name}" should be visible`
        ).toBeVisible()
      }
    }

    test("should display podcast categories in slider", async ({ page }) => {
      await page.route("*/**/api/podcast/category", async (route) => {
        const json = allPodcastCategories
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page).toHaveTitle(/xtal - podcasts/)
      await expect(page.locator(".podcast-category-container")).toBeVisible()
      await expect(
        page.locator(".podcast-category-container .podcast-category-title")
      ).toBeVisible()
      await assertPodcastCategoriesInSlider(page, allPodcastCategories)
    })

    test("should display error message and refresh category button when podcast categories cannot be fetched", async ({
      page,
    }) => {
      await page.route("*/**/api/podcast/category", async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page).toHaveTitle(/xtal - podcasts/)
      await expect(
        page
          .locator(".podcast-category-container")
          .getByText(
            "Could not get podcast categories. Please try again later",
            { exact: true }
          )
      ).toBeVisible()
      await expect(getRefreshPodcastCategoryButton(page)).toBeVisible()
      await assertLoadingSpinnerIsMissing(page)
    })

    test("should refresh podcast categories on button click", async ({
      page,
    }) => {
      let shouldFetchData = false
      await page.route("*/**/api/podcast/category", async (route) => {
        const json = shouldFetchData ? allPodcastCategories : []
        await route.fulfill({ json })
      })
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page).toHaveTitle(/xtal - podcasts/)
      await expect(getRefreshPodcastCategoryButton(page)).toBeVisible()

      shouldFetchData = true
      await getRefreshPodcastCategoryButton(page).click()
      await assertPodcastCategoriesInSlider(page, allPodcastCategories)
    })

    test.describe("Select podcast category button", () => {
      test("should redirect to podcast category page", async ({ page }) => {
        const expectedCategoryName = allPodcastCategories.data[0].name
        await page.route("*/**/api/podcast/category", async (route) => {
          const json = allPodcastCategories
          await route.fulfill({ json })
        })
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(page).toHaveTitle(/xtal - podcasts/)
        await page
          .locator(".podcast-category-slider")
          .getByText(expectedCategoryName, { exact: true })
          .click()
        await expect(page).toHaveTitle(
          new RegExp(`xtal - ${expectedCategoryName.toLowerCase()} podcasts`)
        )
      })
    })

    test.describe("podcast category cache data", () => {
      test("should return cache of categories on page refresh after successful first fetch", async ({
        page,
      }) => {
        let shouldFetchData = true
        await page.route("*/**/api/podcast/category", async (route) => {
          const json = shouldFetchData ? allPodcastCategories : []
          await route.fulfill({ json })
        })
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(page).toHaveTitle(/xtal - podcasts/)
        await assertPodcastCategoriesInSlider(page, allPodcastCategories)

        shouldFetchData = false
        await page.reload()
        await assertPodcastCategoriesInSlider(page, allPodcastCategories)
      })
    })
  })
})
