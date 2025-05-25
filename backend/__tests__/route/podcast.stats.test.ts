import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import request from "supertest"
import { NextFunction } from "express"
import { getFrontendOrigin } from "../cors/origin.js"
import { setupApp } from "../../index.js"
import { CURRENT_PODCAST_STATISTICS } from "../mocks/podcastStatHandler.js"

function getMockMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => next()
}

function mockRateLimiters() {
  vi.mock("../../middleware/rateLimiter.js", async () => {
    const { default: rateLimiterFunctions } = await import(
      "../../middleware/rateLimiter.js"
    )
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

describe("GET /api/podcast/stats/current", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("CORS configuration", () => {
    test("should return status code 200 and allow environment variable FRONTEND_ORIGIN origin", async () => {
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/stats/current")
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": expectedOrigin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 500 for empty origin", async () => {
      const origin = ""
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/stats/current")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })

    test("should return status code 500 for origin that does not match environment variable FRONTEND_ORIGIN", async () => {
      const origin = "http://example.com"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/stats/current")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })
  })

  test("should get total podcast statistic counts available", async () => {
    const expectedCacheTimeInSeconds = 12 * 60 * 60
    const app = setupApp()
    const response = await request(app)
      .get("/api/podcast/stats/current")
      .set("Origin", expectedOrigin)
    expect(response.status).toBe(200)
    expect(response.headers).toEqual(
      expect.objectContaining({
        "cache-control": `public, max-age=${expectedCacheTimeInSeconds}`,
      })
    )
    expect(response.body).toEqual(
      expect.objectContaining({
        totalPodcasts: CURRENT_PODCAST_STATISTICS.stats.feedCountTotal,
        totalPodcastEpisodes:
          CURRENT_PODCAST_STATISTICS.stats.episodeCountTotal,
        episodesPublishedInLastThirtyDays:
          CURRENT_PODCAST_STATISTICS.stats.feedsWithNewEpisodes30days,
      })
    )
  })
})
