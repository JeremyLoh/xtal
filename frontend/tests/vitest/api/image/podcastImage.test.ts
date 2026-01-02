import { vi } from "vitest"
import nock from "nock"
import { getPodcastImage } from "@/api/image/podcastImage"

describe("podcastImage tests", () => {
  const mockBackendOrigin = "http://localhost:22000"

  vi.mock("@/api/env/environmentVariables", () => ({
    getEnv: () => ({
      BACKEND_ORIGIN: "http://localhost:22000",
    }),
  }))

  describe("getPodcastImage", () => {
    it("should convert response image blob to url representing image", async () => {
      const blob = new Blob(["image"], { type: "image/png" })

      const scope = nock(mockBackendOrigin)
        .get("/api/podcast/image")
        .query({
          url: "https://example.com/image.png",
          width: "300",
          height: "300",
        })
        .reply(200, blob)

      const result = await getPodcastImage(
        new AbortController(),
        "https://example.com/image.png",
        300,
        300
      )

      expect(result).toMatch(/^blob:/)
      scope.done()
    })
  })
})
