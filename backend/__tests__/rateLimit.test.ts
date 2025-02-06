import request from "supertest"
import { describe, expect, test } from "vitest"
import { setupApp } from "../index.js"
import { getFrontendOrigin } from "./cors/origin.js"

describe("GET /api/podcast/trending", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const app = setupApp()
      const firstResponse = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(429)
      expect(secondResponse.error).toEqual(
        expect.objectContaining({
          status: 429,
          text: "Too many requests, please try again later.",
          method: "GET",
          path: "/api/podcast/trending?limit=10",
        })
      )
    })
  })
})

describe("GET /api/podcast/episodes", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const podcastId = "75075"
      const limit = 10
      const url = `/api/podcast/episodes?id=${podcastId}&limit=${limit}`
      const app = setupApp()
      const firstResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)

      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(429)
      expect(secondResponse.error).toEqual(
        expect.objectContaining({
          status: 429,
          text: "Too many requests, please try again later.",
          method: "GET",
          path: url,
        })
      )
    })
  })
})
