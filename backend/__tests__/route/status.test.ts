import request from "supertest"
import { NextFunction, Request, Response } from "express"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { setupApp } from "../../index.js"

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
