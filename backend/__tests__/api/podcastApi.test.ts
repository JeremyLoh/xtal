import { describe, expect, test, vi } from "vitest"
import ky from "ky"
import { PodcastIndexApi } from "../../api/podcastApi.js"
import { PodcastIndexTrendingPodcastResponse } from "../../api/responseType/podcastIndexPodcastTypes.js"
import {
  createPodcastFeed,
  createTrendingPodcastResponse,
} from "../testHelpers/builders/podcastIndexBuilder.js"

describe("podcastApi tests", () => {
  describe("getTrendingPodcasts", () => {
    test("should remove junk podcasts with less than 1 episode", async () => {
      vi.spyOn(ky, "get").mockResolvedValue({
        json: async () =>
          createTrendingPodcastResponse({
            feeds: [createPodcastFeed({ episodeCount: 0 })],
          }) satisfies PodcastIndexTrendingPodcastResponse,
      } as any)

      const api = new PodcastIndexApi()

      const result = await api.getTrendingPodcasts(
        new Headers(),
        new URLSearchParams()
      )

      expect(result).toHaveLength(0)
    })

    test("should remove junk podcasts with missing podcast title", async () => {
      vi.spyOn(ky, "get").mockResolvedValue({
        json: async () =>
          createTrendingPodcastResponse({
            feeds: [createPodcastFeed({ title: undefined })],
          }) satisfies PodcastIndexTrendingPodcastResponse,
      } as any)

      const api = new PodcastIndexApi()

      const result = await api.getTrendingPodcasts(
        new Headers(),
        new URLSearchParams()
      )

      expect(result).toHaveLength(0)
    })

    test("should remove junk podcasts with description of less than 20 characters", async () => {
      vi.spyOn(ky, "get").mockResolvedValue({
        json: async () =>
          createTrendingPodcastResponse({
            feeds: [
              createPodcastFeed({ description: "" }),
              createPodcastFeed({ description: "a".repeat(18) }),
              createPodcastFeed({ description: "a".repeat(19) }),
            ],
          }) satisfies PodcastIndexTrendingPodcastResponse,
      } as any)

      const api = new PodcastIndexApi()

      const result = await api.getTrendingPodcasts(
        new Headers(),
        new URLSearchParams()
      )

      expect(result).toHaveLength(0)
    })

    test("should remove junk podcasts with missing or empty image (image / artwork)", async () => {
      vi.spyOn(ky, "get").mockResolvedValue({
        json: async () =>
          createTrendingPodcastResponse({
            feeds: [
              createPodcastFeed({ image: undefined, artwork: undefined }),
              createPodcastFeed({ image: undefined, artwork: "" }),
              createPodcastFeed({ image: undefined, artwork: "    " }),
              createPodcastFeed({ image: "", artwork: undefined }),
              createPodcastFeed({ image: "", artwork: "" }),
              createPodcastFeed({ image: "", artwork: "     " }),
              createPodcastFeed({ image: "   ", artwork: undefined }),
              createPodcastFeed({ image: "   ", artwork: "" }),
              createPodcastFeed({ image: "   ", artwork: "   " }),
            ],
          }) satisfies PodcastIndexTrendingPodcastResponse,
      } as any)

      const api = new PodcastIndexApi()

      const result = await api.getTrendingPodcasts(
        new Headers(),
        new URLSearchParams()
      )

      expect(result).toHaveLength(0)
    })

    test("should parse trending podcast response correctly", async () => {
      vi.spyOn(ky, "get").mockResolvedValue({
        json: async () =>
          createTrendingPodcastResponse({
            feeds: [createPodcastFeed()],
          }) satisfies PodcastIndexTrendingPodcastResponse,
      } as any)

      const api = new PodcastIndexApi()

      const result = await api.getTrendingPodcasts(
        new Headers(),
        new URLSearchParams()
      )

      expect(result).toHaveLength(1)

      const {
        id,
        url,
        title,
        description,
        author,
        image,
        language,
        latestPublishTime,
        categories,
      } = result[0]

      expect(id).toBe(171183)
      expect(url).toBe("http://voicesofvr.com/?feed=podcast")
      expect(title).toBe("Voices of VR")
      expect(description).toBe(
        "Since May 2014, Kent Bye has published over 1000 Voices of VR podcast interviews featuring the pioneering artists, storytellers, and technologists driving the resurgence of virtual & augmented reality. He's an oral historian, experiential journalist, & aspiring philosopher, helping to define the patterns of immersive storytelling, experiential design, ethical frameworks, & the ultimate potential of XR."
      )
      expect(author).toBe("Kent Bye")
      expect(image).toBe(
        "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg"
      )
      expect(language).toBe("English (United States)")
      expect(latestPublishTime).toBe(1737835575)

      expect(categories).toHaveLength(6)
      expect(categories).toEqual(
        expect.arrayContaining([
          "Arts",
          "Design",
          "Technology",
          "Society",
          "Culture",
          "Philosophy",
        ])
      )

      expect(result[0]).not.toHaveProperty("episodeCount")
      expect(result[0]).not.toHaveProperty("isExplicit")
    })
  })
})
