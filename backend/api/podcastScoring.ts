export function rankPodcastTextScore(text: string): number {
  let score = 1
  if (!text) {
    return 0
  }
  const words = text.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)

  score += uniqueWords.size

  if (text === text.toUpperCase()) {
    score *= 0.7
  }

  return score
}
