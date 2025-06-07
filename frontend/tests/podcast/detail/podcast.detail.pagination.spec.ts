import { test } from "../../fixture/test.ts"
import { expect } from "@playwright/test"
import {
  podcastId_259760_FirstTenEpisodes,
  podcastId_259760_OffsetTenEpisodes,
} from "../../mocks/podcast.episode.ts"
import {
  assertPodcastEpisodes,
  assertPodcastInfo,
} from "../../constants/podcast/detail/podcastDetailConstants.ts"

test.describe("Pagination of Podcast Detail Page for individual podcast /podcasts/PODCAST-TITLE/PODCAST-ID", () => {
  test.describe("Pagination using url parameter '?page=PAGE-NUMBER'", () => {
    test("should display latest ten podcasts for first page", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = "1"
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes
      )
      const nextPaginationButton =
        podcastDetailPage.getNextEpisodeListPaginationButton()
      const previousPaginationButton =
        podcastDetailPage.getPreviousEpisodeListPaginationButton()
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
      await expect(nextPaginationButton).toBeVisible()
    })

    test("should display second page of podcast episodes when url param ?page=2 is given", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = "2"
      const expectedOffset = 10
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes
      )
      const nextPaginationButton =
        podcastDetailPage.getNextEpisodeListPaginationButton()
      const previousPaginationButton =
        podcastDetailPage.getPreviousEpisodeListPaginationButton()
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("2")
      ).toBeVisible()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).not.toBeDisabled()
      await expect(nextPaginationButton).toBeVisible()
    })

    test("should not have disabled pagination buttons on second last page", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const expectedTotalEpisodes =
        podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
      const expectedTotalPages = Math.ceil(expectedTotalEpisodes / limit)
      const pageNumber = `${expectedTotalPages - 1}`
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes
      )
      const activePageNumber =
        podcastDetailPage.getEpisodePaginationActivePageNumber(pageNumber)
      const nextPaginationButton =
        podcastDetailPage.getNextEpisodeListPaginationButton()
      const previousPaginationButton =
        podcastDetailPage.getPreviousEpisodeListPaginationButton()
      await expect(activePageNumber).toBeVisible()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).not.toBeDisabled()
    })
  })

  test.describe("Navigate to static last page button", () => {
    test("should navigate and static last page pagination button should be disabled on last page", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      // NOTE: there must be at least 50 episodes for the mocked podcast data
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = "1"
      const episodeCount =
        podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
      const lastPageNumber = Math.ceil(episodeCount / limit)
      const lastPageOffset = lastPageNumber * limit - limit
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
          const requestUrl = route.request().url()
          const isLastPage =
            requestUrl.includes(`offset=${lastPageOffset}`) &&
            requestUrl.includes(`limit=${limit}`)
          if (
            !requestUrl.includes(`offset=`) &&
            requestUrl.includes(`limit=${limit}`)
          ) {
            // ensure backend api call does not have offset parameter
            const json = podcastId_259760_FirstTenEpisodes
            await route.fulfill({ json })
          } else if (isLastPage) {
            const json = podcastId_259760_OffsetTenEpisodes
            await route.fulfill({ json })
          } else {
            const json = []
            await route.fulfill({ json })
          }
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()

      await expect(
        podcastDetailPage.getLastPageEpisodeListPaginationButton()
      ).toBeVisible()
      await podcastDetailPage.getLastPageEpisodeListPaginationButton().click()
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber(
          `${lastPageNumber}`
        )
      ).toBeVisible()
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes
      )
    })
  })

  test.describe("Navigate to static first page button", () => {
    test("static first page pagination button should be disabled on first page", async ({
      podcastDetailPage,
    }) => {
      // NOTE: there must be at least 50 episodes for the mocked podcast data
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = "1"
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      await expect(
        podcastDetailPage.getFirstPageEpisodeListPaginationButton()
      ).toBeVisible()
      await expect(
        podcastDetailPage.getFirstPageEpisodeListPaginationButton()
      ).toBeDisabled()
    })

    test("should fetch first page results when static first page pagination button is clicked", async ({
      podcastDetailPage,
      isMobile,
    }) => {
      test.slow()
      // NOTE: there must be at least 50 episodes for the mocked podcast data
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = "1"
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      if (isMobile) {
        // navigate to page 3, mobile view only has current active page number element
        const nextPaginationButton =
          podcastDetailPage.getNextEpisodeListPaginationButton()
        await nextPaginationButton.click()
        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("2")
        ).toBeVisible()
        await nextPaginationButton.click()
        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("3")
        ).toBeVisible()
      } else {
        await podcastDetailPage.getEpisodePaginationPageNumber("3").click()
        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("3")
        ).toBeVisible()
      }
      await expect(
        podcastDetailPage.getFirstPageEpisodeListPaginationButton()
      ).not.toBeDisabled()
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes
      )

      await podcastDetailPage.getFirstPageEpisodeListPaginationButton().click()
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes
      )
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
        podcastDetailPage,
      }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const pageNumber = "1"
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("1")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("2")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("3")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("4")
        ).not.toBeVisible()
      })
    })

    test.describe("desktop view", () => {
      test.beforeEach(({ isMobile }) => {
        if (isMobile) {
          test.skip(isMobile)
        }
      })

      test("should navigate to clicked pagination page", async ({
        headless,
        podcastDetailPage,
      }) => {
        test.skip(headless, "Skip slow test in headless mode")
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const pageNumber = "1"
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("1")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("2")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("3")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("4")
        ).toBeVisible()

        await podcastDetailPage.getEpisodePaginationPageNumber("3").click()

        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_OffsetTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_OffsetTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("3")
        ).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4 on first page (?page=1)", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const pageNumber = "1"
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("1")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("2")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("3")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("4")
        ).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4, 5 on first page (?page=2)", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        // NOTE: there must be at least 60 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const pageNumber = "2"
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("1")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("2")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("3")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("4")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("5")
        ).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4, 5, 6 on first page (?page=3)", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        // NOTE: there must be at least 70 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const pageNumber = "3"
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("1")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("2")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("3")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("4")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("5")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("6")
        ).toBeVisible()
      })

      test("should display pages 1, 2, 3, 4, 5, 6, 7 on first page (?page=4)", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        // NOTE: there must be at least 70 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const pageNumber = "4"
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("1")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("2")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("3")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber("4")
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("5")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("6")
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("7")
        ).toBeVisible()
      })

      test("should display last 4 pages on last page (?page=<LAST_PAGE>)", async ({
        podcastDetailPage,
      }) => {
        test.slow()
        // NOTE: there must be at least 50 episodes for the mocked podcast data
        const podcastTitle = "Infinite Loops"
        const podcastId = "259760"
        const limit = 10
        const totalEpisodes =
          podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
        const totalPages = Math.ceil(totalEpisodes / limit)
        const pageNumber = totalPages
        await podcastDetailPage
          .getPage()
          .route(
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
        await podcastDetailPage.gotoPageNumber({
          podcastId,
          podcastTitle,
          pageNumber: `${pageNumber}`,
        })
        await expect(podcastDetailPage.getPage()).toHaveTitle(
          /Infinite Loops - xtal - podcasts/
        )
        await assertPodcastInfo(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes.data.podcast
        )
        await assertPodcastEpisodes(
          podcastDetailPage.getPage(),
          podcastId_259760_FirstTenEpisodes
        )
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("-1")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber("0")
        ).not.toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber(`${pageNumber - 3}`)
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber(`${pageNumber - 2}`)
        ).toBeVisible()
        await expect(
          podcastDetailPage.getEpisodePaginationPageNumber(`${pageNumber - 1}`)
        ).toBeVisible()

        await expect(
          podcastDetailPage.getEpisodePaginationActivePageNumber(
            `${pageNumber}`
          )
        ).toBeVisible()
      })
    })
  })

  test.describe("Previous Pagination Button", () => {
    test("should navigate to first page when previous pagination button is clicked from second page", async ({
      headless,
      podcastDetailPage,
    }) => {
      test.skip(headless, "Skip slow test in headless mode")
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = "2"
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes
      )
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("2")
      ).toBeVisible()
      const previousPaginationButton =
        podcastDetailPage.getPreviousEpisodeListPaginationButton()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).not.toBeDisabled()

      await previousPaginationButton.click()

      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes
      )
    })
  })

  test.describe("Next Pagination Button", () => {
    test("should disable next pagination button on last page", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const expectedTotalEpisodes =
        podcastId_259760_FirstTenEpisodes.data.podcast.episodeCount
      const expectedTotalPages = Math.ceil(expectedTotalEpisodes / limit)
      const pageNumber = expectedTotalPages
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber: `${pageNumber}`,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes
      )
      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber(`${pageNumber}`)
      ).toBeVisible()
      const nextPaginationButton =
        podcastDetailPage.getNextEpisodeListPaginationButton()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).toBeDisabled()

      const previousPaginationButton =
        podcastDetailPage.getPreviousEpisodeListPaginationButton()
      await expect(previousPaginationButton).toBeVisible()
      await expect(previousPaginationButton).not.toBeDisabled()
    })

    test("should navigate to second page when next pagination button is clicked from first page", async ({
      podcastDetailPage,
    }) => {
      test.slow()
      const podcastTitle = "Infinite Loops"
      const podcastId = "259760"
      const limit = 10
      const pageNumber = 1
      await podcastDetailPage
        .getPage()
        .route(`*/**/api/podcast/episodes?id=${podcastId}**`, async (route) => {
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
        })
      await podcastDetailPage.gotoPageNumber({
        podcastId,
        podcastTitle,
        pageNumber: `${pageNumber}`,
      })
      await expect(podcastDetailPage.getPage()).toHaveTitle(
        /Infinite Loops - xtal - podcasts/
      )
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_FirstTenEpisodes
      )

      const previousPaginationButton =
        podcastDetailPage.getPreviousEpisodeListPaginationButton()
      const nextPaginationButton =
        podcastDetailPage.getNextEpisodeListPaginationButton()

      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("1")
      ).toBeVisible()
      await expect(previousPaginationButton).toBeDisabled()
      await expect(nextPaginationButton).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      expect(podcastDetailPage.getPage().url(), "should match 1").toMatch(
        /page=1$/
      )

      await nextPaginationButton.click()

      await expect(
        podcastDetailPage.getEpisodePaginationActivePageNumber("2")
      ).toBeVisible()
      await expect(nextPaginationButton).not.toBeDisabled()
      await expect(previousPaginationButton).not.toBeDisabled()
      await assertPodcastInfo(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes.data.podcast
      )
      await assertPodcastEpisodes(
        podcastDetailPage.getPage(),
        podcastId_259760_OffsetTenEpisodes
      )
    })
  })
})
