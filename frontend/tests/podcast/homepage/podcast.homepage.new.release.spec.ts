import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import {
  fiveJapaneseNewReleasePodcasts,
  fiveNewReleasePodcasts,
} from "../../mocks/podcast.new.release"
import {
  assertNewReleasePodcasts,
  clickFirstNewReleasePodcastTitleLink,
} from "../../constants/podcast/newRelease/podcastNewReleaseConstants"
import { podcastDetailPageUrl } from "../../constants/paths"

test.describe("New Release Podcasts Section on Podcast Homepage /podcasts", () => {
  test("should display five new release podcasts section", async ({
    podcastHomePage,
  }) => {
    const exclude = "description"
    const limit = "5"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
        async (route) => {
          const json = fiveNewReleasePodcasts
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await expect(podcastHomePage.getNewReleaseSubtitle()).toBeVisible()
    await assertNewReleasePodcasts(podcastHomePage, fiveNewReleasePodcasts.data)
  })

  test("should navigate to podcast detail page when podcast title link is clicked", async ({
    podcastHomePage,
  }) => {
    const firstPodcast = fiveNewReleasePodcasts.data[0]
    if (firstPodcast.title == null) {
      throw new Error("Invalid first podcast data with title of null")
    }
    const podcastTitle = firstPodcast.title
    const podcastId = firstPodcast.id
    const expectedPodcastDetailUrl = podcastDetailPageUrl({
      podcastId: `${podcastId}`,
      podcastTitle,
    })
    const exclude = "description"
    const limit = "5"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
        async (route) => {
          const json = fiveNewReleasePodcasts
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await clickFirstNewReleasePodcastTitleLink(
      podcastHomePage,
      firstPodcast.title
    )
    await expect(podcastHomePage.getPage()).toHaveURL(expectedPodcastDetailUrl)
  })

  test("should display no new releases found message and refresh button when zero recent podcasts are fetched", async ({
    podcastHomePage,
  }) => {
    const exclude = "description"
    const limit = "5"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
        async (route) => {
          const json = []
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await expect(
      podcastHomePage.getErrorMessage(
        "Zero recent podcasts found. Please try again later"
      )
    ).toBeVisible()
    await expect(podcastHomePage.getNewReleaseRefreshButton()).toBeVisible()
  })

  test("should refresh new release podcasts when refresh new release podcast button is clicked", async ({
    podcastHomePage,
  }) => {
    test.slow()
    let shouldFetchData = false
    let routeCalled = false
    const exclude = "description"
    const limit = "5"
    await podcastHomePage
      .getPage()
      .route(
        `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
        async (route) => {
          routeCalled = true
          const json = shouldFetchData ? fiveNewReleasePodcasts : []
          await route.fulfill({ json })
        }
      )
    await podcastHomePage.goto()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await expect(
      podcastHomePage.getErrorMessage(
        "Zero recent podcasts found. Please try again later"
      )
    ).toBeVisible()
    await expect(podcastHomePage.getNewReleaseRefreshButton()).toBeVisible()

    // fix flaky headless test - wait required before changing shouldFetchData variable
    await expect.poll(() => routeCalled, { timeout: 3000 }).toBe(true)
    await podcastHomePage.getPage().waitForLoadState("networkidle")
    shouldFetchData = true
    await podcastHomePage.getNewReleaseRefreshButton().click()
    await expect(podcastHomePage.getNewReleaseHeader()).toBeVisible()
    await assertNewReleasePodcasts(podcastHomePage, fiveNewReleasePodcasts.data)
  })

  test.describe("language filter", () => {
    test("should display language filter default of 'All'", async ({
      podcastHomePage,
    }) => {
      const exclude = "description"
      const limit = "5"
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
          async (route) => {
            const json = fiveNewReleasePodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toBeVisible()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        "all"
      )
    })

    test("should display language filter options", async ({
      podcastHomePage,
      headless,
    }) => {
      test.skip(
        headless,
        "Skip slow headless test due to <select> being disabled for some time on each change"
      )
      test.slow()
      const languageFilterOptions = [
        "en",
        "zh",
        "zh-cn",
        "zh-tw",
        "es",
        "hi",
        "pt",
        "bn",
        "ja",
        "vi",
        "tr",
        "mr",
        "fr",
        "id",
        "ur",
        "de",
        "ar",
        "ms",
        "tl",
        "th",
        "ko",
        "it",
        "sv",
        "pl",
        "ta",
        "cy",
      ]
      const exclude = "description"
      const limit = "5"
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
          async (route) => {
            const json = []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}&lang=*`,
          async (route) => {
            const json = []
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toBeVisible()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        "all"
      )
      for (const languageOption of languageFilterOptions) {
        await podcastHomePage
          .getNewReleaseLanguageFilter()
          .selectOption(languageOption)
        await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
          languageOption
        )
      }
    })

    test("should change new release podcasts based on language", async ({
      podcastHomePage,
    }) => {
      test.slow()
      const exclude = "description"
      const limit = "5"
      const expectedLanguage = "ja"
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
          async (route) => {
            const json = fiveNewReleasePodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}&lang=${expectedLanguage}`,
          async (route) => {
            const json = fiveJapaneseNewReleasePodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toBeVisible()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        "all"
      )
      await assertNewReleasePodcasts(
        podcastHomePage,
        fiveNewReleasePodcasts.data
      )

      await podcastHomePage
        .getNewReleaseLanguageFilter()
        .selectOption(expectedLanguage)
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        expectedLanguage
      )
      await assertNewReleasePodcasts(
        podcastHomePage,
        fiveJapaneseNewReleasePodcasts.data
      )
    })

    test("should allow user to change from a language filter to none (show all languages)", async ({
      podcastHomePage,
    }) => {
      test.slow()
      const exclude = "description"
      const limit = "5"
      const expectedLanguage = "ja"
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}`,
          async (route) => {
            const json = fiveNewReleasePodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage
        .getPage()
        .route(
          `*/**/api/podcast/recent?limit=${limit}&exclude=${exclude}&lang=${expectedLanguage}`,
          async (route) => {
            const json = fiveJapaneseNewReleasePodcasts
            await route.fulfill({ json })
          }
        )
      await podcastHomePage.goto()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toBeVisible()
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        "all"
      )
      await assertNewReleasePodcasts(
        podcastHomePage,
        fiveNewReleasePodcasts.data
      )

      await podcastHomePage
        .getNewReleaseLanguageFilter()
        .selectOption(expectedLanguage)
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        expectedLanguage
      )
      await assertNewReleasePodcasts(
        podcastHomePage,
        fiveJapaneseNewReleasePodcasts.data
      )

      await podcastHomePage.getNewReleaseLanguageFilter().selectOption("all")
      await expect(podcastHomePage.getNewReleaseLanguageFilter()).toHaveValue(
        "all"
      )
      await assertNewReleasePodcasts(
        podcastHomePage,
        fiveNewReleasePodcasts.data
      )
    })
  })
})
