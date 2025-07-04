import request from "supertest"
import { describe, expect, test } from "vitest"
import { setupApp } from "../index.js"
import { getFrontendOrigin } from "./cors/origin.js"

describe("GET /status", () => {
  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const app = setupApp()
      const firstResponse = await request(app).get("/status")
      const secondResponse = await request(app).get("/status")
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(429)
    })
  })
})

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
      const thirdResponse = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(200)
      expect(thirdResponse.status).toEqual(429)
      expect(thirdResponse.error).toEqual(
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

describe("GET /api/podcast/search", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const limit = "10"
      const query = "syntax"
      const url = `/api/podcast/search?q=${query}&limit=${limit}`
      const app = setupApp()
      const firstResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const thirdResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(200)
      expect(thirdResponse.status).toEqual(429)
      expect(thirdResponse.error).toEqual(
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

describe("GET /api/podcast/episode", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const podcastEpisodeId = "16795090"
      const url = `/api/podcast/episode?id=${podcastEpisodeId}`
      const app = setupApp()
      const firstResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const thirdResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(200)
      expect(thirdResponse.status).toEqual(429)
      expect(thirdResponse.error).toEqual(
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
      const thirdResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(200)
      expect(thirdResponse.status).toEqual(429)
      expect(thirdResponse.error).toEqual(
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

describe("GET /api/podcast/image", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    // enable selectively, it hits the actual Supabase endpoint
    test.skip("should return HTTP 429 when rate limit is exceeded", async () => {
      const url = "/api/podcast/image"
      const payload = {
        url: "https://placehold.co/3000x3000",
        width: 200,
        height: 200,
      }
      const app = setupApp()
      const firstResponse = await request(app)
        .get(
          `/api/podcast/image?url=${payload.url}&width=${payload.width}&height=${payload.height}`
        )
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get(
          `/api/podcast/image?url=${payload.url}&width=${payload.width}&height=${payload.height}`
        )
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Origin", expectedOrigin)

      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(429)
      expect(secondResponse.error).toEqual(
        expect.objectContaining({
          status: 429,
          text: "Too many requests, please try again later.",
          method: "POST",
          path: url,
        })
      )
    })
  })
})

describe("GET /api/podcast/category", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const url = "/api/podcast/category"
      const app = setupApp()
      const firstResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const thirdResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(200)
      expect(thirdResponse.status).toEqual(429)
      expect(thirdResponse.error).toEqual(
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

describe("GET /api/podcast/stats/current", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const url = "/api/podcast/stats/current"
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

describe("GET /api/podcast/recent", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      // use endpoint where mock data will be returned for request
      const limit = 5
      const url = `/api/podcast/recent?limit=${limit}`
      const app = setupApp()
      const firstResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const secondResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      const thirdResponse = await request(app)
        .get(url)
        .set("Origin", expectedOrigin)
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(200)
      expect(thirdResponse.status).toEqual(429)
      expect(thirdResponse.error).toEqual(
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
