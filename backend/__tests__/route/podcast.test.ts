import dayjs from "dayjs"
import request from "supertest"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { NextFunction, Request, Response } from "express"
import { setupApp } from "../../index.js"
import { getFrontendOrigin } from "../cors/origin.js"
import { PODCAST_BY_FEED_ID_75075 } from "../mocks/podcast.js"
import { getSanitizedHtmlText } from "../../api/dom/htmlSanitize.js"

function getMockMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => next()
}

function mockRateLimiters() {
  vi.mock("../../middleware/rateLimiter.js", () => {
    return {
      default: {
        getTrendingPodcastLimiter: getMockMiddleware(),
        getPodcastEpisodesLimiter: getMockMiddleware(),
      },
    }
  })
}

describe("GET /api/podcast/episodes", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  function getExpectedEpisodeData(episodeItems: any[]) {
    // convert PodcastIndex API episode "items" response array to expected /api/podcast/episodes json response for "data"
    return episodeItems.map((episode) => {
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
        language: episode.feedLanguage,
        people: episode.persons,
        externalWebsiteUrl: episode.link,
        transcripts: episode.transcripts,
        isActiveFeed: episode.feedDead !== 0,
      }
    })
  }

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("invalid parameters", () => {
    describe("limit parameter", () => {
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
            PODCAST_BY_FEED_ID_75075.items.slice(0, 10)
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
            PODCAST_BY_FEED_ID_75075.items.slice(0, 1)
          ),
        })
      )
    })
  })
})

