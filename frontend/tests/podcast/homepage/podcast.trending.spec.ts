import { test } from "../../fixture/test"
import dayjs from "dayjs"
import { expect } from "@playwright/test"
import {
  defaultTenTrendingPodcasts,
  tenArtTrendingPodcasts,
  threeTrendingPodcasts,
  zeroTrendingPodcasts,
} from "../../mocks/podcast.trending"
import { assertToastMessage } from "../../constants/homepageConstants"
import { podcastDetailPageUrl } from "../../constants/paths"
import PodcastHomePage from "../../pageObjects/PodcastHomePage"

test.describe("Podcast Homepage /podcasts", () => {
  function getPodcastImage(
    podcastHomePage: PodcastHomePage,
    imageName: string
  ) {
    const imageLocator = podcastHomePage
      .getTrendingPodcastCards()
      .getByRole("img", {
        name: imageName,
        exact: true,
      })
    return imageLocator
  }

  test.describe("Trending Podcasts Section", () => {
    test.describe("navigation to podcast detail page", () => {
      test("should navigate to podcast detail page on podcast card image click", async ({
        podcastHomePage,
      }) => {
        await podcastHomePage
          .getPage()
          .route(
            "*/**/api/podcast/trending?limit=10&since=*",
            async (route) => {
              const json = defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          )
        await podcastHomePage.goto()
        await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
        await expect(
          podcastHomePage.getTrendingPodcastSectionContainer()
        ).toBeVisible()
        const podcastIndex = 0
        const podcastData = defaultTenTrendingPodcasts.data[podcastIndex]
        const podcastTitle = podcastData.title
        const podcastId = podcastData.id
        const expectedPodcastDetailUrl = podcastDetailPageUrl({
          podcastId: `${podcastId}`,
          podcastTitle,
        })
        const imageLocator = getPodcastImage(
          podcastHomePage,
          podcastData.title + " podcast image"
        )
        await expect(imageLocator).toBeVisible()
        await imageLocator.click()
        await expect(podcastHomePage.getPage()).toHaveURL(
          expectedPodcastDetailUrl
        )
      })

      test("should have underline text decoration on hover of trending podcast title and description", async ({
        podcastHomePage,
      }) => {
        await podcastHomePage
          .getPage()
          .route(
            "*/**/api/podcast/trending?limit=10&since=*",
            async (route) => {
              const json = defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          )
        await podcastHomePage.goto()
        await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
        await expect(
          podcastHomePage.getTrendingPodcastSectionContainer()
        ).toBeVisible()
        await expect(
          podcastHomePage.getTrendingPodcastCardDetailLink(0),
          "should not have underline text decoration without hover"
        ).not.toHaveCSS("text-decoration", /underline/)
        await podcastHomePage.getTrendingPodcastCardDetailLink(0).hover({
          position: { x: 1, y: 1 },
        })
        await expect(
          podcastHomePage.getTrendingPodcastCardDetailLink(0),
          "should have underline text decoration on hover"
        ).toHaveCSS("text-decoration", /underline/)
      })

      test("should navigate to podcast detail page on click of one trending podcast link", async ({
        podcastHomePage,
      }) => {
        test.slow()
        const podcastTitle = defaultTenTrendingPodcasts.data[0].title
        const podcastId = defaultTenTrendingPodcasts.data[0].id
        const expectedUrl = podcastDetailPageUrl({
          podcastId: `${podcastId}`,
          podcastTitle,
        })
        await podcastHomePage
          .getPage()
          .route(
            "*/**/api/podcast/trending?limit=10&since=*",
            async (route) => {
              const json = defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          )
        await podcastHomePage.goto()
        await expect(podcastHomePage.getPage()).toHaveTitle(/xtal - podcasts/)
        await expect(
          podcastHomePage.getTrendingPodcastSectionContainer()
        ).toBeVisible()
        await podcastHomePage.getTrendingPodcastCardDetailLink(0).click()
        expect(podcastHomePage.getPage().url()).toBe(expectedUrl)
      })
    })

    test("should display desktop view default 10 trending podcasts and remove any duplicate entries", async ({
      podcastHomePage,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      test.slow()
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=10&since=*", async (route) => {
          const json = defaultTenTrendingPodcasts
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await expect(
          podcastHomePage
            .getTrendingPodcastCards()
            .getByText(podcastData.title, { exact: true })
        ).toBeVisible()
        await expect(
          podcastHomePage
            .getTrendingPodcastCards()
            .getByText(podcastData.author, { exact: true })
        ).toBeVisible()

        const imageLocator = getPodcastImage(
          podcastHomePage,
          podcastData.title + " podcast image"
        )
        await expect(imageLocator).toBeVisible()
        expect(
          await imageLocator.getAttribute("width"),
          "should have desktop podcast artwork image width of 200"
        ).toBe("200")
        expect(
          await imageLocator.getAttribute("height"),
          "should have desktop podcast artwork image height of 200"
        ).toBe("200")
      }
    })

    test("should display mobile view default 10 trending podcasts and remove any duplicate entries", async ({
      podcastHomePage,
    }) => {
      test.slow()
      await podcastHomePage
        .getPage()
        .setViewportSize({ width: 360, height: 800 })
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=10&since=*", async (route) => {
          const json = defaultTenTrendingPodcasts
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await expect(
          podcastHomePage
            .getTrendingPodcastCards()
            .getByText(podcastData.title, { exact: true })
        ).toBeVisible()
        await expect(
          podcastHomePage
            .getTrendingPodcastCards()
            .getByText(podcastData.author, { exact: true })
        ).toBeVisible()

        const imageLocator = getPodcastImage(
          podcastHomePage,
          podcastData.title + " podcast image"
        )
        await expect(imageLocator).toBeVisible()
        expect(
          await imageLocator.getAttribute("width"),
          "should have mobile podcast artwork image width of 96"
        ).toBe("96")
        expect(
          await imageLocator.getAttribute("height"),
          "should have mobile podcast artwork image height of 96"
        ).toBe("96")
      }
    })

    test("should have mobile view lazy loaded podcast image from third podcast image onwards", async ({
      podcastHomePage,
      isMobile,
    }) => {
      test.skip(!isMobile, "skip mobile test")
      const lazyLoadedImageStartIndex = 2 // zero based index
      const podcastCount = tenArtTrendingPodcasts.data.length
      expect(
        podcastCount,
        "should have podcast count greater than lazyLoadedImageStartIndex"
      ).toBeGreaterThanOrEqual(lazyLoadedImageStartIndex + 1)
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=10&since=*", async (route) => {
          const json = tenArtTrendingPodcasts
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      for (let i = 0; i < podcastCount; i++) {
        const podcastData = tenArtTrendingPodcasts.data[i]
        const artwork = podcastHomePage
          .getTrendingPodcastCards()
          .nth(i)
          .getByRole("img", {
            name: podcastData.title + " podcast image",
            exact: true,
          })
        if (i < lazyLoadedImageStartIndex) {
          await expect(
            artwork,
            `Artwork ${i + 1} should not have <img> loading='lazy' attribute`
          ).not.toHaveAttribute("loading", "lazy")
        } else {
          await expect(
            artwork,
            `Artwork ${i + 1} should have <img> loading='lazy' attribute`
          ).toHaveAttribute("loading", "lazy")
        }
      }
    })

    test("should have desktop view zero lazy loaded podcast image", async ({
      podcastHomePage,
      isMobile,
    }) => {
      test.skip(isMobile, "skip desktop test")
      test.slow()
      const podcastCount = tenArtTrendingPodcasts.data.length
      expect(
        podcastCount,
        "should have podcast count greater than lazyLoadedImageStartIndex"
      ).toBeGreaterThanOrEqual(1)
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/category", async (route) => {
          const json = []
          await route.fulfill({ json })
        })
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=10&since=*", async (route) => {
          const json = tenArtTrendingPodcasts
          await route.fulfill({ json })
        })
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      for (let i = 0; i < podcastCount; i++) {
        const podcastData = tenArtTrendingPodcasts.data[i]
        const artwork = podcastHomePage
          .getTrendingPodcastCards()
          .nth(i)
          .getByRole("img", {
            name: podcastData.title + " podcast image",
            exact: true,
          })
        await expect(
          artwork,
          `Artwork ${i + 1} should not have <img> loading='lazy' attribute`
        ).not.toHaveAttribute("loading", "lazy")
      }
    })

    test("should display error toast when rate limit is reached", async ({
      podcastHomePage,
    }) => {
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/category", async (route) => {
          // prevent rate limit from getting podcast category
          await route.fulfill({ status: 200 })
        })
      await podcastHomePage
        .getPage()
        .route("*/**/api/podcast/trending?limit=10&since=*", async (route) => {
          await route.fulfill({
            status: 429,
            // headers are missing in the error.response.headers - https://github.com/microsoft/playwright/issues/19788
            headers: {
              "access-control-expose-headers": "retry-after",
              "retry-after": "2",
            },
            body: "Too many requests, please try again later.",
          })
        })
      await podcastHomePage.goto()
      await expect(
        podcastHomePage.getTrendingPodcastSectionContainer()
      ).toBeVisible()
      await assertToastMessage(
        podcastHomePage.getPage(),
        "Rate Limit Exceeded, please try again later"
      )
    })

    test.describe("since select element", () => {
      test("should display <select> that shows the trending podcast 'since' date", async ({
        podcastHomePage,
      }) => {
        await podcastHomePage
          .getPage()
          .route(
            "*/**/api/podcast/trending?limit=10&since=*",
            async (route) => {
              const json = defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          )
        await podcastHomePage.goto()
        await expect(
          podcastHomePage.getTrendingPodcastSectionSinceSelectFilter()
        ).toBeVisible()
        await expect(
          podcastHomePage.getTrendingPodcastSectionSinceSelectFilter()
        ).toHaveValue("3")
      })

      test("should fetch new podcast entries on change to since <select> element of 'last 24 hours'", async ({
        podcastHomePage,
      }) => {
        test.slow()
        const oneDayAgo = dayjs().startOf("day").subtract(1, "days").unix()
        const threeDaysAgo = dayjs().startOf("day").subtract(3, "days").unix()
        let isFirstFetch = true
        await podcastHomePage
          .getPage()
          .route("*/**/api/podcast/category", async (route) => {
            const json = []
            await route.fulfill({ json })
          })
        await podcastHomePage
          .getPage()
          .route(
            `*/**/api/podcast/trending?limit=10&since=${threeDaysAgo}`,
            async (route) => {
              if (isFirstFetch) {
                const json = defaultTenTrendingPodcasts
                await route.fulfill({ json })
              }
            }
          )
        await podcastHomePage
          .getPage()
          .route(
            `*/**/api/podcast/trending?limit=10&since=${oneDayAgo}`,
            async (route) => {
              if (!isFirstFetch) {
                const json = threeTrendingPodcasts
                await route.fulfill({ json })
              }
            }
          )
        await podcastHomePage.goto()
        for (const podcastData of defaultTenTrendingPodcasts.data) {
          await expect(
            podcastHomePage
              .getTrendingPodcastCards()
              .getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }

        isFirstFetch = false
        await podcastHomePage
          .getTrendingPodcastSectionSinceSelectFilter()
          .selectOption("1")
        for (const podcastData of threeTrendingPodcasts.data) {
          await expect(
            podcastHomePage
              .getTrendingPodcastCards()
              .getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }
      })

      test("should fetch new podcast entries on change to since <select> element of 'last week'", async ({
        podcastHomePage,
      }) => {
        test.slow()
        const oneWeekAgo = dayjs().startOf("day").subtract(7, "days").unix()
        const threeDaysAgo = dayjs().startOf("day").subtract(3, "days").unix()
        let isFirstFetch = true
        await podcastHomePage
          .getPage()
          .route(
            `*/**/api/podcast/trending?limit=10&since=${threeDaysAgo}`,
            async (route) => {
              if (isFirstFetch) {
                const json = defaultTenTrendingPodcasts
                await route.fulfill({ json })
              }
            }
          )
        await podcastHomePage
          .getPage()
          .route(
            `*/**/api/podcast/trending?limit=10&since=${oneWeekAgo}`,
            async (route) => {
              if (!isFirstFetch) {
                const json = threeTrendingPodcasts
                await route.fulfill({ json })
              }
            }
          )
        await podcastHomePage.goto()
        for (const podcastData of defaultTenTrendingPodcasts.data) {
          await expect(
            podcastHomePage
              .getTrendingPodcastCards()
              .getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }

        isFirstFetch = false
        await podcastHomePage
          .getTrendingPodcastSectionSinceSelectFilter()
          .selectOption("7")
        for (const podcastData of threeTrendingPodcasts.data) {
          await expect(
            podcastHomePage
              .getTrendingPodcastCards()
              .getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }
      })
    })

    test.describe("empty trending podcast section", () => {
      function getEmptyTrendingPodcastMessage(
        podcastHomePage: PodcastHomePage
      ) {
        return podcastHomePage
          .getTrendingPodcastSectionContainer()
          .getByText("Zero podcasts found. Please try again later", {
            exact: true,
          })
      }
      function getRefreshTrendingPodcastButton(
        podcastHomePage: PodcastHomePage
      ) {
        return podcastHomePage.getTrendingPodcastSectionRefreshButton()
      }

      test("should display empty trending podcast section when no data is available", async ({
        podcastHomePage,
      }) => {
        await podcastHomePage
          .getPage()
          .route(
            "*/**/api/podcast/trending?limit=10&since=*",
            async (route) => {
              const json = zeroTrendingPodcasts
              await route.fulfill({ json })
            }
          )
        await podcastHomePage.goto()
        await expect(
          podcastHomePage.getTrendingPodcastSectionContainer()
        ).toBeVisible()
        await expect(
          getEmptyTrendingPodcastMessage(podcastHomePage)
        ).toBeVisible()
        await expect(
          getRefreshTrendingPodcastButton(podcastHomePage)
        ).toBeVisible()
      })

      test("should refresh empty trending podcast section with new data when refresh trending podcast button is clicked", async ({
        browser,
      }) => {
        test.slow()
        const context = await browser.newContext()
        const page = await context.newPage()
        const podcastHomePage = new PodcastHomePage(page)
        let isDataMissing = true
        await podcastHomePage
          .getPage()
          .route(
            "*/**/api/podcast/trending?limit=10&since=*",
            async (route) => {
              const json = isDataMissing
                ? zeroTrendingPodcasts
                : defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          )
        await podcastHomePage.goto()
        await expect(
          getEmptyTrendingPodcastMessage(podcastHomePage)
        ).toBeVisible()

        await expect(
          getRefreshTrendingPodcastButton(podcastHomePage)
        ).toBeVisible()
        isDataMissing = false
        await getRefreshTrendingPodcastButton(podcastHomePage).click()
        await expect(
          getEmptyTrendingPodcastMessage(podcastHomePage)
        ).not.toBeVisible()
        for (const podcastData of defaultTenTrendingPodcasts.data) {
          await expect(
            podcastHomePage
              .getTrendingPodcastCards()
              .getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }
        await context.close()
      })
    })
  })
})
