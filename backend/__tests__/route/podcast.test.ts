import request from "supertest"
import { describe, expect, test } from "vitest"
import { setupApp } from "../../index.js"

describe("GET /podcast/trending", () => {
  describe("given zero URL parameters", () => {
    test("should respond with status 200", async () => {
      const app = setupApp()
      const response = await request(app).get("/podcast/trending")
      expect(response.status).toEqual(200)
    })

    test("should specify response content type header of application/json", async () => {
      const app = setupApp()
      const response = await request(app).get("/podcast/trending")
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("application/json")
      )
    })
  })
})
