import request from "supertest"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { NextFunction, Request, Response } from "express"
import {
  PODCAST_BY_FEED_ID_75075,
  PODCAST_EPISODES_BY_FEED_ID_75075,
} from "../mocks/podcast.js"
import { setupApp } from "../../index.js"
import { getFrontendOrigin } from "../cors/origin.js"
import { getSanitizedHtmlText } from "../../api/dom/htmlSanitize.js"
import { Language } from "../../model/podcast.js"

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
      },
    }
  })
}

describe("GET /api/podcast/episodes", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function getExpectedEpisodeData(podcastResponse: any, episodeItems: any[]) {
    // convert PodcastIndex API episode "items" response array to expected /api/podcast/episodes json response for "data"
    return {
      podcast: {
        id: podcastResponse.feed.id,
        title: podcastResponse.feed.title,
        url: podcastResponse.feed.link,
        description: getSanitizedHtmlText(
          podcastResponse.feed.description || ""
        ),
        author: podcastResponse.feed.author,
        image: podcastResponse.feed.image || podcastResponse.feed.artwork,
        language:
          Language[
            podcastResponse.feed.language.toLowerCase() as keyof typeof Language
          ],
        latestPublishTime: podcastResponse.feed.lastUpdateTime,
        itunesId: podcastResponse.feed.itunesId,
        isExplicit: podcastResponse.feed.explicit,
        episodeCount: podcastResponse.feed.episodeCount,
        categories: Object.values(podcastResponse.feed.categories),
      },
      episodes: episodeItems.map((episode) => {
        return {
          id: episode.id,
          feedId: episode.feedId,
          feedUrl: episode.feedUrl,
          title: episode.title,
          description: getSanitizedHtmlText(episode.description || ""),
          contentUrl: episode.enclosureUrl, // url link to episode file
          contentType: episode.enclosureType, // Content-Type of the episode file (e.g. mp3 => "audio\/mpeg")
          contentSizeInBytes: episode.enclosureLength,
          durationInSeconds: episode.duration,
          datePublished: episode.datePublished, // unix epoch time in seconds
          isExplicit: episode.explicit === 1, // Not explicit = 0. Explicit = 1
          episodeType: episode.episodeType, // type of episode. May be null for "liveItem"
          episodeNumber: episode.episode,
          seasonNumber: episode.season,
          image: episode.image || episode.feedImage,
          language:
            Language[
              episode.feedLanguage.toLowerCase() as keyof typeof Language
            ],
          people: episode.persons || null,
          externalWebsiteUrl: episode.link,
          transcripts: episode.transcripts || null,
          isActiveFeed: episode.feedDead !== 0,
        }
      }),
    }
  }

  describe("invalid parameters", () => {
    describe("id parameter", () => {
      test("should return status 400 for missing id parameter", async () => {
        const limit = "10"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/episodes?limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining(["'id' should be present"]),
          })
        )
      })

      test("should return status 400 for id parameter of empty string", async () => {
        const limit = "10"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/episodes?id=&limit=${limit}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining(["'id' should be present"]),
          })
        )
      })
    })

    describe("limit parameter", () => {
      test("should return status 400 for limit parameter of non numeric value", async () => {
        const podcastId = "75075"
        const limit = "a"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
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

      test("should return status 400 for limit parameter of negative value", async () => {
        const podcastId = "75075"
        const limit = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
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

      test("should return status 400 for limit parameter of zero", async () => {
        const podcastId = "75075"
        const limit = "0"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
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

      test("should return status 400 for limit parameter of 101", async () => {
        const podcastId = "75075"
        const limit = "101"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
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
      test("should return status 400 for negative offset parameter of -1", async () => {
        const podcastId = "75075"
        const limit = "10"
        const offset = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(
            `/api/podcast/episodes?id=${podcastId}&limit=${limit}&offset=${offset}`
          )
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })

      test("should return status 400 for offset parameter of zero", async () => {
        const podcastId = "75075"
        const limit = "10"
        const offset = "0"
        const app = setupApp()
        const response = await request(app)
          .get(
            `/api/podcast/episodes?id=${podcastId}&limit=${limit}&offset=${offset}`
          )
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })

      test("should return status 400 for offset parameter of more than 1000", async () => {
        const podcastId = "75075"
        const limit = "10"
        const offset = "1001"
        const app = setupApp()
        const response = await request(app)
          .get(
            `/api/podcast/episodes?id=${podcastId}&limit=${limit}&offset=${offset}`
          )
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })

      test("should return status 400 for non numeric offset parameter", async () => {
        const podcastId = "75075"
        const limit = "10"
        const offset = "e"
        const app = setupApp()
        const response = await request(app)
          .get(
            `/api/podcast/episodes?id=${podcastId}&limit=${limit}&offset=${offset}`
          )
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 1 and 1000",
            ]),
          })
        )
      })
    })
  })

  test("should specify response content type header of application/json", async () => {
    const podcastId = "75075"
    const limit = "10"
    const app = setupApp()
    const response = await request(app)
      .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
      .set("Origin", expectedOrigin)
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("application/json")
    )
  })

  describe("limit parameter", () => {
    test("should return 10 episodes based on a podcast id (PodcastIndex Feed Id)", async () => {
      const podcastId = "75075"
      const limit = "10"
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: 10,
          data: getExpectedEpisodeData(
            PODCAST_BY_FEED_ID_75075,
            PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(0, 10)
          ),
        })
      )
    })

    test("should return 1 episode based on a podcast id (PodcastIndex Feed Id)", async () => {
      const podcastId = "75075"
      const limit = "1"
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/episodes?id=${podcastId}&limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: 1,
          data: getExpectedEpisodeData(
            PODCAST_BY_FEED_ID_75075,
            PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(0, 1)
          ),
        })
      )
    })

    test("should return 10 episodes by default if no limit parameter is given", async () => {
      const podcastId = "75075"
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/episodes?id=${podcastId}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: 10,
          data: getExpectedEpisodeData(
            PODCAST_BY_FEED_ID_75075,
            PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(0, 10)
          ),
        })
      )
    })
  })

  describe("offset parameter", () => {
    test("should return 5 episodes with parameters offset of 10 and limit of 5", async () => {
      const podcastId = "75075"
      const limit = "5"
      const offset = "10"
      const app = setupApp()
      const response = await request(app)
        .get(
          `/api/podcast/episodes?id=${podcastId}&limit=${limit}&offset=${offset}`
        )
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: 5,
          data: getExpectedEpisodeData(
            PODCAST_BY_FEED_ID_75075,
            PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(10, 15)
          ),
        })
      )
    })
  })
})
