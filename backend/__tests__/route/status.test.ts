import request from "supertest"
import { NextFunction, Request, Response } from "express"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { setupApp } from "../../index.js"

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
        getAccountFollowPodcastLimiter: getMockMiddleware(),
      },
    }
  })
}

describe("GET /status", () => {
  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("should return status code 200", async () => {
    const app = setupApp()
    const response = await request(app).get("/status")
    expect(response.status).toBe(200)
  })
})
