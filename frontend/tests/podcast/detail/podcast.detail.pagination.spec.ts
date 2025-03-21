import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants.ts"
import {
  podcastId_259760_FirstTenEpisodes,
  podcastId_259760_OffsetTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import {
  assertPodcastEpisodes,
  assertPodcastInfo,
} from "../../constants/podcast/detail/podcastDetailConstants.ts"
import {
  getNextPaginationButton,
  getPageNumberElement,
  getPreviousPaginationButton,
  getActivePageNumberElement,
} from "../../constants/podcast/pagination/podcastDetailPagination.ts"

test.describe("Pagination of Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test.describe("Pagination using url parameter '?page=PAGE-NUMBER'", () => {
    test("should display latest ten podcasts for first page", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 1
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          if (
            !requestUrl.includes(`offset=`) &&
            requestUrl.includes(`limit=${limit}`)
          ) {
            // ensure backend api call does not have offset parameter
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
      await expect(page.locator(".podcast-episode-pagination")).toBeVisible()
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      await expect(getNextPaginationButton(page)).toBeVisible()
    })

    test("should display second page of podcast episodes when url param ?page=2 is given", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 2
      const expectedOffset = 10
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          if (
            requestUrl.includes(`offset=${expectedOffset}`) &&
            requestUrl.includes(`limit=${limit}`)
          ) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
      await expect(page.locator(".podcast-episode-pagination")).toBeVisible()
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
      await expect(getNextPaginationButton(page)).toBeVisible()
    })

    test("should not have disabled pagination buttons on second last page", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const expectedTotalEpisodes =
        podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
      const expectedTotalPages = Math.ceil(expectedTotalEpisodes / limit)
      const pageNumber = expectedTotalPages - 1
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          const isSecondLastPageRequest =
            requestUrl.includes(
              `offset=${expectedTotalEpisodes - limit - limit}`
            ) && requestUrl.includes(`limit=${limit}`)

          if (isSecondLastPageRequest) {
            // treat the second last page request as the first ten episode data
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
      await expect(
        getActivePageNumberElement(page, `${pageNumber}`)
      ).toBeVisible()
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
    })
  })

  test.describe("Pagination Pages (display 3 surrounding pages)", () => {
    test.describe("mobile view", () => {
      test.beforeEach(({ isMobile }) => {
        if (!isMobile) {
          test.skip(!isMobile)
        }
      })

      test("should display only current page for mobile view", async ({
        page,
      }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const pageNumber = 1
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            if (
              !requestUrl.includes(`offset=`) &&
              requestUrl.includes(`limit=${limit}`)
            ) {
              // ensure backend api call does not have offset parameter
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(getActivePageNumberElement(page, "1")).toBeVisible()
        await expect(getPageNumberElement(page, "2")).not.toBeVisible()
        await expect(getPageNumberElement(page, "3")).not.toBeVisible()
        await expect(getPageNumberElement(page, "4")).not.toBeVisible()
      })
    })

    test.describe("desktop view", () => {
      test.beforeEach(({ isMobile }) => {
        if (isMobile) {
          test.skip(isMobile)
        }
      })

      test("should navigate to clicked pagination page", async ({ page }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const pageNumber = 1
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            const isFirstPageRequest =
              !requestUrl.includes(`offset=`) &&
              requestUrl.includes(`limit=${limit}`)
            const isThirdPageRequest =
              requestUrl.includes(`offset=20`) &&
              requestUrl.includes(`limit=${limit}`)

            if (isThirdPageRequest) {
              // use offset ten episodes as the third page data
              const json = podcastId_259760_OffsetTenEpisodes
              await route.fulfill({ json })
            } else if (isFirstPageRequest) {
              // ensure backend api call does not have offset parameter
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(getActivePageNumberElement(page, "1")).toBeVisible()
        await expect(getPageNumberElement(page, "2")).toBeVisible()
        await expect(getPageNumberElement(page, "3")).toBeVisible()
        await expect(getPageNumberElement(page, "4")).toBeVisible()

        await getPageNumberElement(page, "3").click()

        await assertPodcastInfo(
          page,
          podcastId_259760_OffsetTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
        await expect(getActivePageNumberElement(page, "3")).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4 on first page (?page=1)", async ({
        page,
      }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const pageNumber = 1
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            if (
              !requestUrl.includes(`offset=`) &&
              requestUrl.includes(`limit=${limit}`)
            ) {
              // ensure backend api call does not have offset parameter
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(getActivePageNumberElement(page, "1")).toBeVisible()
        await expect(getPageNumberElement(page, "2")).toBeVisible()
        await expect(getPageNumberElement(page, "3")).toBeVisible()
        await expect(getPageNumberElement(page, "4")).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4, 5 on first page (?page=2)", async ({
        page,
      }) => {
        test.slow()
        // NOTE: there must be at least 60 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const pageNumber = 2
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            if (
              requestUrl.includes(`offset=10`) &&
              requestUrl.includes(`limit=${limit}`)
            ) {
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(getPageNumberElement(page, "1")).toBeVisible()
        await expect(getActivePageNumberElement(page, "2")).toBeVisible()
        await expect(getPageNumberElement(page, "3")).toBeVisible()
        await expect(getPageNumberElement(page, "4")).toBeVisible()
        await expect(getPageNumberElement(page, "5")).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4, 5, 6 on first page (?page=3)", async ({
        page,
      }) => {
        test.slow()
        // NOTE: there must be at least 70 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const pageNumber = 3
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            if (
              requestUrl.includes(`offset=20`) &&
              requestUrl.includes(`limit=${limit}`)
            ) {
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(getPageNumberElement(page, "1")).toBeVisible()
        await expect(getPageNumberElement(page, "2")).toBeVisible()
        await expect(getActivePageNumberElement(page, "3")).toBeVisible()
        await expect(getPageNumberElement(page, "4")).toBeVisible()
        await expect(getPageNumberElement(page, "5")).toBeVisible()
        await expect(getPageNumberElement(page, "6")).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4, 5, 6, 7 on first page (?page=4)", async ({
        page,
      }) => {
        test.slow()
        // NOTE: there must be at least 70 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const pageNumber = 4
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            if (
              requestUrl.includes(`offset=30`) &&
              requestUrl.includes(`limit=${limit}`)
            ) {
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(getPageNumberElement(page, "1")).toBeVisible()
        await expect(getPageNumberElement(page, "2")).toBeVisible()
        await expect(getPageNumberElement(page, "3")).toBeVisible()
        await expect(getActivePageNumberElement(page, "4")).toBeVisible()
        await expect(getPageNumberElement(page, "5")).toBeVisible()
        await expect(getPageNumberElement(page, "6")).toBeVisible()
        await expect(getPageNumberElement(page, "7")).toBeVisible()
      })

      test("should display last 4 pages on last page (?page=<LAST_PAGE>)", async ({
        page,
      }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = encodeURIComponent("Infinite Loops")
        const podcastId = "259760"
        const limit = 10
        const totalEpisodes =
          podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
        const totalPages = Math.ceil(totalEpisodes / limit)
        const pageNumber = totalPages
        await page.route(
          `*/**/api/podcast/episodes?id=${podcastId}**`,
          async (route) => {
            const requestUrl = route.request().url()
            if (
              requestUrl.includes(`offset=${totalEpisodes - limit}`) &&
              requestUrl.includes(`limit=${limit}`)
            ) {
              const json = podcastId_259760_FirstTenEpisodes
              await route.fulfill({ json })
            } else {
              const json = []
              await route.fulfill({ json })
            }
          }
        )
        await page.goto(
          HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
        )
        await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
        await assertPodcastInfo(
          page,
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
        await expect(getPageNumberElement(page, "-1")).not.toBeVisible()
        await expect(getPageNumberElement(page, "0")).not.toBeVisible()
        await expect(
          getPageNumberElement(page, `${pageNumber - 3}`)
        ).toBeVisible()
        await expect(
          getPageNumberElement(page, `${pageNumber - 2}`)
        ).toBeVisible()
        await expect(
          getPageNumberElement(page, `${pageNumber - 1}`)
        ).toBeVisible()
        await expect(
          getActivePageNumberElement(page, `${pageNumber}`)
        ).toBeVisible()
      })
    })
  })

  test.describe("Previous Pagination Button", () => {
    test("should navigate to first page when previous pagination button is clicked from second page", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 2
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest =
            !requestUrl.includes("offset=") &&
            requestUrl.includes(`limit=${limit}`)
          const isSecondPageRequest =
            requestUrl.includes("offset=10") &&
            requestUrl.includes(`limit=${limit}`)

          if (isSecondPageRequest) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else if (isFirstPageRequest) {
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()

      await getPreviousPaginationButton(page).click()

      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
    })
  })

  test.describe("Next Pagination Button", () => {
    test("should disable next pagination button on last page", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const expectedTotalEpisodes =
        podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
      const expectedTotalPages = Math.ceil(expectedTotalEpisodes / limit)
      const pageNumber = expectedTotalPages
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          const isLastPageRequest =
            requestUrl.includes(`offset=${expectedTotalEpisodes - limit}`) &&
            requestUrl.includes(`limit=${limit}`)

          if (isLastPageRequest) {
            // treat the last page request as the first ten episode data
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
      await expect(
        getActivePageNumberElement(page, `${pageNumber}`)
      ).toBeVisible()
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).toBeDisabled()

      await expect(getPreviousPaginationButton(page)).toBeVisible()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
    })

    test("should navigate to second page when next pagination button is clicked from first page", async ({
      page,
    }) => {
      test.slow()
      const podcastTitle = encodeURIComponent("Infinite Loops")
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 1
      await page.route(
        `*/**/api/podcast/episodes?id=${podcastId}**`,
        async (route) => {
          const requestUrl = route.request().url()
          const isFirstPageRequest =
            !requestUrl.includes("offset=") &&
            requestUrl.includes(`limit=${limit}`)
          const isSecondPageRequest =
            requestUrl.includes("offset=10") &&
            requestUrl.includes(`limit=${limit}`)

          if (isSecondPageRequest) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else if (isFirstPageRequest) {
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        }
      )
      await page.goto(
        HOMEPAGE + `/podcasts/${podcastTitle}/${podcastId}?page=${pageNumber}`
      )
      await expect(page).toHaveTitle(/Infinite Loops - xtal - podcasts/)
      await assertPodcastInfo(
        page,
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_FirstTenEpisodes)
      await expect(getActivePageNumberElement(page, "1")).toBeVisible()
      await expect(getPreviousPaginationButton(page)).toBeDisabled()
      await expect(getNextPaginationButton(page)).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      expect(page.url(), "should match 1").toMatch(/page=1$/)

      await getNextPaginationButton(page).click()

      await expect(getActivePageNumberElement(page, "2")).toBeVisible()
      await expect(getNextPaginationButton(page)).not.toBeDisabled()
      await expect(getPreviousPaginationButton(page)).not.toBeDisabled()
      await assertPodcastInfo(
        page,
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(page, podcastId_259760_OffsetTenEpisodes)
    })
  })
})
