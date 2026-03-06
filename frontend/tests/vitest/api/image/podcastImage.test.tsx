import { renderHook, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import nock from "nock"
import { PropsWithChildren } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { createTestQueryClient } from "@tests/vitest/testUtils/queryUtils"
import { getPodcastImage, usePodcastImage } from "@/api/image/podcastImage"

describe("podcastImage tests", () => {
  const mockBackendOrigin = "http://localhost:22000"

  vi.mock("@/api/env/environmentVariables", () => ({
    getEnv: () => ({
      BACKEND_ORIGIN: "http://localhost:22000",
    }),
  }))

  describe("usePodcastImage", () => {
    it("should convert response image blob to url representing image", async () => {
      const blob = new Blob(["image"], { type: "image/png" })
      const url = "https://example.com/image.png"
      const width = 300
      const height = 300

      const scope = nock(mockBackendOrigin)
        .get("/api/podcast/image")
        .query({
          url,
          width,
          height,
        })
        .reply(200, blob)

      const queryClient = createTestQueryClient()

      const { result } = renderHook(
        () => usePodcastImage({ url, width, height }),
        {
          wrapper: ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          ),
        }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toMatch(/^blob:/)
      scope.done()
    })
  })

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
        new AbortController().signal,
        "https://example.com/image.png",
        300,
        300
      )

      expect(result).toMatch(/^blob:/)
      scope.done()
    })
  })
})
