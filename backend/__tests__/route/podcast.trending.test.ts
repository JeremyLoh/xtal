import dayjs from "dayjs"
import request from "supertest"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { NextFunction, Request, Response } from "express"
import { setupApp } from "../../index.js"
import { getFrontendOrigin } from "../cors/origin.js"

function getMockMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => next()
}

function mockRateLimiters() {
  vi.mock("../../middleware/rateLimiter.js", () => {
    return {
      default: {
        getTrendingPodcastLimiter: getMockMiddleware(),
        getPodcastSearchLimiter: getMockMiddleware(),
        getPodcastEpisodeLimiter: getMockMiddleware(),
        getPodcastEpisodesLimiter: getMockMiddleware(),
        getPodcastImageConversionLimiter: getMockMiddleware(),
        getPodcastCategoryLimiter: getMockMiddleware(),
        getStatusLimiter: getMockMiddleware(),
        deleteAccountLimiter: getMockMiddleware(),
        getAccountPlayHistoryLimiter: getMockMiddleware(),
        getAccountPlayHistoryTimestampLimiter: getMockMiddleware(),
        deleteAccountPlayHistoryLimiter: getMockMiddleware(),
        updateAccountPlayHistoryLimiter: getMockMiddleware(),
        getAccountPlayHistoryCountLimiter: getMockMiddleware(),
        addAccountFollowPodcastLimiter: getMockMiddleware(),
        removeAccountFollowPodcastLimiter: getMockMiddleware(),
        getAccountFollowPodcastLimiter: getMockMiddleware(),
        getAccountFollowingPodcastLimiter: getMockMiddleware(),
        getAccountTotalCountFollowingPodcastLimiter: getMockMiddleware(),
      },
    }
  })
}

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
    describe("category parameter (podcast category to search)", () => {
      test("should respond with status 400 for category parameter of empty string", async () => {
        const app = setupApp()
        const response = await request(app)
          .get("/api/podcast/trending?category=")
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'category' should have length between 1 and 1000",
            ]),
          })
        )
      })
    })

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

    describe("offset parameter", () => {
      test("should respond with status 400 for negative offset parameter", async () => {
        const invalidNegativeOffset = "-1"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?offset=${invalidNegativeOffset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 1000",
            ]),
          })
        )
      })

      test("should respond with status 400 for 1001 offset parameter", async () => {
        const invalidMaxOffset = "1001"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?offset=${invalidMaxOffset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 1000",
            ]),
          })
        )
      })

      test("should respond with status 400 for non numeric offset parameter", async () => {
        const invalidMaxOffset = "5e"
        const app = setupApp()
        const response = await request(app)
          .get(`/api/podcast/trending?offset=${invalidMaxOffset}`)
          .set("Origin", expectedOrigin)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
          expect.objectContaining({
            errors: expect.arrayContaining([
              "'offset' should be between 0 and 1000",
            ]),
          })
        )
      })
    })
  })

  describe("given one category", () => {
    test("should respond with podcasts in given category", async () => {
      const expectedCategory = "arts"
      const limit = "10"
      const app = setupApp()
      const response = await request(app)
        .get(
          `/api/podcast/trending?limit=${limit}&category=${expectedCategory}`
        )
        .set("Origin", expectedOrigin)
      expect(response.status).toEqual(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          count: 10,
          data: expect.arrayContaining([
            {
              id: 2234623,
              url: "https://www.ximalaya.com/album/43044571.xml",
              title: "\u563b\u8c08\u5f55",
              description:
                "\u563b\u8c08\u5f55\u662f\u6700\u6b63\u80fd\u91cf\u7684\u559c\u5267\u64ad\u5ba2\u4e4b\u4e00\uff0c\u559c\u5267\u6f14\u5458\u7684\u641e\u7b11\u5206\u8d1d\u5236\u9020\u673a\uff0c\u4e13\u6ce8\u563b\u8c08\u5f55\u3002\u4e0d\u5b9a\u671f\u9080\u8bf7\u4e0d\u540c\u7684\u5355\u53e3\u559c\u5267\u6f14\u5458\u548c\u89c2\u4f17\uff0c\u57fa\u4e8e\u5404\u7c7b\u8bdd\u9898\u804a\u5929\uff0c\u65e8\u5728\u4f20\u64ad\u79ef\u6781\u9633\u5149\u7684\u4e50\u89c2\u4e3b\u4e49\u7cbe\u795e\uff0c\u4e3a\u4eba\u6c11\u7fa4\u4f17\u7684\u594b\u6597\u751f\u6d3b\u63d0\u4f9b\u4e00\u79cd\u8f7b\u677e\u7684\u6b63\u80fd\u91cf\u89e3\u538b\u65b9\u5f0f\uff0c\u4fc3\u8fdb\u5e7f\u5927\u9752\u5e74\u9762\u5411\u8fdb\u6b65\u3002\n\u6bcf\u4e00\u671f\u6211\u4eec\u90fd\u4f1a\u9080\u8bf7\u542c\u4f17\u6765\u73b0\u573a\u5f55\u5236\uff0c\u5982\u679c\u4f60\u60f3\u5f53\u9762\u548c\u4e3b\u64ad\u804a\u5929\u5e76\u5f55\u5165\u8282\u76ee\uff0c\u6b22\u8fce\u5173\u6ce8\u5fae\u4fe1\u542c\u53cb\u7fa4\u6216\u8005\u516c\u4f17\u53f7\u3010\u563b\u8c08\u5f55\u3011\u3002",
              author: "\u563b\u8c08\u5f55",
              image:
                "https://fdfs.xmcdn.com/storages/2d4e-audiofreehighqps/A3/6F/CMCoOSIEFUiuAAhFeQCOIsiD.jpeg",
              latestPublishTime: 1739684931,
              language: "Chinese (Simplified)", // "zh-cn"
              categories: expect.arrayContaining([
                "Arts",
                "Performing",
                "Comedy",
                "Interviews",
              ]),
            },
            {
              id: 854189,
              url: "https://fapi-top.prisasd.com/podcast/playser/un_libro_una_hora/itunestfp/podcast.xml",
              title: "Un Libro Una Hora",
              description:
                "Aprende a leer, aprende de literatura escuchando. Un programa para contar un libro en una hora. Grandes cl\u00e1sicos de la literatura que te entran por el o\u00eddo. Dirigido por Antonio Mart\u00ednez Asensio, cr\u00edtico literario, productor, escritor y guionista. En directo los domingos a las 05:00 y a cualquier hora si te suscribes. En Podimo, \u00bfY ahora qu\u00e9 leo? nuestro spin off con los imprescindibles de la temporada https://go.podimo.com/es/ahoraqueleo",
              author: "SER Podcast",
              image:
                "https://sdmedia.playser.cadenaser.com/playser/image/20244/10/1712744718917_318.jpeg",
              latestPublishTime: 1739685600,
              language: "Spanish (Spain)", // "es-ES"
              categories: expect.arrayContaining(["Arts"]),
            },
            {
              id: 1320027,
              url: "https://feeds.buzzsprout.com/1429228.rss",
              title: "Celebrate Poe",
              description:
                'This podcast is a deep dive into the life, times. works. and influences of Edgar Allan Poe - "America\'s Shakespeare."   Mr. Poe comes to life in this weekly podcast!',
              author: "George Bartley",
              image:
                "https://storage.buzzsprout.com/0py7ywli6pabgw17u8lxygq47qqz?.jpg",
              latestPublishTime: 1739685600,
              language: "English (United States)", // "en-us"
              categories: expect.arrayContaining([
                "Education",
                "History",
                "Arts",
                "Books",
              ]),
            },
            {
              id: 6269103,
              url: "https://feeds.buzzsprout.com/2164615.rss",
              title: "The Bible Breakdown",
              description:
                "<div>Welcome to \"The Bible Breakdown,\" where we break down God’s Word so we can know God better. I'm your host, Brandon Cannon, and I'm here to guide you through the pages of the Bible, one day at a time.</div><div></div><div>Each day, we'll read through a section of the Bible and explore key themes, motifs, and teachings. Whether you're new to the Bible or a seasoned veteran, I guarantee you'll find something insightful or inspiring. My hope is to encourage you to dive deeper and deeper.&nbsp;</div><div></div><div>So grab your Bible, your journal, your coffee, and join me on this journey of faith and discovery. And don't forget to hit that subscribe button to stay up-to-date with our daily readings and breakdowns.</div><div></div><div>Remember, as we journey through the pages of the Bible together, we're not just reading a book, we're unlocking the secrets to eternal life. The more we dig, the more we find! Let's get started!Bible reading plan and SOAP guide: www.experiencerlc.com/the-bible&nbsp;Subscribe to&nbsp; my weekly newsletter: www.brandoncannon.com</div>",
              author: "Brandon Cannon",
              image:
                "https://storage.buzzsprout.com/qu7qz0fhvf5520cfh3hjys97985q?.jpg",
              latestPublishTime: 1739685600,
              language: "English (United States)", // "en-us"
              categories: expect.arrayContaining([
                "Arts",
                "Performing",
                "Religion",
                "Spirituality",
                "Christianity",
                "Education",
              ]),
            },
            {
              id: 6720001,
              url: "https://feeds.buzzsprout.com/2280335.rss",
              title: "Small Ways To Live Well from The Simple Things",
              description:
                '<p>Small Ways to Live Well is a podcast from <a href="http://thesimplethings.com/">The Simple Things</a>, a monthly magazine about slowing down, remembering what’s important and making the most of where you live.&nbsp;</p><p></p><p>Hosted by the Editor, <a href="https://www.instagram.com/lisasthinks/">Lisa Sykes</a>, in Season 5: Return of the light, she’ll be seeking out glimpses of spring, shrugging off winter and embracing some self-care, alongside wellbeing editor <a href="https://www.instagram.com/becsfrank/?hl=en-gb">Becs Frank</a> and regular contributor <a href="https://www.instagram.com/slowjotinsley/">Jo Tinsley</a>.&nbsp;</p><p>&nbsp;</p><p>The beginning of February marks the half-way point between the winter solstice and the spring equinox, from here on in there are increasing glimpses of spring right through to the clocks going forward in late March when hopefully the proverbial lion turns into a lamb. This is an optimistic, forward-looking time, when we’re more than ready to come out of hibernation to take on new projects. And there are festivals and feasts to brighten the still grey days. February is the chilliest month but it’s all about cold hands and warm hearts.</p><p>Let our podcast be your soothing companion to see out winter and welcome in spring.&nbsp; Six episodes released weekly from 9 February. Plus don’t miss our Easter Special on Good Friday. Season 5: Return of the Light is supported by <a href="https://www.blackdownshepherdhuts.co.uk/">Blackdown Shepherd Huts</a></p><p>&nbsp;</p><p>To subscribe or order a copy of The Simple Things visit <a href="http://thesimplethings.com/">thesimplethings.com</a></p>',
              author: "The Simple Things",
              image:
                "https://storage.buzzsprout.com/pew3t9f93cc2n5uj1uu1g408ccso?.jpg",
              latestPublishTime: 1739685600,
              language: "English (United Kingdom)", // "en-gb"
              categories: expect.arrayContaining([
                "Leisure",
                "Home",
                "Garden",
                "Arts",
                "Food",
                "Books",
              ]),
            },
            {
              id: 326131,
              url: "https://feeds.megaphone.fm/MJS8122694951",
              title: "Italian Wine Podcast",
              description:
                "<p>The Italian Wine Podcast is a storytelling project dedicated to the fascinating world of Italian wine. New episodes are published every day – so stay tuned! With more grape varieties and more diverse grape growing regions than any other country in the world, the story of Italian wine is a rich and captivating one.&nbsp;While the popularity of Italian wine continues to grow in every corner of the globe, inspired by a deep affection for the Italian way of life, the Italian Wine Podcast seeks to entertain, educate and inform. Embracing Italian food, travel, lifestyle and culture, IWP has something for every taste!</p>",
              author: "Italian Wine Podcast",
              image:
                "https://megaphone.imgix.net/podcasts/574248e4-87b2-11ee-ac3b-b71ab9b899c4/image/Italian_Wine_Podcast_Logo.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
              latestPublishTime: 1739689200,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Society",
                "Culture",
                "Education",
                "Arts",
                "Food",
              ]),
            },
            {
              id: 7047251,
              url: "https://feeds.simplecast.com/0KaqgeVz",
              title: "\u0645\u064f\u0644\u062e\u0635 \u0643\u062a\u0627\u0628",
              description:
                '"\u0627\u0633\u062a\u0645\u0639 \u0625\u0644\u0649 \u0639\u0627\u0644\u0645 \u0627\u0644\u0645\u0639\u0631\u0641\u0629 \u0641\u064a \u062f\u0642\u0627\u0626\u0642 \u0645\u0639\u062f\u0648\u062f\u0629! \u0628\u0648\u062f\u0643\u0627\u0633\u062a\u0646\u0627 \u064a\u0642\u062f\u0645 \u0644\u0643 \u0645\u0644\u062e\u0635\u0627\u062a \u0634\u0627\u0645\u0644\u0629 \u0644\u0623\u0641\u0636\u0644 \u0627\u0644\u0643\u062a\u0628 \u0627\u0644\u0635\u0648\u062a\u064a\u0629 \u0641\u064a \u0645\u062e\u062a\u0644\u0641 \u0627\u0644\u0645\u062c\u0627\u0644\u0627\u062a. \u0633\u0648\u0627\u0621 \u0643\u0646\u062a \u0645\u0647\u062a\u0645\u064b\u0627 \u0628\u0627\u0644\u062a\u0646\u0645\u064a\u0629 \u0627\u0644\u0630\u0627\u062a\u064a\u0629\u060c \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u060c \u0627\u0644\u0631\u0648\u0627\u064a\u0627\u062a\u060c \u0623\u0648 \u0627\u0644\u0639\u0644\u0648\u0645\u060c \u0633\u062a\u062c\u062f \u0647\u0646\u0627 \u0645\u0627 \u064a\u0646\u0627\u0633\u0628\u0643. \u0627\u0643\u062a\u0634\u0641 \u0623\u0641\u0643\u0627\u0631\u064b\u0627 \u062c\u062f\u064a\u062f\u0629 \u0648\u062a\u0639\u0644\u0645 \u0645\u0647\u0627\u0631\u0627\u062a \u062c\u062f\u064a\u062f\u0629 \u0628\u0633\u0647\u0648\u0644\u0629 \u0648\u0633\u0631\u0639\u0629."',
              author: "Podcast Record",
              image:
                "https://image.simplecastcdn.com/images/544c1a06-61e0-4953-a93b-b6db1f762553/7d771380-c071-4a0e-8e6f-e8a2e48442c5/3000x3000/brofyl-bodkst-15.jpg?aid=rss_feed",
              latestPublishTime: 1739689200,
              language: "Arabic", // "ar"
              categories: expect.arrayContaining([
                "Arts",
                "Books",
                "Business",
                "Management",
                "Education",
                "Self Improvement",
              ]),
            },
            {
              id: 9027,
              url: "https://feeds.podetize.com/rss/NVHM9NnC7k",
              title: "Going North Podcast",
              description:
                '<p><span style="color: rgb(34, 34, 34);">Calling all aspiring authors and seasoned wordsmiths alike! This is your official invitation to live your best life and write the book that\'s burning inside you.</span></p><p></p><p><span style="color: rgb(34, 34, 34);">The Going North Podcast is your one-stop shop for inspiration, information, and motivation on your author journey. Every Monday, Thursday,&nbsp;and Saturday, host Dom Brightmon, the positive thought catalyst, bestselling author, and certified trainer with the Maxwell Leadership Team chats with incredible authors from around the world.</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p></p><p><span style="color: rgb(34, 34, 34);">These inspiring guests share their unique stories, writing tips, and the power they\'ve found in the written word. With each episode, you\'ll discover a treasure trove of wisdom, actionable advice, and heartfelt stories that will ignite your creativity and fuel your journey to get your own manuscript moving!</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p></p><p><span style="color: rgb(34, 34, 34);">But Going North isn\'t just about the craft – it\'s about you. Dom believes in the magic of "Advancing others to advance yourself," and this podcast is all about helping you become the best author and person you can be.</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p></p><p><span style="color: rgb(34, 34, 34);">So, grab your notebook, unleash your creativity, and get ready to be a part of something special. With Going North as your guide, you\'ll be well on your way to living your best life and sharing your story with the world.</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p></p><p><span style="color: rgb(34, 34, 34);">Ready to Go North? Subscribe today!</span></p>',
              author: "Dom Brightmon",
              image: "https://feeds.podetize.com/NqUc4INr4.jpg",
              latestPublishTime: 1739689740,
              language: "English (United States)", // "en-us"
              categories: expect.arrayContaining([
                "Arts",
                "Books",
                "Education",
                "Self Improvement",
              ]),
            },
            {
              id: 4382154,
              url: "https://media.rss.com/tajrobati/feed.xml",
              title: "Ne7ki shway",
              description:
                "<p>\u0627\u0646 \u0643\u0644 \u0645\u0627 \u0623\u0628\u062d\u062b \u0639\u0646\u0647 \u0647\u0648 \u0627\u0644\u0639\u062f\u0644 \u0648 \u0645\u0627 \u0627\u0644\u062d\u0631\u064a\u0629 \u0627\u0644\u0627 \u062c\u0632\u0621 \u0645\u0646 \u0627\u0644\u0639\u062f\u0644 , \u0648\u0644\u0627 \u0623\u0628\u062d\u062b \u0639\u0646 \u0647\u0630\u0627 \u0644\u0630\u0627\u062a\u064a \u0628\u0644 \u0644\u0643\u0644 \u0645\u0646 \u064a\u062a\u0646\u0641\u0633 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0623\u0631\u0636 </p><p>\u0623\u062a\u0639\u0644\u0645\u064f \u0623\u0646\u0651 \u062c\u0650\u0631\u0627\u062d\u064e <strong>\u0627\u0644\u0634\u0647\u064a\u062f</strong> \u062a\u0638\u064e\u0644\u064f\u0651 \u0639\u0646 \u0627\u0644\u062b\u0623\u0631 <strong>\u062a\u0633\u062a\u0641\u0647\u0650\u0645</strong></p>",
              author: "\u062a\u062c\u0631\u0628\u062a\u064a",
              image:
                "https://media.rss.com/tajrobati/20220129_110132_f8f584d54507f90e4f8424d73c2106bc.jpg",
              latestPublishTime: 1739690300,
              language: "Arabic", // "ar"
              categories: expect.arrayContaining([
                "Arts",
                "Books",
                "Education",
                "Self Improvement",
              ]),
            },
            {
              id: 1094738,
              url: "https://feeds.megaphone.fm/SBP5992345420",
              title: "Scott Sigler's Galactic Football League (GFL) Series",
              description:
                `<p>The GFL is a "Space Opera" series of books described as STAR WARS meets THE BLINDSIDE meets THE GODFATHER.&nbsp;</p><p></p><p>Set in a lethal pro football league 700 years in the future, THE ROOKIE is a story that combines the intense gridiron action of "Any Given Sunday" with the space opera style of "Star Wars" and the criminal underworld of "The Godfather." Aliens and humans alike play positions based on physiology, creating receivers that jump 25 feet into the air, linemen that bench-press 1,200 pounds, and linebackers that literally want to eat you. Organized crime runs every franchise, games are fixed, and rival players are assassinated.&nbsp;</p><p></p><p>This multi-part scifi/crime/sports mashup follows a professional American football team across a far-future galaxy. Travel to new worlds, meet new races, and put their quarterback into the dirt.</p><p></p><p>Each novel and novella in the series is or will have its own season, so be sure to start from the beginning.</p><p></p><p>Season 1: THE ROOKIE (GFL Book I) | 27 episodes&nbsp;</p><p>Follow the story of Quentin Barnes, a 19-year-old quarterback prodigy who has been raised all his life to hate and kill those aliens. Quentin must deal with his racism and learn to lead, or he'll wind up just another stat in the column marked "killed on the field."</p><p>Season 2: TITLE FIGHT (GFL Novella I) | 10 episodes</p><p>Season 3: THE STARTER (GFL Book II) | 36 episodes</p><p>Season 4: THE ALL-PRO (GFL Book III) | 36 episodes</p><p>Season 5: THE RIDER (GFL Novella II) | 16 episodes</p><p>Season 6: THE DETECTIVE (GFL Novella III) | 10 episodes</p><p>Season 7: THE REPORTER (GFL Novella IV) | 12 episodes</p><p>Current Season: THE MVP (GFL Book IV)</p><p></p><ul>\n` +
                '<li>Written and Performed by <a href="http://www.scottsigler.com">Scott Sigler</a>\n' +
                "</li>\n" +
                '<li>Produced by <a href="https://abkovacscom.wordpress.com">AB Kovacs</a> and Arioch Morningstar</li>\n' +
                '<li>Engineered by <a href="http://steveriekeberg.com">Steve Riekeberg</a>\n' +
                "</li>\n" +
                '<li>Production Assistance by <a href="http://www.alliepress.net/">Allie Press</a>\n' +
                "</li>\n" +
                '<li>Copyright 2024 by <a href="http://www.emptyset.com">Empty Set Entertainment&nbsp;</a>\n' +
                "</li>\n" +
                '<li>Consultation by <a href="https://www.evoterra.com/">Evo Terra</a>\n' +
                "</li>\n" +
                '</ul><p></p><p></p><p>For more from Scott Sigler, please visit <a href="https://scottsigler.com/">https://scottsigler.com</a></p>',
              author: "Scott Sigler",
              image:
                "https://megaphone.imgix.net/podcasts/59251d50-fefd-11ed-8969-6395ca5bb0c1/image/GFL-Album-Art.jpeg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
              latestPublishTime: 1739692800,
              language: "English", // "en"
              categories: expect.arrayContaining([
                "Arts",
                "Books",
                "Fiction",
                "Science",
              ]),
            },
          ]),
        })
      )
    })
  })

  describe("given offset parameter", () => {
    test("should return offset trending podcasts when offset is given", async () => {
      const defaultPodcasts = getDefaultTrendingPodcasts()
      const expectedOffset = 5
      const limit = 10

      const expectedPodcastResponse = {
        ...defaultPodcasts,
        count: defaultPodcasts.data.slice(
          expectedOffset,
          expectedOffset + limit
        ).length,
        data: defaultPodcasts.data.slice(
          expectedOffset,
          expectedOffset + limit
        ),
      }
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/trending?offset=${expectedOffset}&limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toEqual(200)
      expect(response.body).toEqual(
        expect.objectContaining(expectedPodcastResponse)
      )
    })

    test("should return offset trending podcasts when zero offset is given", async () => {
      const expectedPodcastResponse = getDefaultTrendingPodcasts()
      const expectedOffset = 0
      const limit = 10
      const app = setupApp()
      const response = await request(app)
        .get(`/api/podcast/trending?offset=${expectedOffset}&limit=${limit}`)
        .set("Origin", expectedOrigin)
      expect(response.status).toEqual(200)
      expect(response.body).toEqual(
        expect.objectContaining(expectedPodcastResponse)
      )
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
        expect.objectContaining(getDefaultTrendingPodcasts())
      )
    }
  })
})

function getDefaultTrendingPodcasts() {
  return {
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
          'Yaron Brook discusses news, culture and politics from the principled perspective of Ayn Rand\'s philosophy, Objectivism. Want more? Visit www.YaronBrookShow.com and become a Yaron Brook Show supporter to get exclusive content and support the creation of more content like this! https://www.patreon.com/YaronBrookShow.Become a supporter of this podcast: <a href="https://www.spreaker.com/podcast/yaron-brook-show--3276901/support?utm_source=rss&amp;utm_medium=rss&amp;utm_campaign=rss">https://www.spreaker.com/podcast/yaron-brook-show--3276901/support</a>.',
        author: "Yaron Brook",
        image:
          "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/05714427c5ec56fdeaef37ed2defdfdd.jpg",
        latestPublishTime: 1737835746,
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
        language: "English", // "en"
        categories: expect.arrayContaining(["Arts", "Education", "How To"]),
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
        language: "English", // "en"
        categories: expect.arrayContaining(["Arts", "Education", "How To"]),
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
        language: "English", // "en"
        categories: expect.arrayContaining([
          "Education",
          "Society",
          "Culture",
          "Self Improvement",
        ]),
      },
    ],
  }
}
