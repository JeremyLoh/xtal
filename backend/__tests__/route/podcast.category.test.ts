import request from "supertest"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { NextFunction, Request, Response } from "express"
import { setupApp } from "../../index.js"
import { getFrontendOrigin } from "../cors/origin.js"
import { ALL_PODCAST_CATEGORIES } from "../mocks/podcastCategory.js"

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
      },
    }
  })
}

describe("GET /api/podcast/category", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("should retrieve all categories", async () => {
    const expectedData = ALL_PODCAST_CATEGORIES.feeds
    const app = setupApp()
    const response = await request(app)
      .get(`/api/podcast/category`)
      .set("Origin", expectedOrigin)
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        count: 112,
        data: expect.arrayContaining(expectedData),
      })
    )
  })

  describe("invalid parameter", () => {
    describe("limit parameter", () => {
      test("should respond with status 400 for limit parameter of zero", async () => {
        const limit = "0"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/category?limit=${limit}`)
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

      test("should respond with status 400 for limit parameter of negative value", async () => {
        const limit = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/category?limit=${limit}`)
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

      test("should response with status 400 for limit parameter of more than 100", async () => {
        const limit = "101"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/category?limit=${limit}`)
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

    describe("offset parameter", () => {
      test("should respond with status 400 for offset parameter of zero", async () => {
        const offset = "0"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/category?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of negative value", async () => {
        const offset = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/category?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of more than 1000", async () => {
        const offset = "1001"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/category?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })
    })
  })
})
