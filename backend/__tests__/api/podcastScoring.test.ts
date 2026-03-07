import { describe, expect, test } from "vitest"
import { rankPodcastTextScore } from "../../api/podcastScoring.js"

describe("rankPodcastTextScore", () => {
  test("should return 0 for empty text", () => {
    expect(rankPodcastTextScore("")).toBe(0)
  })

  test("should return higher score for text with more words", () => {
    expect(rankPodcastTextScore("a b c")).toBeGreaterThan(
      rankPodcastTextScore("a b")
    )
    expect(rankPodcastTextScore("a b")).toBeGreaterThan(
      rankPodcastTextScore("a")
    )
  })

  test("should return higher score for text with more unique words", () => {
    expect(rankPodcastTextScore("a a a")).toBeLessThan(
      rankPodcastTextScore("a b c")
    )
    expect(rankPodcastTextScore("a b a")).toBeLessThan(
      rankPodcastTextScore("a b c")
    )
  })

  test("should return lower score for text consisting of all capital letters", () => {
    expect(rankPodcastTextScore("A A A")).toBeLessThan(
      rankPodcastTextScore("a a a")
    )

    expect(rankPodcastTextScore("A A A")).toBeLessThan(
      rankPodcastTextScore("A a a")
    )
    expect(rankPodcastTextScore("A A A")).toBeLessThan(
      rankPodcastTextScore("a A a")
    )
    expect(rankPodcastTextScore("A A A")).toBeLessThan(
      rankPodcastTextScore("a a A")
    )
  })

  test("should return same score for same text regardless of case sensitivity (not all uppercase)", () => {
    expect(rankPodcastTextScore("a b c")).toBe(rankPodcastTextScore("A B c"))

    expect(rankPodcastTextScore("a b c")).toBe(rankPodcastTextScore("A b C"))

    expect(rankPodcastTextScore("a b c")).toBe(rankPodcastTextScore("a b c"))
  })
})
