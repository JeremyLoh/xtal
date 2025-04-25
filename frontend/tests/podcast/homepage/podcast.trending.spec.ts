import dayjs from "dayjs"
import test, { expect, Page } from "@playwright/test"
import {
  defaultTenTrendingPodcasts,
  tenArtTrendingPodcasts,
  threeTrendingPodcasts,
  zeroTrendingPodcasts,
} from "../../mocks/podcast.trending"
import { assertToastMessage, HOMEPAGE } from "../../constants/homepageConstants"
import { assertLoadingSpinnerIsMissing } from "../../constants/loadingConstants"
import {
  getPodcastCardDetailLink,
  getPodcastCards,
} from "../../constants/podcast/trending/podcastTrendingConstants"
import { getSinceSelectFilter } from "../../constants/podcast/pagination/podcastTrendingPagination"

test.describe("Podcast Homepage /podcasts", () => {
  function getPodcastImage(page: Page, imageName: string) {
    const imageLocator = getPodcastCards(page).getByRole("img", {
      name: imageName,
      exact: true,
    })
    return imageLocator
  }

  test.describe("Trending Podcasts Section", () => {
    test.describe("navigation to podcast detail page", () => {
      test("should navigate to podcast detail page on podcast card image click", async ({
        page,
      }) => {
        await page.route(
          "*/**/api/podcast/trending?limit=10&since=*",
          async (route) => {
            const json = defaultTenTrendingPodcasts
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(page).toHaveTitle(/xtal - podcasts/)
        await expect(page.locator(".podcast-trending-container")).toBeVisible()
        const podcastIndex = 0
        const podcastData = defaultTenTrendingPodcasts.data[podcastIndex]
        const podcastTitle = encodeURIComponent(podcastData.title)
        const podcastId = podcastData.id
        const expectedPodcastDetailUrl =
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`
        const imageLocator = getPodcastImage(
          page,
          podcastData.title + " podcast image"
        )
        await expect(imageLocator).toBeVisible()
        await imageLocator.click()
        await expect(page).toHaveURL(expectedPodcastDetailUrl)
      })

      test("should have underline text decoration on hover of trending podcast title and description", async ({
        page,
      }) => {
        await page.route(
          "*/**/api/podcast/trending?limit=10&since=*",
          async (route) => {
            const json = defaultTenTrendingPodcasts
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(page).toHaveTitle(/xtal - podcasts/)
        await expect(page.locator(".podcast-trending-container")).toBeVisible()
        await expect(
          getPodcastCardDetailLink(page, 0),
          "should not have underline text decoration without hover"
        ).not.toHaveCSS("text-decoration", /underline/)
        await getPodcastCardDetailLink(page, 0).hover({
          position: { x: 1, y: 1 },
        })
        await expect(
          getPodcastCardDetailLink(page, 0),
          "should have underline text decoration on hover"
        ).toHaveCSS("text-decoration", /underline/)
      })

      test("should navigate to podcast detail page on click of one trending podcast link", async ({
        page,
      }) => {
        const podcastTitle = encodeURIComponent(
          defaultTenTrendingPodcasts.data[0].title
        )
        const podcastId = defaultTenTrendingPodcasts.data[0].id
        const expectedUrl = HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}`
        await page.route(
          "*/**/api/podcast/trending?limit=10&since=*",
          async (route) => {
            const json = defaultTenTrendingPodcasts
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(page).toHaveTitle(/xtal - podcasts/)
        await expect(page.locator(".podcast-trending-container")).toBeVisible()
        await getPodcastCardDetailLink(page, 0).click()
        expect(page.url()).toBe(expectedUrl)
      })
    })

    test("should display desktop view default 10 trending podcasts and remove any duplicate entries", async ({
      page,
      isMobile,
    }) => {
      if (isMobile) {
        test.skip(isMobile)
        return
      }
      test.slow()
      await page.route(
        "*/**/api/podcast/trending?limit=10&since=*",
        async (route) => {
          const json = defaultTenTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await expect(
          getPodcastCards(page).getByText(podcastData.title, { exact: true })
        ).toBeVisible()
        await expect(
          getPodcastCards(page).getByText(podcastData.author, { exact: true })
        ).toBeVisible()

        const imageLocator = getPodcastImage(
          page,
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
      page,
    }) => {
      test.slow()
      await page.setViewportSize({ width: 360, height: 800 })
      await page.route(
        "*/**/api/podcast/trending?limit=10&since=*",
        async (route) => {
          const json = defaultTenTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      for (const podcastData of defaultTenTrendingPodcasts.data) {
        await expect(
          getPodcastCards(page).getByText(podcastData.title, { exact: true })
        ).toBeVisible()
        await expect(
          getPodcastCards(page).getByText(podcastData.author, { exact: true })
        ).toBeVisible()

        const imageLocator = getPodcastImage(
          page,
          podcastData.title + " podcast image"
        )
        await expect(imageLocator).toBeVisible()
        expect(
          await imageLocator.getAttribute("width"),
          "should have mobile podcast artwork image width of 144"
        ).toBe("144")
        expect(
          await imageLocator.getAttribute("height"),
          "should have mobile podcast artwork image height of 144"
        ).toBe("144")
      }
    })

    test("should have mobile view lazy loaded podcast image from third podcast image onwards", async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, "skip mobile test")
      const lazyLoadedImageStartIndex = 2 // zero based index
      const podcastCount = tenArtTrendingPodcasts.data.length
      expect(
        podcastCount,
        "should have podcast count greater than lazyLoadedImageStartIndex"
      ).toBeGreaterThanOrEqual(lazyLoadedImageStartIndex + 1)
      await page.route(
        "*/**/api/podcast/trending?limit=10&since=*",
        async (route) => {
          const json = tenArtTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      for (let i = 0; i < podcastCount; i++) {
        const podcastData = tenArtTrendingPodcasts.data[i]
        const artwork = getPodcastCards(page)
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
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "skip desktop test")
      const podcastCount = tenArtTrendingPodcasts.data.length
      expect(
        podcastCount,
        "should have podcast count greater than lazyLoadedImageStartIndex"
      ).toBeGreaterThanOrEqual(1)
      await page.route("*/**/api/podcast/category", async (route) => {
        const json = []
        await route.fulfill({ json })
      })
      await page.route(
        "*/**/api/podcast/trending?limit=10&since=*",
        async (route) => {
          const json = tenArtTrendingPodcasts
          await route.fulfill({ json })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      for (let i = 0; i < podcastCount; i++) {
        const podcastData = tenArtTrendingPodcasts.data[i]
        const artwork = getPodcastCards(page)
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
      page,
    }) => {
      await page.route("*/**/api/podcast/category", async (route) => {
        // prevent rate limit from getting podcast category
        await route.fulfill({ status: 200 })
      })
      await page.route(
        "*/**/api/podcast/trending?limit=10&since=*",
        async (route) => {
          await route.fulfill({
            status: 429,
            // headers are missing in the error.response.headers - https://github.com/microsoft/playwright/issues/19788
            headers: {
              "access-control-expose-headers": "retry-after",
              "retry-after": "2",
            },
            body: "Too many requests, please try again later.",
          })
        }
      )
      await page.goto(HOMEPAGE + "/podcasts")
      await expect(page.locator(".podcast-trending-container")).toBeVisible()
      await assertToastMessage(
        page,
        "Rate Limit Exceeded, please try again later"
      )
    })

    test.describe("since select element", () => {
      test("should display <select> that shows the trending podcast 'since' date", async ({
        page,
      }) => {
        await page.route(
          "*/**/api/podcast/trending?limit=10&since=*",
          async (route) => {
            const json = defaultTenTrendingPodcasts
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(getSinceSelectFilter(page)).toBeVisible()
        await expect(getSinceSelectFilter(page)).toHaveValue("3")
        await assertLoadingSpinnerIsMissing(page)
      })

      test("should fetch new podcast entries on change to since <select> element of 'last 24 hours'", async ({
        page,
      }) => {
        test.slow()
        const oneDayAgo = dayjs().startOf("day").subtract(1, "days").unix()
        const threeDaysAgo = dayjs().startOf("day").subtract(3, "days").unix()
        let isFirstFetch = true
        await page.route("*/**/api/podcast/category", async (route) => {
          const json = []
          await route.fulfill({ json })
        })
        await page.route(
          `*/**/api/podcast/trending?limit=10&since=${threeDaysAgo}`,
          async (route) => {
            if (isFirstFetch) {
              const json = defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          }
        )
        await page.route(
          `*/**/api/podcast/trending?limit=10&since=${oneDayAgo}`,
          async (route) => {
            if (!isFirstFetch) {
              const json = threeTrendingPodcasts
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        for (const podcastData of defaultTenTrendingPodcasts.data) {
          await expect(
            getPodcastCards(page).getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }

        isFirstFetch = false
        await getSinceSelectFilter(page).selectOption("1")
        for (const podcastData of threeTrendingPodcasts.data) {
          await expect(
            getPodcastCards(page).getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }
      })

      test("should fetch new podcast entries on change to since <select> element of 'last week'", async ({
        page,
      }) => {
        test.slow()
        const oneWeekAgo = dayjs().startOf("day").subtract(7, "days").unix()
        const threeDaysAgo = dayjs().startOf("day").subtract(3, "days").unix()
        let isFirstFetch = true
        await page.route(
          `*/**/api/podcast/trending?limit=10&since=${threeDaysAgo}`,
          async (route) => {
            if (isFirstFetch) {
              const json = defaultTenTrendingPodcasts
              await route.fulfill({ json })
            }
          }
        )
        await page.route(
          `*/**/api/podcast/trending?limit=10&since=${oneWeekAgo}`,
          async (route) => {
            if (!isFirstFetch) {
              const json = threeTrendingPodcasts
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        for (const podcastData of defaultTenTrendingPodcasts.data) {
          await expect(
            getPodcastCards(page).getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }

        isFirstFetch = false
        await getSinceSelectFilter(page).selectOption("7")
        for (const podcastData of threeTrendingPodcasts.data) {
          await expect(
            getPodcastCards(page).getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }
      })
    })

    test.describe("empty trending podcast section", () => {
      function getEmptyTrendingPodcastMessage(page: Page) {
        return page
          .locator(".podcast-trending-container")
          .getByText("Zero podcasts found. Please try again later", {
            exact: true,
          })
      }
      function getRefreshTrendingPodcastButton(page: Page) {
        return page.locator(".podcast-trending-container").getByRole("button", {
          name: "refresh trending podcasts",
          exact: true,
        })
      }

      test("should display empty trending podcast section when no data is available", async ({
        page,
      }) => {
        await page.route(
          "*/**/api/podcast/trending?limit=10&since=*",
          async (route) => {
            const json = zeroTrendingPodcasts
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(page.locator(".podcast-trending-container")).toBeVisible()
        await expect(getEmptyTrendingPodcastMessage(page)).toBeVisible()
        await expect(getRefreshTrendingPodcastButton(page)).toBeVisible()
        await assertLoadingSpinnerIsMissing(page)
      })

      test("should refresh empty trending podcast section with new data when refresh trending podcast button is clicked", async ({
        browser,
      }) => {
        test.slow()
        const context = await browser.newContext()
        const page = await context.newPage()
        let isDataMissing = true
        await page.route(
          "*/**/api/podcast/trending?limit=10&since=*",
          async (route) => {
            const json = isDataMissing
              ? zeroTrendingPodcasts
              : defaultTenTrendingPodcasts
            await route.fulfill({ json })
          }
        )
        await page.goto(HOMEPAGE + "/podcasts")
        await expect(getEmptyTrendingPodcastMessage(page)).toBeVisible()

        await expect(getRefreshTrendingPodcastButton(page)).toBeVisible()
        isDataMissing = false
        await getRefreshTrendingPodcastButton(page).click()
        await expect(getEmptyTrendingPodcastMessage(page)).not.toBeVisible()
        for (const podcastData of defaultTenTrendingPodcasts.data) {
          await expect(
            getPodcastCards(page).getByText(podcastData.title, { exact: true })
          ).toBeVisible()
        }
        await context.close()
      })
    })
  })
})
