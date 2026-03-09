import dayjs from "dayjs"
import request from "supertest"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { NextFunction, Request, Response } from "express"
import { setupApp } from "../../index.js"
import { getFrontendOrigin } from "../cors/origin.js"
import { rankPodcastTextScore } from "../../api/podcastScoring.js"
import { server } from "../mocks/server.js"
import { createTrendingPodcastHandler } from "../mocks/handlers/podcastTrendingHandler.js"
import {
  PODCAST_TRENDING_DEFAULT_TEN_ENTRIES,
  PODCAST_TRENDING_TEN_ARTS_PODCASTS,
} from "../mocks/data/podcast.js"
import { parseLanguage } from "../../model/podcast.js"
import { getSanitizedHtmlText } from "../../api/dom/htmlSanitize.js"

function getMockMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => next()
}

function mockRateLimiters() {
  vi.mock("../../middleware/rateLimiter.js", async () => {
    const { default: rateLimiterFunctions } =
      await import("../../middleware/rateLimiter.js")
    const mockRateLimiterFunctions = Object.keys(rateLimiterFunctions).reduce(
      (mockFunctions, currentFunction) => {
        return {
          ...mockFunctions,
          [currentFunction]: getMockMiddleware(),
        }
      },
      {}
    )
    return {
      default: mockRateLimiterFunctions,
    }
  })
}

function sortExpectedPodcastsByScore(
  expectedPodcasts: { trendScore?: number; description: string }[]
) {
  // return new copy instead of mutating original array
  return [...expectedPodcasts].sort((a, b) => {
    const scoreA = (a.trendScore ?? 0) + rankPodcastTextScore(a.description)
    const scoreB = (b.trendScore ?? 0) + rankPodcastTextScore(b.description)
    return scoreB - scoreA
  })
}

