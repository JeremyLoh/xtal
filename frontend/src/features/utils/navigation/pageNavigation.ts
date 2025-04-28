function getPodcastDetailPath({
  podcastTitle,
  podcastId,
}: {
  podcastTitle: string
  podcastId: string
}) {
  return `/podcasts/${encodeURIComponent(podcastTitle)}/${podcastId}`
}

function getPodcastEpisodeDetailPath({
  podcastTitle,
  podcastId,
  episodeId,
}: {
  podcastTitle: string
  podcastId: string
  episodeId: string
}) {
  return `/podcasts/${encodeURIComponent(
    podcastTitle
  )}/${podcastId}/${episodeId}`
}

export { getPodcastDetailPath, getPodcastEpisodeDetailPath }
