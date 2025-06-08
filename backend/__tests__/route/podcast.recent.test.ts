import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import request from "supertest"
import { NextFunction, Request, Response } from "express"
import { getFrontendOrigin } from "../cors/origin.js"
import { setupApp } from "../../index.js"
import { Language } from "../../model/podcast.js"
import {
  JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES,
  PODCAST_RECENT_FIVE_ENTRIES,
  RecentPodcastResponseType,
} from "../mocks/data/podcastRecent.js"
import { getSanitizedHtmlText } from "../../api/dom/htmlSanitize.js"

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

describe("GET /api/podcast/recent", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("CORS configuration", () => {
    test("should return status code 200 and allow environment variable FRONTEND_ORIGIN origin", async () => {
      // use endpoint where mock data will be returned for request
      const limit = 5
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": expectedOrigin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 500 for empty origin", async () => {
      const origin = ""
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/recent")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })

    test("should return status code 500 for origin that does not match environment variable FRONTEND_ORIGIN", async () => {
      const origin = "http://example.com"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/recent")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })
  })

  describe("invalid parameters", () => {
    describe("limit parameter", () => {
      test("should respond with status 400 for limit parameter of zero", async () => {
        const limit = "0"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
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

      test("should respond with status 400 for limit parameter of negative number", async () => {
        const limit = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
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

      test("should respond with status 400 for limit parameter of positive floating point number", async () => {
        const limit = "2.01"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
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

      test("should respond with status 400 for limit parameter of non integer values", async () => {
        const limit = "a"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?limit=${limit}`)
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
      test("should respond with status 400 for offset parameter of empty string", async () => {
        const offset = ""
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of negative integer", async () => {
        const offset = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter greater than 500", async () => {
        const offset = "501"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of floating point number", async () => {
        const offset = "2.01"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })

      test("should respond with status 400 for offset parameter of non integer", async () => {
        const offset = "a"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?offset=${offset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 500",
            ]),
          })
        )
      })
    })

    describe("lang parameter", () => {
      test("should respond with status 400 for lang parameter of empty string", async () => {
        const lang = ""
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?lang=${lang}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
                Language
              )}`,
            ]),
          })
        )
      })

      test("should respond with status 400 for lang parameter that is not ISO 639 language code", async () => {
        const lang = "test"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?lang=${lang}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
                Language
              )}`,
            ]),
          })
        )
      })

      test("should respond with status 400 for lang parameter that has extra punctuation", async () => {
        const lang = "en:"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?lang=${lang}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
                Language
              )}`,
            ]),
          })
        )
      })
    })

    describe("exclude parameter", () => {
      test("should respond with status 400 for exclude parameter that is empty string", async () => {
        const exclude = ""
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?exclude=${exclude}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'exclude' should be a valid value in 'description'`,
            ]),
          })
        )
      })

      test("should respond with status 400 for exclude parameter that is not a valid value", async () => {
        const exclude = "desc"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/recent?exclude=${exclude}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toBe(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              `'exclude' should be a valid value in 'description'`,
            ]),
          })
        )
      })
    })
  })

  describe("get recent podcasts", () => {
    function getExpectedResponsePodcastRecentEntries(
      responseData: RecentPodcastResponseType
    ) {
      return responseData.feeds.map((d) => {
        return {
          id: d.id,
          url: d.url,
          title: d.title,
          latestPublishTime: d.newestItemPublishTime,
          description: getSanitizedHtmlText(d.description),
          image: d.image,
          author: "", // no author info is available from endpoint
          language: Language[d.language.toLowerCase() as keyof typeof Language],
          categories: d.categories
            ? expect.arrayContaining(Object.values(d.categories))
            : [],
        }
      })
    }

    test("should get 5 recent podcasts when query parameter ?limit=5 is provided", async () => {
      const expectedResponseData = PODCAST_RECENT_FIVE_ENTRIES
      const limit = 5
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntries(expectedResponseData)
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })

    test("should get offset one recent podcast", async () => {
      const expectedResponseData = {
        ...PODCAST_RECENT_FIVE_ENTRIES,
        count: 4,
        feeds: PODCAST_RECENT_FIVE_ENTRIES.feeds.slice(1, 5),
      }
      const limit = 4
      const offset = 1 // ensure limit + offset = 5 (for mock data query parameter ?max=5)
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}&offset=${offset}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntries(expectedResponseData)
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })

    test("should get offset two recent podcast", async () => {
      const expectedResponseData = {
        ...PODCAST_RECENT_FIVE_ENTRIES,
        count: 3,
        feeds: PODCAST_RECENT_FIVE_ENTRIES.feeds.slice(2, 5),
      }
      const limit = 3
      const offset = 2 // ensure limit + offset = 5 (for mock data query parameter ?max=5)
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}&offset=${offset}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntries(expectedResponseData)
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })

    test("should get recent podcasts with one language filter", async () => {
      const expectedResponseData = JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES
      const limit = 10
      const lang = "ja"
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}&lang=${lang}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntries(expectedResponseData)
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })

    test("should get recent podcasts with one language filter and offset", async () => {
      const expectedResponseData = {
        ...JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES,
        count: 4,
        feeds: JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES.feeds.slice(6, 10),
      }
      const limit = 4
      const offset = 6 // ensure limit + offset = 10 (for mock data query parameter ?max=10)
      const lang = "ja"
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}&lang=${lang}&offset=${offset}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntries(expectedResponseData)
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })
  })

  describe("get recent podcasts excluding description", () => {
    function getExpectedResponsePodcastRecentEntriesWithoutDescription(
      responseData: RecentPodcastResponseType
    ) {
      return responseData.feeds.map((d) => {
        return {
          id: d.id,
          url: d.url,
          title: d.title,
          latestPublishTime: d.newestItemPublishTime,
          image: d.image,
          author: "", // no author info is available from endpoint
          language: Language[d.language.toLowerCase() as keyof typeof Language],
          categories: d.categories
            ? expect.arrayContaining(Object.values(d.categories))
            : [],
        }
      })
    }

    test("should get recent podcasts with exclude description", async () => {
      const expectedResponseData = PODCAST_RECENT_FIVE_ENTRIES
      const exclude = "description"
      const limit = 5
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/recent?limit=${limit}&exclude=${exclude}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntriesWithoutDescription(
              expectedResponseData
            )
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })

    test("should get recent podcasts with offset and exclude description", async () => {
      const expectedResponseData = {
        ...PODCAST_RECENT_FIVE_ENTRIES,
        count: 3,
        feeds: PODCAST_RECENT_FIVE_ENTRIES.feeds.slice(2, 5),
      }
      const exclude = "description"
      const limit = 3
      const offset = 2 // ensure limit + offset = 5 (for mock data query parameter ?max=5)
      const app = setupApp()
      const response = await request(app)
        .get(
          `/api/podcast/recent?limit=${limit}&offset=${offset}&exclude=${exclude}`
        )
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: expectedResponseData.count,
          data: expect.arrayContaining(
            getExpectedResponsePodcastRecentEntriesWithoutDescription(
              expectedResponseData
            )
          ),
        })
      )
      expect(response.headers).toEqual(
        expect.objectContaining({
          "content-type": expect.stringContaining("application/json;"),
        })
      )
    })
  })
})
