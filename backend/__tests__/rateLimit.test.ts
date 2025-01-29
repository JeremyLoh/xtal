import request from "supertest"
import { describe, expect, test } from "vitest"
import { setupApp } from "../index.js"

describe("GET /podcast/trending", () => {
  describe("rate limit", () => {
    test("should return HTTP 429 when rate limit is exceeded", async () => {
      const app = setupApp()
      const firstResponse = await request(app).get("/podcast/trending?limit=10")
      const secondResponse = await request(app).get(
        "/podcast/trending?limit=10"
      )
      expect(firstResponse.status).toEqual(200)
      expect(secondResponse.status).toEqual(429)
      expect(secondResponse.error).toEqual(
        expect.objectContaining({
          status: 429,
          text: "Too many requests, please try again later.",
          method: "GET",
          path: "/podcast/trending?limit=10",
        })
      )
    })
  })
})
