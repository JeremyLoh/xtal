import { test } from "../../fixture/test.ts"
import { expect } from "@playwright/test"
import { allPodcastCategories } from "../../mocks/podcast.category"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants.ts"
import PodcastHomePage from "../../pageObjects/PodcastHomePage.ts"

test.describe("Podcast Homepage /podcasts", () => {
  test.describe("Podcast Categories Section", () => {
    async function assertPodcastCategoriesInSlider(
      podcastHomePage: PodcastHomePage,
      podcastCategories: typeof allPodcastCategories
    ) {
      for (const category of podcastCategories.data) {
        await expect(
          podcastHomePage.getPodcastCategorySliderItem(category.name),
          `Podcast category "${category.name}" should be visible`
        ).toBeVisible()
      }
    }

    test("should display podcast categories in slider", async ({
      podcastHomePage,
    }) => {
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/category", async (route) => {
          const json = allPodcastCategories
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
      await expect(podcastHomePage.getPodcastCategoryContainer()).toBeVisible()
      await expect(podcastHomePage.getPodcastCategoryTitle()).toBeVisible()
      await assertPodcastCategoriesInSlider(
        podcastHomePage,
        allPodcastCategories
      )
    })

    test("should display error message and refresh category button when podcast categories cannot be fetched", async ({
      podcastHomePage,
    }) => {
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/category", async (route) => {
          const json = []
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
      await expect(
        podcastHomePage.getErrorMessage(
          "Could not get podcast categories. Please try again later"
        )
      ).toBeVisible()
      await expect(
        podcastHomePage.getPodcastCategoryRefreshButton()
      ).toBeVisible()
    })

    test("should refresh podcast categories on button click", async ({
      browser,
      headless,
    }) => {
      test.skip(headless, "skip flaky headless test")
      test.slow()
      const context = await browser.newContext()
      const page = await context.newPage()
      const podcastHomePage = new PodcastHomePage(page)
      let shouldFetchData = false
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/category", async (route) => {
          const json = shouldFetchData ? allPodcastCategories : []
          await route.fulfill({ json })
        })
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=*", async (route) => {
          // mock trending podcast section data
          const json = []
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
      await expect(
        podcastHomePage.getErrorMessage(
          "Could not get podcast categories. Please try again later"
        )
      ).toBeVisible()
      await assertLoadingSpinnerIsMissing(podcastHomePage.getPage())
      await expect(
        podcastHomePage.getPodcastCategoryRefreshButton()
      ).toBeVisible()

      shouldFetchData = true
      await podcastHomePage.getPodcastCategoryRefreshButton().click()
      await assertPodcastCategoriesInSlider(
        podcastHomePage,
        allPodcastCategories
      )
      await context.close()
    })

    test.describe("Select podcast category button", () => {
      test("should redirect to podcast category page", async ({
        podcastHomePage,
      }) => {
        const expectedCategoryName = allPodcastCategories.data[0].name
        await podcastHomePage
          .getPage()
          .route("*/**/api/podcast/category", async (route) => {
            const json = allPodcastCategories
            await route.fulfill({ json })
          })
        await podcastHomePage.goto()
        await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
        await podcastHomePage
          .getPodcastCategorySliderItem(expectedCategoryName)
          .click()
        await expect(podcastHomePage.getPage()).toHaveTitle(
          new RegExp(`xtal - ${expectedCategoryName.toLowerCase()} podcasts`)
        )
      })
    })

    test.describe("podcast category cache data", () => {
      test("should return cache of categories on page refresh after successful first fetch", async ({
        podcastHomePage,
        headless,
      }) => {
        test.skip(headless, "Remove failing CI test in headless mode")
        test.slow()
        let shouldFetchData = true
        await podcastHomePage
          .getPage()
          .route("*/**/api/podcast/category", async (route) => {
            const json = shouldFetchData ? allPodcastCategories : []
            await route.fulfill({ json })
          })
        await podcastHomePage.goto()
        await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
        await assertPodcastCategoriesInSlider(
          podcastHomePage,
          allPodcastCategories
        )

        shouldFetchData = false
        await podcastHomePage.getPage().reload()
        await assertPodcastCategoriesInSlider(
          podcastHomePage,
          allPodcastCategories
        )
      })
    })
  })
})