describe("GET /api/podcast/trending", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    server.resetHandlers()
  })

  describe("CORS configuration", () => {
    beforeEach(() => {
      server.use(
        createTrendingPodcastHandler({
          feeds: PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds,
        })
      )
    })

    test("should return status code 200 and allow environment variable FRONTEND_ORIGIN origin", async () => {
      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", expectedOrigin)

      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": expectedOrigin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 200 for query string of environment variable FRONTEND_ORIGIN origin", async () => {
      const origin = new URL(expectedOrigin).origin + "?firstQueryString=first"
      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)

      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 200 for nested page path of environment variable FRONTEND_ORIGIN origin", async () => {
      const origin = new URL(expectedOrigin).origin + "/nested/path"
      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)

      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 200 for nested page path with query string of environment variable FRONTEND_ORIGIN origin", async () => {
      const origin =
        new URL(expectedOrigin).origin +
        "/nested/path?firstQueryString=first&secondQueryString=2b"
      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)

      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 500 for empty origin", async () => {
      const origin = ""
      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)

      expect(response.status).toBe(500)
    })

    test("should return status code 500 for * origin", async () => {
      const origin = "*"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })

    test("should return status code 500 for origin that does not match environment variable FRONTEND_ORIGIN", async () => {
      const origin = "http://example.com"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })
  })

  describe("given invalid URL parameters", () => {
    describe("category parameter (podcast category to search)", () => {
      test("should respond with status 400 for category parameter of empty string", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const app = setupApp()

        const response = await request(app)
          .get("/api/podcast/trending?category=")
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'category' should have length between 1 and 1000",
            ]),
          })
        )
      })
    })

    describe("limit parameter (count of podcasts to return)", () => {
      test("should respond with status 400 for limit parameter of zero", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const app = setupApp()

        const response = await request(app)
          .get("/api/podcast/trending?limit=0")
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for limit parameter of 101", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const app = setupApp()

        const response = await request(app)
          .get("/api/podcast/trending?limit=101")
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for negative limit parameter", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const app = setupApp()

        const response = await request(app)
          .get("/api/podcast/trending?limit=-1")
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })
    })

    describe("since parameter (unix timestamp in seconds)", () => {
      test("should respond with status 400 for since parameter with unix timestamp (in seconds) of a future date", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const futureUnixTimestampInSeconds = dayjs().add(20, "minute").unix()
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?since=${futureUnixTimestampInSeconds}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be before current unix timestamp",
            ]),
          })
        )
      })

      test("should respond with status 400 for since parameter with invalid unix timestamp of more than 120 days", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const before120days = dayjs().subtract(120, "day").unix()
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?since=${before120days}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be between 120 days before current unix timestamp to current unix timestamp",
            ]),
          })
        )
      })

      test("should respond with status 400 for since parameter with invalid unix timestamp that is too large", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        // largest (32-bit) unix timestamp is 2147483647
        const invalidLargeTimestamp = "2147483648"
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?since=${invalidLargeTimestamp}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be before current unix timestamp",
            ]),
          })
        )
      })

      test("should respond with status 400 for since parameter that is not a number", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const invalidStringInput = "3e"
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?since=${invalidStringInput}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be a number representing a unix timestamp between 120 days before current unix timestamp to current unix timestamp",
            ]),
          })
        )
      })
    })

    describe("offset parameter", () => {
      test("should respond with status 400 for negative offset parameter", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const invalidNegativeOffset = "-1"
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?offset=${invalidNegativeOffset}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 1000",
            ]),
          })
        )
      })

      test("should respond with status 400 for 1001 offset parameter", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const invalidMaxOffset = "1001"
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?offset=${invalidMaxOffset}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 1000",
            ]),
          })
        )
      })

      test("should respond with status 400 for non numeric offset parameter", async () => {
        server.use(
          createTrendingPodcastHandler({
            feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
          })
        )

        const invalidMaxOffset = "5e"
        const app = setupApp()

        const response = await request(app)
          .get(`/api/podcast/trending?offset=${invalidMaxOffset}`)
          .set("Origin", expectedOrigin)

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 1000",
            ]),
          })
        )
      })
    })
  })

  describe("given one category", () => {
    test("should respond with podcasts in given category", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: [...PODCAST_TRENDING_TEN_ARTS_PODCASTS.feeds],
        })
      )

      const expectedCategory = "arts"
      const limit = "10"
      const app = setupApp()

      const response = await request(app)
        .get(
          `/api/podcast/trending?limit=${limit}&category=${expectedCategory}`
        )
        .set("Origin", expectedOrigin)

      expect(response.status).toEqual(200)

      const expectedPodcasts = sortExpectedPodcastsByScore(
        PODCAST_TRENDING_TEN_ARTS_PODCASTS.feeds.map((p) => ({
          id: p.id,
          url: p?.url,
          title: p.title,
          description: getSanitizedHtmlText(p.description || ""),
          author: p?.author,
          image: p?.image || p?.artwork,
          latestPublishTime:
            p.newestItemPublishTime || p.newestItemPubdate || p.lastUpdateTime,
          language: parseLanguage(p.language),
          categories: p.categories ? Object.values(p.categories) : p.categories,
          trendScore: p?.trendScore,
        }))
      )

      expect(response.body).toEqual(
        expect.objectContaining({
          count: 10,
          data: expect.arrayContaining(expectedPodcasts),
        })
      )
    })
  })

  describe("given offset parameter", () => {
    test("should return offset trending podcasts when offset is given", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
        })
      )

      const podcastData = sortExpectedPodcastsByScore(
        PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds.map((p) => ({
          id: p.id,
          url: p?.url,
          title: p.title,
          description: getSanitizedHtmlText(p.description || ""),
          author: p?.author,
          image: p?.image || p?.artwork,
          latestPublishTime:
            p.newestItemPublishTime || p.newestItemPubdate || p.lastUpdateTime,
          language: parseLanguage(p.language),
          categories: p.categories ? Object.values(p.categories) : p.categories,
          trendScore: p?.trendScore,
        }))
      )

      const expectedOffset = 5
      const limit = 10

      const expectedPodcasts = podcastData.slice(expectedOffset)

      const expectedPodcastResponse = {
        count: limit - expectedOffset,
        data: expectedPodcasts,
      }

      const app = setupApp()

      const response = await request(app)
        .get(`/api/podcast/trending?offset=${expectedOffset}&limit=${limit}`)
        .set("Origin", expectedOrigin)

      expect(response.status).toEqual(200)
      expect(response.body).toEqual(
        expect.objectContaining(expectedPodcastResponse)
      )
    })

    test("should return offset trending podcasts when zero offset is given", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
        })
      )

      const podcastData = sortExpectedPodcastsByScore(
        PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds.map((p) => ({
          id: p.id,
          url: p?.url,
          title: p.title,
          description: getSanitizedHtmlText(p.description || ""),
          author: p?.author,
          image: p?.image || p?.artwork,
          latestPublishTime:
            p.newestItemPublishTime || p.newestItemPubdate || p.lastUpdateTime,
          language: parseLanguage(p.language),
          categories: p.categories ? Object.values(p.categories) : p.categories,
          trendScore: p?.trendScore,
        }))
      )

      const expectedOffset = 0
      const limit = 10

      const expectedPodcastResponse = {
        count: limit - expectedOffset,
        data: podcastData,
      }

      const app = setupApp()

      const response = await request(app)
        .get(`/api/podcast/trending?offset=${expectedOffset}&limit=${limit}`)
        .set("Origin", expectedOrigin)

      expect(response.status).toEqual(200)
      expect(response.body).toEqual(
        expect.objectContaining(expectedPodcastResponse)
      )
    })
  })

  describe("given zero URL parameters", () => {
    test("should respond with status 200", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
        })
      )

      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)

      expect(response.status).toEqual(200)
    })

    test("should specify response content type header of application/json", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
        })
      )

      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("application/json")
      )
    })

    test("should return list of 10 trending podcasts with no search parameters", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: [...PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds],
        })
      )

      const podcastData = sortExpectedPodcastsByScore(
        PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds.map((p) => ({
          id: p.id,
          url: p?.url,
          title: p.title,
          description: getSanitizedHtmlText(p.description || ""),
          author: p?.author,
          image: p?.image || p?.artwork,
          latestPublishTime:
            p.newestItemPublishTime || p.newestItemPubdate || p.lastUpdateTime,
          language: parseLanguage(p.language),
          categories: p.categories ? Object.values(p.categories) : p.categories,
          trendScore: p?.trendScore,
        }))
      )

      const expectedOffset = 0
      const limit = 10

      const expectedPodcastResponse = {
        count: limit - expectedOffset,
        data: podcastData,
      }

      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)

      expect(response.body).toEqual(expectedPodcastResponse)
    })

    test("should stop fetching more podcast entries if no more entries are found (API returns duplicate forever) and we don't hit the required count", async () => {
      server.use(
        createTrendingPodcastHandler({
          feeds: PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds.slice(0, 5),
        })
      )

      const podcastData = sortExpectedPodcastsByScore(
        PODCAST_TRENDING_DEFAULT_TEN_ENTRIES.feeds.slice(0, 5).map((p) => ({
          id: p.id,
          url: p?.url,
          title: p.title,
          description: getSanitizedHtmlText(p.description || ""),
          author: p?.author,
          image: p?.image || p?.artwork,
          latestPublishTime:
            p.newestItemPublishTime || p.newestItemPubdate || p.lastUpdateTime,
          language: parseLanguage(p.language),
          categories: p.categories ? Object.values(p.categories) : p.categories,
          trendScore: p?.trendScore,
        }))
      )

      const expectedPodcastResponse = {
        count: 5,
        data: podcastData,
      }

      const app = setupApp()

      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)

      expect(response.body).toEqual(expectedPodcastResponse)
    })
  })
})
