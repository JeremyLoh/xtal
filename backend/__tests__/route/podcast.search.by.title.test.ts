import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import request from "supertest"
import { NextFunction, Request, Response } from "express"
import { getFrontendOrigin } from "../cors/origin.js"
import { setupApp } from "../../index.js"
import {
  PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_10,
  PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_12,
} from "../mocks/podcastSearch.js"
import { Language, Podcast } from "../../model/podcast.js"
import { getSanitizedHtmlText } from "../../api/dom/htmlSanitize.js"

function getMockMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => next()
}

function mockRateLimiters() {
  vi.mock("../../middleware/rateLimiter.js", () => {
    return {
      default: {
        getTrendingPodcastLimiter: getMockMiddleware(),
        getPodcastSearchLimiter: getMockMiddleware(),
        getPodcastEpisodeLimiter: getMockMiddleware(),
        getPodcastEpisodesLimiter: getMockMiddleware(),
        getPodcastImageConversionLimiter: getMockMiddleware(),
        getPodcastCategoryLimiter: getMockMiddleware(),
        getStatusLimiter: getMockMiddleware(),
        deleteAccountLimiter: getMockMiddleware(),
        getAccountPlayHistoryLimiter: getMockMiddleware(),
        getAccountPlayHistoryTimestampLimiter: getMockMiddleware(),
        deleteAccountPlayHistoryLimiter: getMockMiddleware(),
        updateAccountPlayHistoryLimiter: getMockMiddleware(),
        getAccountPlayHistoryCountLimiter: getMockMiddleware(),
        addAccountFollowPodcastLimiter: getMockMiddleware(),
        removeAccountFollowPodcastLimiter: getMockMiddleware(),
        getAccountFollowPodcastLimiter: getMockMiddleware(),
      },
    }
  })
}

describe("GET /api/podcast/search", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  type PodcastSearchByTermFeed = {
    id: number
    podcastGuid: string
    title: string
    url: string
    originalUrl: string
    link: string
    description: string
    author: string
    ownerName: string
    image: string
    artwork: string
    lastUpdateTime: number
    lastCrawlTime: number
    lastParseTime: number
    lastGoodHttpStatusTime: number
    lastHttpStatus: number
    contentType: string
    itunesId: number | null
    generator?: string
    language: string
    explicit: boolean
    type: number
    medium: string
    dead: number
    episodeCount: number
    crawlErrors: number
    parseErrors: number
    categories: Partial<Record<string, string>> // https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
    locked: number
    imageUrlHash: number
    newestItemPubdate: number
    inPollingQueue?: number
    priority: number
  }

  type PodcastSearchByTermResponse = {
    // https://podcastindex-org.github.io/docs-api/#get-/search/byterm
    status: string // "true" | "false"
    count: number
    query: string
    description: string
    feeds: PodcastSearchByTermFeed[]
  }

  function getExpectedPodcastData(response: PodcastSearchByTermResponse) {
    const podcasts = response.feeds
    const data: Podcast[] = podcasts.map((podcast) => {
      const language = podcast.language.toLowerCase()
      return {
        id: podcast.id,
        url: podcast.url,
        title: podcast.title,
        description: getSanitizedHtmlText(podcast.description),
        author: podcast.author,
        image: podcast.image || podcast.artwork,
        language: Language[language as keyof typeof Language],
        latestPublishTime: podcast.newestItemPubdate,
        // @ts-ignore
        categories: Object.values<string>(podcast.categories),
        episodeCount: podcast.episodeCount,
        isExplicit: podcast.explicit,
      }
    })
    return data
  }

  describe("CORS configuration", () => {
    test("should return status code 200 and allow environment variable FRONTEND_ORIGIN origin", async () => {
      const limit = "10"
      const query = "syntax"
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/search?q=${query}&limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": expectedOrigin,
          "access-control-allow-credentials": "true",
        })
      )
    })
  })

  describe("invalid parameters", () => {
    describe("q parameter (search query)", () => {
      test("should return status 400 for missing q parameter", async () => {
        const limit = "10"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'q' should be present and between 1 and 200 characters",
            ]),
          })
        )
      })

      test("should return status 400 for empty string q parameter", async () => {
        const limit = "10"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'q' should be present and between 1 and 200 characters",
            ]),
          })
        )
      })

      test("should return status 400 for q parameter of length more than 200 characters", async () => {
        const limit = "10"
        const query = "a".repeat(201)
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'q' should be present and between 1 and 200 characters",
            ]),
          })
        )
      })
    })

    describe("limit parameter", () => {
      test("should return status 400 for missing limit parameter", async () => {
        const query = "syntax"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be present and between 1 and 100",
            ]),
          })
        )
      })

      test("should return status 400 for more than 100 limit parameter", async () => {
        const query = "syntax"
        const limit = "101"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be present and between 1 and 100",
            ]),
          })
        )
      })

      test("should return status 400 for negative limit parameter", async () => {
        const query = "syntax"
        const limit = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be present and between 1 and 100",
            ]),
          })
        )
      })

      test("should return status 400 for zero limit parameter", async () => {
        const query = "syntax"
        const limit = "0"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be present and between 1 and 100",
            ]),
          })
        )
      })

      test("should return status 400 for non numeric limit parameter", async () => {
        const query = "syntax"
        const limit = "3a"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be present and between 1 and 100",
            ]),
          })
        )
      })
    })

    describe("offset parameter", () => {
      test("should return status 400 for negative offset parameter", async () => {
        const query = "syntax"
        const limit = "10"
        const offset = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}&offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be present and between 0 and 1000",
            ]),
          })
        )
      })

      test("should return status 400 for more than 1000 offset parameter", async () => {
        const query = "syntax"
        const limit = "10"
        const offset = "1001"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/search?q=${query}&limit=${limit}&offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be present and between 0 and 1000",
            ]),
          })
        )
      })
    })
  })

  test("should return similar podcast data based on search term", async () => {
    const query = "syntax"
    const limit = 10
    const app = setupApp()
    const response = await request(app)
      .get(`/api/podcast/search?q=${query}&limit=${limit}`)
      .set("Origin", expectedOrigin)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        count: limit,
        data: getExpectedPodcastData(
          PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_10
        ),
      })
    )
  })

  test("should return offset similar podcast data based on search term", async () => {
    const query = "syntax"
    const limit = 10
    const offset = 2
    const expectedPodcasts =
      PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_12.feeds.slice(
        offset,
        offset + limit
      )
    const app = setupApp()
    const response = await request(app)
      .get(`/api/podcast/search?q=${query}&limit=${limit}&offset=${offset}`)
      .set("Origin", expectedOrigin)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        count: limit,
        data: getExpectedPodcastData({
          ...PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_12,
          count: expectedPodcasts.length,
          feeds: expectedPodcasts,
        }),
      })
    )
  })

  test("should return zero podcast data on error", async () => {
    const query = "no podcast data"
    const limit = 10
    const app = setupApp()
    const response = await request(app)
      .get(`/api/podcast/search?q=${query}&limit=${limit}`)
      .set("Origin", expectedOrigin)
    expect(response.status).toBe(500)
  })
})
