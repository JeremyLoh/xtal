import request from "supertest"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { NextFunction, Request, Response } from "express"
import { getFrontendOrigin } from "../cors/origin.js"
import { setupApp } from "../../index.js"

function getMockMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => next()
}

function mockRateLimiters() {
  vi.mock("../../middleware/rateLimiter.js", () => {
    return {
      default: {
        getTrendingPodcastLimiter: getMockMiddleware(),
        getPodcastEpisodesLimiter: getMockMiddleware(),
        getPodcastImageConversionLimiter: getMockMiddleware(),
        getPodcastCategoryLimiter: getMockMiddleware(),
      },
    }
  })
}

describe("GET /api/podcast/image", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Enable selectively, it will run against the actual Supabase backend and storage (as no mocks have been done)
  // Asserts that the compressed and resized image data has the same output bytes in base64 (image/webp)
  test.skip("should specify response content type of application/json", async () => {
    const payload = {
      url: "https://placehold.co/3000x3000",
      width: 200,
      height: 200,
    }
    const app = setupApp()
    const response = await request(app)
      .post(`/api/podcast/image`)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Origin", expectedOrigin)
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("image/webp")
    )
    expect(response.status).toBe(200)
    // WARNING: Compares the actual base64 bytes of the image returned from the production application
    // From source image https://placehold.co/3000x3000
    // Could break this test if the compression image parameters change or the resize is different!
    expect(Buffer.from(response.body).toString("base64")).toBe(
      "UklGRhoCAABXRUJQVlA4IA4CAADwGgCdASrIAMgAPqlUqE6mJSQiIXbYgMAVCWlu4XcmCOAfYD9AJH311R26bMW2MXtBlw6VgGy1vwUKFChQoUKFCjEWylRfJH7OKhrItlKi+SP2cVDWRbKVF8kfitKwMkxlBEklcSKkcRueEaqDkBDzoNDrq2lBnxlpRXeCMDw2Cca9KOWAg4g6VaK0t3+d+NjiGH25dViqTbSWUATgV/mrCjJ8jYxmir3QKQ37Z+s6Gno9H5XUp/KZQLItlKi+SP2cVDWRbKVF8kfs4qGsi2UqL5I/ZxUNZFspUXyR+zhsAAD+/3XdNcIfhqJaXiL+ucwl5fXk6jzW7UrBa9vz1zdPKwXArGGSgKRmALLwR8+zaOAt4FmthLoM6Dc1xT7/YPR2XNWmSnFUEIjjJ20nNwrulMp8cXiffXMWoKMLH/0xccuee01O7pGpeaVvgeZ36rYAiTxn9c5olFCTi+Iwk6BFHxvN9CfM2npDYqFuyqCJnAVjV9OtZdfLE9ZaFtXNpwbZMHvnOvtQXH4kfSdt2nMYN52Zzh4qMLys0luf0fd5q5dC0XVP0KhJMp6iWYZ3pGgm51erhcjaFnLBWhMtkNLfcDymiy5Ak0vWskz0l3V9WdrOM89Fz/I4LZZT7dIyQsKwvNzx/qemIYJKmQsMrNfIqWR5uiH5bP3/MA2LV5aDG4oa4auYTJdT0J20cQAA"
    )
  })

  describe("invalid parameters", () => {
    // TODO check for "height" in request body, check that the size is valid
    describe("height parameter", () => {
      test("should return status 400 for missing 'height' in request body", async () => {
        const payload = { url: "https://example.com", width: 100 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'height' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'height' smaller than 16 in request body", async () => {
        const payload = { height: 15, url: "https://example.com", width: 100 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'height' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'height' greater than 500 in request body", async () => {
        const payload = { height: 501, url: "https://example.com", width: 100 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'height' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'height' with negative value in request body", async () => {
        const payload = { height: -1, url: "https://example.com", width: 100 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'height' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'height' with zero value in request body", async () => {
        const payload = { height: 0, url: "https://example.com", width: 100 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'height' should be between 16 and 500",
            ]),
          })
        )
      })
    })

    describe("width parameter", () => {
      test("should return status 400 for missing 'width' in request body", async () => {
        const payload = { url: "https://example.com", height: 200 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'width' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'width' smaller than 16 in request body", async () => {
        const payload = { width: 15, url: "https://example.com", height: 200 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'width' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'width' larger than 500 in request body", async () => {
        const payload = { width: 501, url: "https://example.com", height: 200 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'width' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'width' with negative value in request body", async () => {
        const payload = { width: -2, url: "https://example.com", height: 200 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'width' should be between 16 and 500",
            ]),
          })
        )
      })

      test("should return status 400 for 'width' with zero in request body", async () => {
        const payload = { width: 0, url: "https://example.com", height: 200 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'width' should be between 16 and 500",
            ]),
          })
        )
      })
    })

    describe("url parameter", () => {
      test("should return status 400 for missing 'url' in request body", async () => {
        const payload = { width: 200, height: 200 }
        const app = setupApp()
        const response = await request(app)
          .post(`/api/podcast/image`)
          .send(payload)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining(["'url' should be a valid url"]),
          })
        )
      })
    })
  })
})