describe("GET /api/podcast/trending", () => {
  const expectedOrigin = getFrontendOrigin() || ""

  beforeEach(() => {
    mockRateLimiters()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("CORS configuration", () => {
    test("should return status code 200 and allow environment variable FRONTEND_ORIGIN origin", async () => {
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", expectedOrigin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": expectedOrigin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 200 for query string of environment variable FRONTEND_ORIGIN origin", async () => {
      const origin = new URL(expectedOrigin).origin + "?firstQueryString=first"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 200 for nested page path of environment variable FRONTEND_ORIGIN origin", async () => {
      const origin = new URL(expectedOrigin).origin + "/nested/path"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 200 for nested page path with query string of environment variable FRONTEND_ORIGIN origin", async () => {
      const origin =
        new URL(expectedOrigin).origin +
        "/nested/path?firstQueryString=first&secondQueryString=2b"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(200)
      expect(response.headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        })
      )
    })

    test("should return status code 500 for empty origin", async () => {
      const origin = ""
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })

    test("should return status code 500 for * origin", async () => {
      const origin = "*"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })

    test("should return status code 500 for origin that does not match environment variable FRONTEND_ORIGIN", async () => {
      const origin = "http://example.com"
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending?limit=10")
        .set("Origin", origin)
      expect(response.status).toBe(500)
    })
  })

  describe("given invalid URL parameters", () => {
    describe("limit parameter (count of podcasts to return)", () => {
      test("should respond with status 400 for limit parameter of zero", async () => {
        const app = setupApp()
        const response = await request(app)
          .get("/api/podcast/trending?limit=0")
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for limit parameter of 101", async () => {
        const app = setupApp()
        const response = await request(app)
          .get("/api/podcast/trending?limit=101")
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })

      test("should respond with status 400 for negative limit parameter", async () => {
        const app = setupApp()
        const response = await request(app)
          .get("/api/podcast/trending?limit=-1")
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'limit' should be between 1 and 100",
            ]),
          })
        )
      })
    })

    describe("since parameter (unix timestamp in seconds)", () => {
      test("should respond with status 400 for since parameter with unix timestamp (in seconds) of a future date", async () => {
        const futureUnixTimestampInSeconds = dayjs().add(20, "minute").unix()
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?since=${futureUnixTimestampInSeconds}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be before current unix timestamp",
            ]),
          })
        )
      })

      test("should respond with status 400 for since parameter with invalid unix timestamp of more than 120 days", async () => {
        const before120days = dayjs().subtract(120, "day").unix()
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?since=${before120days}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be between 120 days before current unix timestamp to current unix timestamp",
            ]),
          })
        )
      })

      test("should respond with status 400 for since parameter with invalid unix timestamp that is too large", async () => {
        // largest (32-bit) unix timestamp is 2147483647
        const invalidLargeTimestamp = "2147483648"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?since=${invalidLargeTimestamp}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be before current unix timestamp",
            ]),
          })
        )
      })

      test("should respond with status 400 for since parameter that is not a number", async () => {
        const invalidStringInput = "3e"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?since=${invalidStringInput}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'since' should be a number representing a unix timestamp between 120 days before current unix timestamp to current unix timestamp",
            ]),
          })
        )
      })
    })
  })

  describe("given zero URL parameters", () => {
    test("should respond with status 200", async () => {
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)
      expect(response.status).toEqual(200)
    })

    test("should specify response content type header of application/json", async () => {
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("application/json")
      )
    })

    test("should return list of 10 trending podcasts with no search parameters", async () => {
      const app = setupApp()
      const response = await request(app)
        .get("/api/podcast/trending")
        .set("Origin", expectedOrigin)
      assertDefaultTrendingPodcasts(response.body)
    })

    function assertDefaultTrendingPodcasts(body: Object) {
      expect(body).toEqual(
        expect.objectContaining({
          count: 10,
          data: [
            {
              id: 540295,
              url: "https://fapi-top.prisasd.com/podcast/wradiomexico/asi_las_cosas_con_carlos_loret_de_mola/itunestfp/podcast.xml",
              title: "As\u00ed las cosas con Carlos Loret de Mola",
              description: "Programa de tarde con Carlos Loret de Mola.",
              author: "WRadio",
              image:
                "https://wradio.com.mx/especiales/podcast/mx-wradio-alc-loret-040724.jpg",
              latestPublishTime: 1737835320,
              itunesId: 1488142226,
              trendScore: 9,
              language: "Spanish (Spain)", // "es-ES"
              categories: expect.arrayContaining(["News", "Daily"]),
            },
            {
              id: 171183,
              url: "http://voicesofvr.com/?feed=podcast",
              title: "Voices of VR",
              description:
                "Since May 2014, Kent Bye has published over 1000 Voices of VR podcast interviews featuring the pioneering artists, storytellers, and technologists driving the resurgence of virtual & augmented reality. He's an oral historian, experiential journalist, & aspiring philosopher, helping to define the patterns of immersive storytelling, experiential design, ethical frameworks, & the ultimate potential of XR.",
              author: "Kent Bye",
              image:
                "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg",
              latestPublishTime: 1737835575,
              itunesId: 874947046,
              trendScore: 9,
              language: "English (United States)", // "en-US"
              categories: expect.arrayContaining([
                "Arts",
                "Design",
                "Technology",
                "Society",
                "Culture",
                "Philosophy",
              ]),
            },
            {
              id: 7031055,
              url: "https://media.rss.com/episode-1-stephen-brown/feed.xml",
              title: "Bank on it: Life in Sports with Noah Banks",
              description:
                '<p>Introducing <strong>Bank on it: A Life in Sports with Noah Banks</strong>, the networking podcast where Noah Banks connects with industry experts across the world of sports. Each episode dives deep into engaging conversations with athletes, executives, and innovators, providing listeners with insider insights and invaluable career advice. Whether you\'re looking to grow your network or just love hearing from the best in the business, this podcast gives you front-row access to the stories and strategies shaping the future of sports.</p><p>Follow Noah on <a href="https://twitter.com/Banx_Leaf" rel="noopener">Twitter @Banx_Leaf</a> and never miss an episode. Join the conversation and expand your network today!</p>',
              author: "Noah Banks",
              image:
                "https://media.rss.com/episode-1-stephen-brown/20241005_061038_717e6bec0151a051e602bf6f35e5f0b4.png",
              latestPublishTime: 1737835652,
              itunesId: 1771227892,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Sports",
                "Business",
                "Entrepreneurship",
              ]),
            },
            {
              id: 5874430,
              url: "https://audioboom.com/channels/5135319.rss",
              title: "Stavvy's World",
              description:
                "A podcast where you can hang out with your pal Stav\nEvery week Stavros Halkias and his friends will help you solve all your problems. Wanna be a part of the show? Call 904-800-STAV, leave a voicemail and get some advice!",
              author: "Stavros Halkias",
              image: "https://audioboom.com/i/41822321.jpg",
              latestPublishTime: 1737835698,
              itunesId: 1657458632,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Comedy",
                "Interviews",
                "Stand-up",
                "Improv",
              ]),
            },
            {
              id: 320763,
              url: "https://www.spreaker.com/show/3276901/episodes/feed",
              title: "Yaron Brook Show",
              description:
                'Yaron Brook discusses news, culture and politics from the principled perspective of Ayn Rand\'s philosophy, Objectivism. <br><br>Want more? Visit www.YaronBrookShow.com and become a Yaron Brook Show supporter to get exclusive content and support the creation of more content like this! https://www.patreon.com/YaronBrookShow.<br><br>Become a supporter of this podcast: <a href="https://www.spreaker.com/podcast/yaron-brook-show--3276901/support?utm_source=rss&amp;utm_medium=rss&amp;utm_campaign=rss">https://www.spreaker.com/podcast/yaron-brook-show--3276901/support</a>.',
              author: "Yaron Brook",
              image:
                "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/05714427c5ec56fdeaef37ed2defdfdd.jpg",
              latestPublishTime: 1737835746,
              itunesId: 964330550,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining(["Religion", "Spirituality"]),
            },
            {
              id: 437920,
              url: "http://www.spreaker.com/user/9154993/episodes/feed",
              title: "Book Chat W/Author Vivian E. Moore",
              description: "Pacing Your Creative Race",
              author: "Author Vivian E. Moore",
              image:
                "https://pbcdn1.podbean.com/imglogo/image-logo/15892259/e8c023c481d071de8827991bed3af7e8.jpg",
              latestPublishTime: 1737835800,
              itunesId: 1239048003,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Arts",
                "Education",
                "How To",
              ]),
            },
            {
              id: 464425,
              url: "https://feed.podbean.com/bgtfn7n7gcm/feed.xml",
              title: "Book Chat W/Author Vivian E. Moore",
              description: "Pacing Your Creative Race",
              author: "Author Vivian E. Moore",
              image:
                "https://pbcdn1.podbean.com/imglogo/image-logo/15892259/e8c023c481d071de8827991bed3af7e8.jpg",
              latestPublishTime: 1737835800,
              itunesId: 1467520154,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Arts",
                "Education",
                "How To",
              ]),
            },
            {
              id: 873817,
              url: "https://www.spreaker.com/show/2448531/episodes/feed",
              title: "The Travel Show",
              description:
                "The Travel Show with Larry Gelwix and Don Shafer on 105.9 KNRS and the Summit Radio Network in Salt Lake City.",
              author: "Talk Radio 105.9 - KNRS (KNRS-FM)",
              image:
                "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/1177dcea21e81aea019d14a423e66544.jpg",
              latestPublishTime: 1737835832,
              itunesId: 1253130544,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Society",
                "Culture",
                "Places",
                "Travel",
              ]),
            },
            {
              id: 1367573,
              url: "https://anesthesiaguidebook.com/feed/podcast/",
              title: "Anesthesia Guidebook",
              description:
                "Anesthesia Guidebook is the go-to guide for providers who want to master their craft.  We help anesthesia providers thrive in challenging, high-stakes careers through our relevant, compelling guides. You\u2019re on a path to becoming a master anesthesia provider. We\u2019re your go-to guide for deepening your anesthesia practice.",
              author: "Jon Lowrance",
              image:
                "https://anesthesiaguidebook.com/wp-content/uploads/powerpress/Anesthesia_Guidebook_subtitle_border_scaled-640.jpg",
              latestPublishTime: 1737836048,
              itunesId: 1528907211,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Health",
                "Fitness",
                "Medicine",
                "Education",
                "Science",
                "Life",
              ]),
            },
            {
              id: 5630444,
              url: "https://feed.podbean.com/TheSovereignSoul/feed.xml",
              title:
                "THE SOVEREIGN SOUL Show: Cutting Edge Topics, Guests & Awakened Truth Bombs with lotsa Love, Levity \u2019n Liberty.",
              description:
                "Listen in as two Reiki Masters and Entrepreneurs -- one with a background from the Canadian Infantry, the other a former Attorney from Chicago -- share how you can Tap Into Your Natural Born SUPER Powers, discuss why the Chakras are leaving our new earth, ancient healing arts of Jesus & Buddha, plus Quantum Entanglement, Telepathy, and StarSeeds arriving to help accelerate the Great Awakening of Humanity\u2019s Consciousness.",
              author: "The Sovereign Soul Show",
              image:
                "https://pbcdn1.podbean.com/imglogo/image-logo/14303876/The_Sovereign_Soul_show_host_The_Bling_d_Buddhapodcast_image_3k_x_3k6i3mg.jpeg",
              latestPublishTime: 1737836195,
              itunesId: 1625157350,
              trendScore: 9,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Education",
                "Society",
                "Culture",
                "Self Improvement",
              ]),
            },
          ],
        })
      )
    }
  })
})
