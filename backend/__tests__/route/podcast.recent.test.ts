import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import request from "supertest"
import { NextFunction, Request, Response } from "express"
import { getFrontendOrigin } from "../cors/origin.js"
import { setupApp } from "../../index.js"
import { Language } from "../../model/podcast.js"

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

describe("GET /api/podcast/recent", () => {
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
        .get("/api/podcast/recent")
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
        .get("/api/podcast/recent")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })

    test("should return status code 500 for origin that does not match environment variable FRONTEND_ORIGIN", async () => {
      const origin = "http://example.com"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/recent")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })
  })

  describe("invalid parameters", () => {
    describe("limit parameter", () => {
      test("should respond with status 400 for limit parameter of zero", async () => {
        const limit = "0"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for limit parameter of negative number", async () => {
        const limit = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for limit parameter of positive floating point number", async () => {
        const limit = "2.01"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for limit parameter of non integer values", async () => {
        const limit = "a"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
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
      test("should respond with status 400 for offset parameter of empty string", async () => {
        const offset = ""
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of negative integer", async () => {
        const offset = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter greater than 500", async () => {
        const offset = "501"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of floating point number", async () => {
        const offset = "2.01"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of non integer", async () => {
        const offset = "a"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })
    })

    describe("lang parameter", () => {
      test("should respond with status 400 for lang parameter of empty string", async () => {
        const lang = ""
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?lang=${lang}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
                Language
              )}`,
            ]),
          })
        )
      })

      test("should respond with status 400 for lang parameter that is not ISO 639 language code", async () => {
        const lang = "test"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?lang=${lang}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
                Language
              )}`,
            ]),
          })
        )
      })

      test("should respond with status 400 for lang parameter that has extra punctuation", async () => {
        const lang = "en:"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?lang=${lang}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
                Language
              )}`,
            ]),
          })
        )
      })
    })
  })
})
